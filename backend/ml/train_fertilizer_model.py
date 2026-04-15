"""
Fertilizer Recommendation Model Training
Uses DecisionTreeClassifier on fertilizer dataset.
Features: temperature, humidity, moisture, soil_type, crop_type, N, P, K
Target: fertilizer name
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import json

DATASET_PATH = os.path.join(os.path.dirname(__file__), 'datasets', 'fertilizer_recommendation.csv')
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'saved_models')

# Fertilizer profiles for synthetic data
FERTILIZER_RULES = {
    'Urea':       {'N': (80, 140), 'P': (10, 30), 'K': (10, 30), 'crops': ['rice', 'wheat', 'maize', 'sugarcane']},
    'DAP':        {'N': (20, 50),  'P': (60, 100),'K': (10, 30), 'crops': ['wheat', 'cotton', 'maize']},
    '14-35-14':   {'N': (30, 50),  'P': (50, 80), 'K': (30, 50), 'crops': ['rice', 'cotton', 'sugarcane']},
    '28-28':      {'N': (40, 70),  'P': (40, 70), 'K': (15, 30), 'crops': ['wheat', 'maize', 'cotton']},
    '17-17-17':   {'N': (30, 60),  'P': (30, 60), 'K': (30, 60), 'crops': ['banana', 'tomato', 'potato']},
    '20-20':      {'N': (35, 55),  'P': (35, 55), 'K': (15, 30), 'crops': ['rice', 'wheat', 'maize']},
    '10-26-26':   {'N': (10, 30),  'P': (50, 80), 'K': (50, 80), 'crops': ['potato', 'tomato', 'banana']},
}

SOIL_TYPES = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey']
CROP_TYPES = ['rice', 'wheat', 'maize', 'cotton', 'sugarcane', 'banana', 'tomato', 'potato']


def generate_synthetic_dataset(n_per_fertilizer=150):
    rows = []
    np.random.seed(42)
    for fert, profile in FERTILIZER_RULES.items():
        for _ in range(n_per_fertilizer):
            row = {
                'temperature': round(np.random.uniform(15, 40), 1),
                'humidity': round(np.random.uniform(30, 95), 1),
                'moisture': round(np.random.uniform(20, 80), 1),
                'soil_type': np.random.choice(SOIL_TYPES),
                'crop_type': np.random.choice(profile['crops']),
                'N': round(np.random.uniform(*profile['N']), 1),
                'P': round(np.random.uniform(*profile['P']), 1),
                'K': round(np.random.uniform(*profile['K']), 1),
                'fertilizer': fert
            }
            rows.append(row)
    return pd.DataFrame(rows).sample(frac=1, random_state=42).reset_index(drop=True)


def train():
    if os.path.exists(DATASET_PATH):
        print(f"Loading dataset from {DATASET_PATH}")
        df = pd.read_csv(DATASET_PATH)
    else:
        print("Generating synthetic fertilizer dataset...")
        df = generate_synthetic_dataset()
        os.makedirs(os.path.dirname(DATASET_PATH), exist_ok=True)
        df.to_csv(DATASET_PATH, index=False)
        print(f"Saved to {DATASET_PATH}")
    
    # Encode categoricals
    le_soil = LabelEncoder()
    le_crop = LabelEncoder()
    le_fert = LabelEncoder()
    
    df['soil_encoded'] = le_soil.fit_transform(df['soil_type'])
    df['crop_encoded'] = le_crop.fit_transform(df['crop_type'])
    y = le_fert.fit_transform(df['fertilizer'])
    
    feature_cols = ['temperature', 'humidity', 'moisture', 'soil_encoded', 'crop_encoded', 'N', 'P', 'K']
    X = df[feature_cols].values
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print("Training DecisionTreeClassifier...")
    model = DecisionTreeClassifier(max_depth=12, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy: {acc:.4f}")
    print(classification_report(y_test, y_pred, target_names=le_fert.classes_))
    
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, os.path.join(MODEL_DIR, 'fertilizer_model.pkl'))
    joblib.dump(le_soil, os.path.join(MODEL_DIR, 'fertilizer_soil_encoder.pkl'))
    joblib.dump(le_crop, os.path.join(MODEL_DIR, 'fertilizer_crop_encoder.pkl'))
    joblib.dump(le_fert, os.path.join(MODEL_DIR, 'fertilizer_label_encoder.pkl'))
    
    with open(os.path.join(MODEL_DIR, 'fertilizer_classes.json'), 'w') as f:
        json.dump({
            'fertilizers': list(le_fert.classes_),
            'soil_types': list(le_soil.classes_),
            'crop_types': list(le_crop.classes_),
        }, f)
    
    print(f"\nAll models saved to {MODEL_DIR}/")
    return acc


if __name__ == '__main__':
    train()
