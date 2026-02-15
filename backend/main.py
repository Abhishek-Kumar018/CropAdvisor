# main.py (FIXED VERSION)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np
import joblib
from typing import Optional
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Crop Recommendation API",
    description="AI-powered crop recommendation based on soil, weather, and market data",
    version="2.0"
)

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Input Model ----------
class FarmerInput(BaseModel):
    soil_type: str = Field(..., description="Soil type: Loamy, Clay, Sandy, or Black")
    season: str = Field(..., description="Season: Rabi, Kharif, or Summer")
    state: str = Field(..., description="State name")
    district: str = Field(..., description="District name")
    market: str = Field(..., description="Market name")
    
    class Config:
        schema_extra = {
            "example": {
                "soil_type": "Loamy",
                "season": "Kharif",
                "state": "Karnataka",
                "district": "Belagavi",
                "market": "Belgaum"
            }
        }


# ---------- Soil & Season Mapping ----------
soil_map = {
    "Loamy": {"N": 50, "P": 40, "K": 50, "ph": 6.5},
    "Clay": {"N": 40, "P": 30, "K": 40, "ph": 7.0},
    "Sandy": {"N": 30, "P": 20, "K": 30, "ph": 6.0},
    "Black": {"N": 60, "P": 50, "K": 60, "ph": 7.5},
}

season_map = {
    "Rabi": {"temperature": 20, "humidity": 50, "rainfall": 100},
    "Kharif": {"temperature": 28, "humidity": 70, "rainfall": 300},
    "Summer": {"temperature": 35, "humidity": 40, "rainfall": 50},
}

# ---------- Global models dict ----------
models_dict = None
model_load_error: str | None = None
MODEL_PATH = Path(__file__).resolve().parent / "all_models.pkl"


# ---------- Load Models on Startup ----------
@app.on_event("startup")
async def load_models():
    """Load all models and preprocessors on application startup"""
    global models_dict, model_load_error
    model_load_error = None
    try:
        models_dict = joblib.load(MODEL_PATH)
        logger.info(f"✅ Models loaded successfully from {MODEL_PATH}:")
        logger.info(f"   - Suitability Model: {type(models_dict['suitability_model']).__name__}")
        logger.info(f"   - Price Model: {type(models_dict['price_model']).__name__}")
        logger.info(f"   - Available crops: {len(models_dict['crop_encoder'].classes_)}")
        logger.info(f"   - Crops with prices: {len(models_dict['avg_prices_by_crop'])}")
    except FileNotFoundError:
        model_load_error = "'all_models.pkl' not found. Please train the model first."
        logger.error("❌ " + model_load_error)
        models_dict = None
    except Exception as e:
        model_load_error = f"Error loading models: {e}"
        logger.error("❌ " + model_load_error)
        models_dict = None


# ---------- Helper Functions ----------
def validate_inputs(farmer_input: FarmerInput):
    """Validate farmer input"""
    if farmer_input.soil_type not in soil_map:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid soil type. Must be one of: {', '.join(soil_map.keys())}"
        )
    if farmer_input.season not in season_map:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid season. Must be one of: {', '.join(season_map.keys())}"
        )


def safe_encode(encoder, value):
    """Safely encode a value, return None if not found"""
    try:
        return int(encoder.transform([value])[0])
    except:
        return None


def find_price_for_crop(crop_name, avg_prices_by_crop, le_commodity):
    """
    Try multiple strategies to find price for a crop:
    1. Exact match (case-sensitive)
    2. Case-insensitive match
    3. Lowercase match
    4. Partial match
    """
    # Strategy 1: Exact match
    if crop_name in avg_prices_by_crop:
        return avg_prices_by_crop[crop_name]
    
    # Strategy 2: Case-insensitive exact match
    crop_lower = crop_name.lower().strip()
    for price_crop, price in avg_prices_by_crop.items():
        if price_crop.lower().strip() == crop_lower:
            return price
    
    # Strategy 3: Check if crop exists in commodity encoder
    commodity_classes = le_commodity.classes_
    for commodity in commodity_classes:
        if commodity.lower().strip() == crop_lower:
            if commodity in avg_prices_by_crop:
                return avg_prices_by_crop[commodity]
    
    # Strategy 4: Partial match (e.g., "blackgram" matches "Black Gram")
    for price_crop, price in avg_prices_by_crop.items():
        price_crop_clean = price_crop.lower().strip().replace(" ", "").replace("-", "")
        crop_clean = crop_lower.replace(" ", "").replace("-", "")
        if price_crop_clean == crop_clean or crop_clean in price_crop_clean:
            return price
    
    return None


