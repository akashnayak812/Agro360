"""
Yield Prediction Model Training
Uses GradientBoostingRegressor.
Features: crop_encoded, area, rainfall, fertilizer_usage, temperature, humidity
Target: yield (tons)
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score
import math
import joblib
import os
import json

DATASET_PATH = os.path.join(os.path.dirname(__file__), 'datasets', 'yield_prediction.csv')
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'saved_models')

CROP_YIELDS = {
    'rice':      {'base_yield': 3.5, 'max_yield': 7.0},
    'wheat':     {'base_yield': 2.8, 'max_yield': 5.5},
    'maize':     {'base_yield': 3.0, 'max_yield': 8.0},
    'cotton':    {'base_yield': 1.5, 'max_yield': 3.0},
    'sugarcane': {'base_yield': 50,  'max_yield': 100},
    'potato':    {'base_yield': 15,  'max_yield': 35},
    'tomato':    {'base_yield': 20,  'max_yield': 45},
    'banana':    {'base_yield': 25,  'max_yield': 50},
    'mango':     {'base_yield': 5,   'max_yield': 15},
    'coffee':    {'base_yield': 1.0, 'max_yield': 3.0},
}


def generate_synthetic_dataset(n_per_crop=200):
    rows = []
    np.random.seed(42)
    for crop, yld in CROP_YIELDS.items():
        for _ in range(n_per_crop):
            area = round(np.random.uniform(0.5, 20), 1)
            rainfall = round(np.random.uniform(50, 350), 1)
            fertilizer = round(np.random.uniform(50, 600), 1)
            temperature = round(np.random.uniform(15, 38), 1)
            humidity = round(np.random.uniform(30, 95), 1)
            
            # Yield model: base + bonus from rainfall + fertilizer, scaled by area
            rain_factor = min(1.0, rainfall / 200)
            fert_factor = min(1.0, fertilizer / 400)
            temp_penalty = 1.0 - max(0, abs(temperature - 27) - 8) / 20
            base = yld['base_yield']
            max_y = yld['max_yield']
            
            per_hectare = base + (max_y - base) * (0.4 * rain_factor + 0.4 * fert_factor + 0.2 * temp_penalty)
            per_hectare = max(base * 0.5, per_hectare * np.random.uniform(0.85, 1.15))
            total_yield = round(per_hectare * area, 2)
            
            rows.append({
                'crop': crop,
                'area': area,
                'rainfall': rainfall,
                'fertilizer': fertilizer,
                'temperature': temperature,
                'humidity': humidity,
                'yield': total_yield
            })
    return pd.DataFrame(rows).sample(frac=1, random_state=42).reset_index(drop=True)


def train():
    if os.path.exists(DATASET_PATH):
        df = pd.read_csv(DATASET_PATH)
    else:
        print("Generating synthetic yield dataset...")
        df = generate_synthetic_dataset()
        os.makedirs(os.path.dirname(DATASET_PATH), exist_ok=True)
        df.to_csv(DATASET_PATH, index=False)
    
    le_crop = LabelEncoder()
    df['crop_encoded'] = le_crop.fit_transform(df['crop'])
    
    feature_cols = ['crop_encoded', 'area', 'rainfall', 'fertilizer', 'temperature', 'humidity']
    X = df[feature_cols].values
    y = df['yield'].values
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training GradientBoostingRegressor...")
    model = GradientBoostingRegressor(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        random_state=42
    )
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    from sklearn.metrics import mean_squared_error as mse_func
    rmse = math.sqrt(mse_func(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    print(f"\nRMSE: {rmse:.2f}, R²: {r2:.4f}")
    
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, os.path.join(MODEL_DIR, 'yield_model.pkl'))
    joblib.dump(le_crop, os.path.join(MODEL_DIR, 'yield_crop_encoder.pkl'))
    
    with open(os.path.join(MODEL_DIR, 'yield_crops.json'), 'w') as f:
        json.dump(list(le_crop.classes_), f)
    
    print(f"Model saved to {MODEL_DIR}/yield_model.pkl")
    return r2


if __name__ == '__main__':
    train()
