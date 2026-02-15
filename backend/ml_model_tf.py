# train_and_recommend.py (AUGMENTED VERSION - ALL CROPS FROM PRICE DATA)
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import (
    RandomForestClassifier, 
    RandomForestRegressor,
    GradientBoostingRegressor,
    VotingRegressor
)
from sklearn.linear_model import Ridge
from sklearn.metrics import accuracy_score, mean_absolute_error, r2_score
import joblib
import json
import warnings
warnings.filterwarnings('ignore')


def augment_suitability_data(crop_suitable, crop_price, min_samples=2):
    """
    Augment crop_suitable data to include ALL crops from crop_price.csv
    Creates synthetic suitability data for missing crops based on similar crops
    """
    
    if 'Crop' in crop_suitable.columns:
        crop_suitable.rename(columns={'Crop': 'label'}, inplace=True)
    
    # Get unique crops from price data
    price_crops = set(crop_price['Commodity'].str.strip().str.lower().unique())
    suitable_crops = set(crop_suitable['label'].str.strip().str.lower().unique())
    
    print(f"\n📊 Crop Analysis:")
    print(f"   Crops in crop_suitable.csv: {len(suitable_crops)}")
    print(f"   Crops in crop_price.csv: {len(price_crops)}")
    
    # Find crops only in price data (need to create suitability for these)
    missing_crops = price_crops - suitable_crops
    print(f"   Crops missing suitability data: {len(missing_crops)}")
    
    numeric_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    
    # Calculate crop category averages for imputation
    crop_categories = {
        'cereals': ['rice', 'wheat', 'maize', 'bajra', 'jowar', 'ragi'],
        'pulses': ['chickpea', 'pigeonpeas', 'lentil', 'mungbean', 'blackgram', 
                   'mothbeans', 'kidneybeans', 'gram', 'moong', 'tur', 'arhar'],
        'fruits': ['banana', 'mango', 'grapes', 'apple', 'orange', 'papaya', 
                   'pomegranate', 'watermelon', 'muskmelon', 'guava', 'lemon'],
        'vegetables': ['potato', 'onion', 'tomato', 'cabbage', 'cauliflower', 
                       'brinjal', 'carrot', 'beans', 'peas', 'capsicum'],
        'cash_crops': ['cotton', 'jute', 'sugarcane', 'tobacco', 'tea', 'coffee'],
        'oilseeds': ['groundnut', 'mustard', 'soybean', 'sunflower', 'sesame'],
        'spices': ['turmeric', 'chilli', 'pepper', 'ginger', 'garlic', 'coriander']
    }
    
    # Calculate average parameters for each category
    category_averages = {}
    for category, crop_list in crop_categories.items():
        mask = crop_suitable['label'].str.lower().isin(crop_list)
        if mask.any():
            category_averages[category] = crop_suitable[mask][numeric_cols].mean()
    
    # If no category matches found, use overall average
    overall_average = crop_suitable[numeric_cols].mean()
    
    def get_category(crop_name):
        """Determine crop category based on name"""
        crop_lower = crop_name.lower()
        for category, crop_list in crop_categories.items():
            if any(keyword in crop_lower for keyword in crop_list):
                return category
        return 'general'
    
    def generate_synthetic_samples(crop_name, base_values, n_samples=10):
        """Generate synthetic samples with controlled variation"""
        samples = []
        for i in range(n_samples):
            # Add random noise: 5-10% variation
            noise_factor = np.random.uniform(0.90, 1.10, size=len(base_values))
            synthetic_sample = base_values * noise_factor
            samples.append(synthetic_sample)
        return np.array(samples)
    
    # Create synthetic data for missing crops
    augmented_rows = []
    
    for missing_crop in missing_crops:
        # Find matching crop in price data to get original case
        original_name = crop_price[crop_price['Commodity'].str.lower() == missing_crop]['Commodity'].iloc[0]
        
        category = get_category(missing_crop)
        
        # Get base values from category average or overall average
        if category in category_averages:
            base_values = category_averages[category].values
        else:
            base_values = overall_average.values
        
        # Generate synthetic samples
        synthetic_samples = generate_synthetic_samples(original_name, base_values, n_samples=min_samples)
        
        for sample in synthetic_samples:
            new_row = {col: val for col, val in zip(numeric_cols, sample)}
            new_row['label'] = original_name
            augmented_rows.append(new_row)
    
    if augmented_rows:
        augmented_df = pd.DataFrame(augmented_rows)
        combined_data = pd.concat([crop_suitable, augmented_df], ignore_index=True)
        print(f"   ✅ Added {len(augmented_rows)} synthetic samples for {len(missing_crops)} crops")
    else:
        combined_data = crop_suitable.copy()
    
    # Also handle crops with only 1 sample in original data
    crop_counts = combined_data['label'].value_counts()
    single_sample_crops = crop_counts[crop_counts == 1]
    
    if len(single_sample_crops) > 0:
        print(f"   ⚙️  Augmenting {len(single_sample_crops)} crops with single samples...")
        
        more_augmented = []
        for crop in single_sample_crops.index:
            crop_data = combined_data[combined_data['label'] == crop]
            base_values = crop_data[numeric_cols].iloc[0].values
            
            # Generate 1 more sample to meet minimum requirement
            synthetic_samples = generate_synthetic_samples(crop, base_values, n_samples=1)
            for sample in synthetic_samples:
                new_row = {col: val for col, val in zip(numeric_cols, sample)}
                new_row['label'] = crop
                more_augmented.append(new_row)
        
        if more_augmented:
            more_augmented_df = pd.DataFrame(more_augmented)
            combined_data = pd.concat([combined_data, more_augmented_df], ignore_index=True)
    
    final_crop_counts = combined_data['label'].value_counts()
    print(f"\n✅ Final Dataset:")
    print(f"   Total crops: {len(final_crop_counts)}")
    print(f"   Total samples: {len(combined_data)}")
    print(f"   Min samples per crop: {final_crop_counts.min()}")
    print(f"   Max samples per crop: {final_crop_counts.max()}")
    
    return combined_data