def recommend_crops_api(farmer_input: FarmerInput, top_k=3, price_weight=0.6, suit_weight=0.4):
    """
    Recommend crops based on suitability and profitability
    """
    # Extract models
    scaler = models_dict['scaler']
    label_encoders = models_dict['label_encoders']
    numeric_cols = models_dict['numeric_cols']
    suit_model = models_dict['suitability_model']
    le_crop = models_dict['crop_encoder']
    price_model = models_dict['price_model']
    avg_prices_by_crop = models_dict['avg_prices_by_crop']
    
    # Get soil and season parameters
    soil = soil_map[farmer_input.soil_type]
    season = season_map[farmer_input.season]
    
    # Prepare environmental features
    env_raw = np.array([[
        soil["N"], soil["P"], soil["K"],
        season["temperature"], season["humidity"],
        soil["ph"], season["rainfall"]
    ]], dtype=float)
    
    env_scaled = scaler.transform(env_raw)
    
    # Get suitability probabilities for all crops
    suit_probs = suit_model.predict_proba(env_scaled)[0]
    crop_classes = le_crop.classes_
    
    # Prepare location encoders
    le_state = label_encoders['state']
    le_district = label_encoders['district']
    le_market = label_encoders['market']
    le_commodity = label_encoders['commodity']
    
    # Encode user location
    s_enc = safe_encode(le_state, farmer_input.state)
    d_enc = safe_encode(le_district, farmer_input.district)
    m_enc = safe_encode(le_market, farmer_input.market)
    
    # Calculate scores for each crop
    results = []
    
    for idx, crop in enumerate(crop_classes):
        suit_score = float(suit_probs[idx])
        
        # Skip crops with very low suitability
        if suit_score < 0.01:
            continue
        
        # Strategy 1: Try location-specific price prediction
        pred_price = None
        c_enc = safe_encode(le_commodity, crop)
        
        if c_enc is not None and s_enc is not None and d_enc is not None and m_enc is not None:
            try:
                X_price = np.array([[s_enc, d_enc, m_enc, c_enc]])
                pred_price = float(price_model.predict(X_price)[0])
                logger.debug(f"Location price for {crop}: ₹{pred_price}")
            except Exception as e:
                logger.debug(f"Location price prediction failed for {crop}: {e}")
        
        # Strategy 2: Use improved fallback price lookup
        if pred_price is None:
            pred_price = find_price_for_crop(crop, avg_prices_by_crop, le_commodity)
            if pred_price:
                logger.info(f"Using fallback price for {crop}: ₹{pred_price}")
            else:
                logger.warning(f"No price found for {crop}")
        
        results.append({
            "crop": crop,
            "predicted_price": pred_price,
            "suitability_score": suit_score
        })
    
    # Debug: Log price availability
    priced_count = sum(1 for r in results if r['predicted_price'] is not None)
    logger.info(f"Crops with prices: {priced_count}/{len(results)}")
    
    # Normalize scores and calculate combined score
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
                    # Combined score only for crops with prices
                    r['combined_score'] = price_weight * norm_price + suit_weight * norm_suit
                else:
                    # For crops without price, use only suitability
                    r['combined_score'] = norm_suit * suit_weight  # Lower weight since no price data
        else:
            # No prices available at all - use only suitability
            logger.warning("No price data available for any crop")
            for r in results:
                r['combined_score'] = r['suitability_score']
    
    # Sort by combined score
    results_sorted = sorted(results, key=lambda x: x['combined_score'], reverse=True)
    
    # Get top_k results
    top_list = []
    for item in results_sorted[:top_k]:
        top_list.append({
            "crop": item["crop"],
            "predicted_price": round(item["predicted_price"], 2) if item["predicted_price"] is not None else None,
            "suitability_score": round(item["suitability_score"] * 100, 2),  # Convert to percentage
            "combined_score": round(item["combined_score"] * 100, 2)  # Convert to percentage
        })
    
    # Find best by each criterion
    best_by_suit = max(results, key=lambda r: r['suitability_score'])
    
    # Most profitable: ONLY from crops that have actual prices
    priced_results = [r for r in results if r['predicted_price'] is not None]
    most_profitable = None
    most_profitable_price = None
    
    if priced_results:
        most_profitable_crop = max(priced_results, key=lambda r: r['combined_score'])
        most_profitable = most_profitable_crop['crop']
        most_profitable_price = most_profitable_crop['predicted_price']
    
    return {
        "suitable_crop": best_by_suit["crop"],
        "most_profitable_crop": most_profitable if most_profitable else best_by_suit["crop"],
        "most_profitable_price": round(most_profitable_price, 2) if most_profitable_price else None,
        "top_3": top_list,
        "environment": {
            "soil_type": farmer_input.soil_type,
            "season": farmer_input.season,
            "state": farmer_input.state,
            "district": farmer_input.district,
            "market": farmer_input.market,
            "derived_parameters": {
                "N": soil["N"],
                "P": soil["P"],
                "K": soil["K"],
                "temperature": season["temperature"],
                "humidity": season["humidity"],
                "ph": soil["ph"],
                "rainfall": season["rainfall"]
            }
        },
        "scoring_weights": {
            "price_weight": price_weight,
            "suitability_weight": suit_weight
        },
        "debug_info": {
            "total_crops_evaluated": len(results),
            "crops_with_prices": len(priced_results),
            "crops_without_prices": len(results) - len(priced_results)
        }
    }


