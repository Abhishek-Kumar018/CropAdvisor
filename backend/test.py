import pandas as pd

# ==============================
# 1️⃣ LOAD BOTH DATASETS
# ==============================
price = pd.read_csv("crop_price.csv")
suit = pd.read_csv("crop_suitable.csv")

print("✅ Loaded datasets successfully!")
print(f"Price data: {price.shape} | Suitability data: {suit.shape}\n")

# ==============================
# 2️⃣ DEFINE MAPPING DICTIONARY
# ==============================
commodity_to_crop = {
    # 🌾 Grains
    "Rice": ["Rice", "Paddy", "Paddy(Dhan)(Common)", "Paddy(Dhan)(Fine)"],
    "Wheat": ["Wheat"],
    "Maize": ["Maize", "Corn"],
    "Barley": ["Barley"],
    "Bajra": ["Bajra"],
    "Jowar": ["Jowar", "Sorghum", "Jowar(Sorghum)"],
    "Ragi": ["Ragi", "Finger Millet"],

    # 🫘 Pulses / Legumes
    "Gram": ["Gram", "Chana"],
    "Tur": ["Tur", "Arhar", "Red Gram"],
    "Moong": ["Moong", "Green Gram"],
    "Urad": ["Urad", "Black Gram"],
    "Masoor": ["Masoor", "Lentil"],
    "Peas": ["Peas", "Dry Peas"],

    # 🌻 Oilseeds
    "Groundnut": ["Groundnut", "Peanut"],
    "Soybean": ["Soyabean", "Soybean"],
    "Sunflower": ["Sunflower"],
    "Mustard": ["Mustard", "Sarson"],
    "Sesame": ["Sesamum", "Til"],

    # 🍠 Root & Tuber Crops
    "Potato": ["Potato"],
    "Sweet Potato": ["Sweet Potato"],
    "Onion": ["Onion"],
    "Garlic": ["Garlic"],
    "Ginger": ["Ginger"],
    "Turmeric": ["Turmeric"],

    # 🥦 Vegetables
    "Tomato": ["Tomato"],
    "Cabbage": ["Cabbage"],
    "Cauliflower": ["Cauliflower"],
    "Brinjal": ["Brinjal", "Eggplant"],
    "Cucumber": ["Cucumber"],
    "Carrot": ["Carrot"],
    "Beans": ["Beans", "French Beans", "Cluster Beans"],
    "Chilli": ["Chilli", "Dry Chillies"],
    "Capsicum": ["Capsicum"],
    "Okra": ["Bhindi", "Ladies Finger"],
    "Pumpkin": ["Pumpkin"],
    "Bottle Gourd": ["Bottle Gourd", "Lauki", "Doodhi"],
    "Bitter Gourd": ["Bitter Gourd", "Karela"],

    # 🍌 Fruits
    "Banana": ["Banana"],
    "Mango": ["Mango"],
    "Apple": ["Apple"],
    "Papaya": ["Papaya"],
    "Pineapple": ["Pineapple"],
    "Guava": ["Guava"],
    "Watermelon": ["Watermelon"],
    "Muskmelon": ["Muskmelon"],
    "Pomegranate": ["Pomegranate"],
    "Sapota": ["Sapota", "Chikoo"],
    "Amla": ["Amla", "Nelli Kai"],

    # 🌾 Commercial Crops
    "Cotton": ["Cotton", "Kapas"],
    "Sugarcane": ["Sugarcane"],
    "Jute": ["Jute"],
    "Tea": ["Tea"],
    "Coffee": ["Coffee"],
    "Coconut": ["Coconut"],
    "Tobacco": ["Tobacco"]
}


# ==============================
# 3️⃣ FUNCTION TO MAP NAMES
# ==============================
def map_commodity_to_crop(commodity_name):
    for crop, keywords in commodity_to_crop.items():
        for keyword in keywords:
            if keyword.lower() in commodity_name.lower():
                return crop
    return None


# ==============================
# 4️⃣ APPLY MAPPING TO PRICE DATA
# ==============================
price["Crop"] = price["Commodity"].astype(str).apply(map_commodity_to_crop)
price_mapped = price.dropna(subset=["Crop"])

print("✅ Mapping completed.")
print("Mapped crops:", price_mapped["Crop"].nunique())
print("Top mapped crops:\n", price_mapped["Crop"].value_counts().head(10), "\n")


# ==============================
# 5️⃣ MERGE SUITABILITY + PRICE
# ==============================
# Rename 'label' to 'Crop' in suitability data
suit = suit.rename(columns={"label": "Crop"})
merged = pd.merge(suit, price_mapped, on="Crop", how="inner")

print("✅ Merge complete.")
print(f"Merged data shape: {merged.shape}")
print(f"Unique crops after merge: {merged['Crop'].nunique()}\n")

# ==============================
# 6️⃣ SAVE CLEAN MERGED FILE
# ==============================
merged.to_csv("merged_crop_data.csv", index=False)
print("💾 Saved as 'merged_crop_data.csv' successfully!")