def validate_user_input(user_input):
    """Validate user input ranges"""
    validations = {
        'N': (0, 200, "Nitrogen (N)"),
        'P': (0, 200, "Phosphorus (P)"),
        'K': (0, 200, "Potassium (K)"),
        'temperature': (-10, 60, "Temperature"),
        'humidity': (0, 100, "Humidity"),
        'ph': (0, 14, "pH"),
        'rainfall': (0, 500, "Rainfall")
    }
    
    for key, (min_val, max_val, name) in validations.items():
        if key in user_input:
            val = user_input[key]
            if not (min_val <= val <= max_val):
                raise ValueError(f"{name} should be between {min_val}-{max_val}, got {val}")
    
    required_keys = ['state', 'district', 'market', 'N', 'P', 'K', 
                     'temperature', 'humidity', 'ph', 'rainfall']
    for key in required_keys:
        if key not in user_input:
            raise ValueError(f"Missing required input: {key}")
    
    return True


def train_model():
    print("=" * 60)
    print("🌾 CROP RECOMMENDATION MODEL TRAINING")
    print("=" * 60)
    
    # 1️⃣ Load datasets
    print("\n📂 Loading datasets...")
    crop_price = pd.read_csv("crop_price.csv")
    crop_suitable_raw = pd.read_csv("crop_suitable.csv")
    
    # 🔧 AUGMENT DATA - Add all crops from price data (before renaming)
    crop_suitable = augment_suitability_data(crop_suitable_raw, crop_price, min_samples=2)
    
    # Clean column names in price data
    crop_price.rename(columns={
        'State': 'state',
        'District': 'district',
        'Market': 'market',
        'Commodity': 'commodity',
        'Modal_x0020_Price': 'price'
    }, inplace=True)
    
    crop_price = crop_price.dropna(subset=['price'])
    crop_price['price'] = pd.to_numeric(crop_price['price'], errors='coerce')
    crop_price = crop_price.dropna(subset=['price'])
    
    # 2️⃣ Average price per crop
    print("\n🧹 Processing price data...")
    avg_price = crop_price.groupby(['state', 'district', 'market', 'commodity'])['price'].mean().reset_index()
    avg_prices_by_crop = crop_price.groupby('commodity')['price'].mean().to_dict()
    
    # 3️⃣ Encode categorical columns for price model
    print("🔢 Encoding categorical variables...")
    label_encoders = {}
    for col in ['state', 'district', 'market', 'commodity']:
        le = LabelEncoder()
        avg_price[col] = le.fit_transform(avg_price[col].astype(str))
        label_encoders[col] = le
    
    # 4️⃣ Prepare scaler for environmental features
    numeric_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    
    scaler = StandardScaler()
    X_suit_raw = crop_suitable[numeric_cols].astype(float)
    X_suit_scaled = scaler.fit_transform(X_suit_raw)
    
    # 5️⃣ Train SUITABILITY MODEL (Random Forest Classifier)
    print("\n🌱 Training Suitability Model (Random Forest Classifier)...")
    
    le_crop = LabelEncoder()
    y_suit = le_crop.fit_transform(crop_suitable['label'].astype(str))
    
    # Verify all classes have >= 2 samples
    unique, counts = np.unique(y_suit, return_counts=True)
    min_count = counts.min()
    print(f"   Minimum samples per class: {min_count}")
    
    if min_count < 2:
        raise ValueError(f"Still have classes with < 2 samples after augmentation")
    
    # Split with stratification
    X_train_s, X_test_s, y_train_s, y_test_s = train_test_split(
        X_suit_scaled, y_suit, 
        test_size=0.2, 
        random_state=42, 
        stratify=y_suit
    )
    
    # Train Random Forest
    suit_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    
    suit_model.fit(X_train_s, y_train_s)
    
    # Evaluate
    y_pred_suit = suit_model.predict(X_test_s)
    suit_accuracy = accuracy_score(y_test_s, y_pred_suit)
    print(f"   ✅ Test Accuracy: {suit_accuracy:.4f}")
    
    # Cross-validation
    cv_folds = min(3, min_count)
    cv_scores = cross_val_score(suit_model, X_suit_scaled, y_suit, cv=cv_folds, scoring='accuracy')
    print(f"   ✅ Cross-Validation Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': numeric_cols,
        'importance': suit_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n📊 Feature Importance (Suitability):")
    for idx, row in feature_importance.iterrows():
        print(f"   • {row['feature']}: {row['importance']:.4f}")
    
    # 6️⃣ Train PRICE PREDICTION MODEL (Ensemble)
    print("\n💰 Training Price Prediction Model (Ensemble)...")
    
    X_price = avg_price[['state', 'district', 'market', 'commodity']].values
    y_price = avg_price['price'].values
    
    X_train_p, X_test_p, y_train_p, y_test_p = train_test_split(
        X_price, y_price, test_size=0.2, random_state=42
    )
    
    rf_price = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
    gb_price = GradientBoostingRegressor(n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42)
    ridge_price = Ridge(alpha=1.0)
    
    price_model = VotingRegressor(estimators=[('rf', rf_price), ('gb', gb_price), ('ridge', ridge_price)])
    price_model.fit(X_train_p, y_train_p)
    
    # Evaluate
    y_pred_price = price_model.predict(X_test_p)
    mae = mean_absolute_error(y_test_p, y_pred_price)
    r2 = r2_score(y_test_p, y_pred_price)
    
    print(f"   ✅ Mean Absolute Error: ₹{mae:.2f}")
    print(f"   ✅ R² Score: {r2:.4f}")
    
    # 7️⃣ Save models
    print("\n💾 Saving models...")
    
    joblib.dump({
        'scaler': scaler,
        'label_encoders': label_encoders,
        'numeric_cols': numeric_cols,
        'suitability_model': suit_model,
        'crop_encoder': le_crop,
        'price_model': price_model,
        'avg_prices_by_crop': avg_prices_by_crop,
        'feature_importance': feature_importance,
        'valid_crops': le_crop.classes_.tolist()
    }, "all_models.pkl")
    
    print("   ✅ Models saved to 'all_models.pkl'")
    print("\n" + "=" * 60)
    print("✅ TRAINING COMPLETE!")
    print("=" * 60)
    
    return price_model, suit_model, scaler, label_encoders, le_crop, avg_prices_by_crop


def recommend_crops(user_input, models_dict, top_k=3, price_weight=0.6, suit_weight=0.4):
    """Recommend crops based on suitability and profitability"""
    
    validate_user_input(user_input)
    
    scaler = models_dict['scaler']
    label_encoders = models_dict['label_encoders']
    numeric_cols = models_dict['numeric_cols']
    suit_model = models_dict['suitability_model']
    le_crop = models_dict['crop_encoder']
    price_model = models_dict['price_model']
    avg_prices_by_crop = models_dict['avg_prices_by_crop']
    
    env_raw = np.array([[
        user_input['N'], user_input['P'], user_input['K'],
        user_input['temperature'], user_input['humidity'],
        user_input['ph'], user_input['rainfall']
    ]], dtype=float)
    
    env_scaled = scaler.transform(env_raw)
    suit_probs = suit_model.predict_proba(env_scaled)[0]
    crop_classes = le_crop.classes_
    
    le_state = label_encoders['state']
    le_district = label_encoders['district']
    le_market = label_encoders['market']
    le_commodity = label_encoders['commodity']
    
    def safe_encode(enc, val):
        try:
            return int(enc.transform([val])[0])
        except:
            return None
    
    s_enc = safe_encode(le_state, user_input['state'])
    d_enc = safe_encode(le_district, user_input['district'])
    m_enc = safe_encode(le_market, user_input['market'])
    
    results = []
    
    for idx, crop in enumerate(crop_classes):
        suit_score = float(suit_probs[idx])
        
        if suit_score < 0.01:
            continue
        
        pred_price = None
        c_enc = safe_encode(le_commodity, crop)
        
        if c_enc is not None and s_enc is not None and d_enc is not None and m_enc is not None:
            try:
                X_price = np.array([[s_enc, d_enc, m_enc, c_enc]])
                pred_price = float(price_model.predict(X_price)[0])
            except:
                pass
        
        if pred_price is None and crop in avg_prices_by_crop:
            pred_price = avg_prices_by_crop[crop]
        
        results.append({
            "crop": crop,
            "predicted_price": pred_price,
            "suitability_score": suit_score
        })
    
    if results:
        all_prices = [r['predicted_price'] for r in results if r['predicted_price'] is not None]
        all_suits = [r['suitability_score'] for r in results]
        
        if all_prices:
            price_min, price_max = min(all_prices), max(all_prices)
            suit_min, suit_max = min(all_suits), max(all_suits)
            
            for r in results:
                norm_suit = (r['suitability_score'] - suit_min) / (suit_max - suit_min + 1e-8)
                
                if r['predicted_price'] is not None:
                    norm_price = (r['predicted_price'] - price_min) / (price_max - price_min + 1e-8)
                    r['combined_score'] = price_weight * norm_price + suit_weight * norm_suit
                else:
                    r['combined_score'] = norm_suit
        else:
            for r in results:
                r['combined_score'] = r['suitability_score']
    
    results_sorted = sorted(results, key=lambda x: x['combined_score'], reverse=True)
    
    top_list = []
    for item in results_sorted[:top_k]:
        top_list.append({
            "crop": item["crop"],
            "predicted_price": round(item["predicted_price"], 2) if item["predicted_price"] is not None else "N/A",
            "suitability_score": round(item["suitability_score"], 4),
            "combined_score": round(item["combined_score"], 4)
        })
    
    best_by_suit = max(results, key=lambda r: r['suitability_score'])
    priced_results = [r for r in results if r['predicted_price'] is not None]
    most_profitable = None
    if priced_results:
        most_profitable = max(priced_results, key=lambda r: r['combined_score'])['crop']
    
    response = {
        "suitable_crop": best_by_suit["crop"],
        "most_profitable_crop": most_profitable if most_profitable else best_by_suit["crop"],
        "top_3_recommendations": top_list,
        "environment": {
            "state": user_input['state'],
            "district": user_input['district'],
            "market": user_input['market'],
            "N": user_input['N'],
            "P": user_input['P'],
            "K": user_input['K'],
            "temperature": user_input['temperature'],
            "humidity": user_input['humidity'],
            "ph": user_input['ph'],
            "rainfall": user_input['rainfall']
        },
        "scoring_weights": {
            "price_weight": price_weight,
            "suitability_weight": suit_weight
        }
    }
    
    return response


if __name__ == "__main__":
    price_model, suit_model, scaler, label_encoders, le_crop, avg_prices_by_crop = train_model()
    
    models_dict = {
        'scaler': scaler,
        'label_encoders': label_encoders,
        'numeric_cols': ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'],
        'suitability_model': suit_model,
        'crop_encoder': le_crop,
        'price_model': price_model,
        'avg_prices_by_crop': avg_prices_by_crop
    }
    
    user_input = {
        "state": "Karnataka",
        "district": "Belagavi",
        "market": "Belgaum",
        "N": 90,
        "P": 40,
        "K": 40,
        "temperature": 28,
        "humidity": 80,
        "ph": 6.8,
        "rainfall": 200
    }
    
    print("\n\n" + "=" * 60)
    print("🔍 GENERATING RECOMMENDATIONS")
    print("=" * 60)
    
    result = recommend_crops(user_input, models_dict, top_k=3)
    
    print("\n📍 Location:", user_input['state'], "-", user_input['district'])
    print("🌡️  Environment:", f"N={user_input['N']}, P={user_input['P']}, K={user_input['K']}, Temp={user_input['temperature']}°C")
    print("\n" + "=" * 60)
    print("📊 RECOMMENDATIONS")
    print("=" * 60)
    print(json.dumps(result, indent=2))