# ---------- Prediction Endpoint ----------
@app.post("/predict", 
    summary="Get Crop Recommendations",
    description="Returns top 3 crop recommendations based on soil type, season, and location")
async def predict_crop(farmer_input: FarmerInput):
    """
    Predict the most suitable and profitable crops based on:
    - Soil type (Loamy, Clay, Sandy, Black)
    - Season (Rabi, Kharif, Summer)
    - Location (State, District, Market)
    """
    
    if models_dict is None:
        raise HTTPException(
            status_code=503, 
            detail="Models not loaded. Please contact the administrator."
        )
    
    try:
        # Validate inputs
        validate_inputs(farmer_input)
        
        # Get recommendations
        result = recommend_crops_api(
            farmer_input, 
            top_k=3, 
            price_weight=0.6, 
            suit_weight=0.4
        )
        
        logger.info(f"Prediction successful for {farmer_input.state} - {farmer_input.district}")
        return result
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# ---------- Health Check ----------
@app.get("/health", summary="Health Check")
async def health_check():
    """Check if the API and models are loaded correctly"""
    return {
        "status": "healthy" if models_dict is not None else "unhealthy",
        "models_loaded": models_dict is not None,
        "version": "2.0",
        "model_path": str(MODEL_PATH),
        "model_load_error": model_load_error,
    }


# ---------- Model Info ----------
@app.get("/model-info", summary="Model Information")
async def model_info():
    """Get information about loaded models"""
    if models_dict is None:
        raise HTTPException(status_code=503, detail="Models not loaded")
    
    return {
        "suitability_model": type(models_dict['suitability_model']).__name__,
        "price_model": type(models_dict['price_model']).__name__,
        "available_crops": len(models_dict['crop_encoder'].classes_),
        "crops_with_price_data": len(models_dict['avg_prices_by_crop']),
        "crop_list": models_dict['crop_encoder'].classes_.tolist()[:10],
        "supported_soil_types": list(soil_map.keys()),
        "supported_seasons": list(season_map.keys())
    }


# ---------- Get Supported Values ----------
@app.get("/supported-values", summary="Get Supported Input Values")
async def get_supported_values():
    """Get all supported soil types, seasons, and their parameters"""
    return {
        "soil_types": soil_map,
        "seasons": season_map
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
