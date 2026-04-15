"""
Crop Recommendation Model Training
Uses RandomForestClassifier on standard crop recommendation dataset.
Features: N, P, K, temperature, humidity, pH, rainfall
Target: crop label (22 classes)
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import json

# ─── Dataset ───────────────────────────────────────────────────────
# Standard Kaggle Crop Recommendation Dataset (2200 rows, 22 crops)
# If CSV not found, generate synthetic data matching the real distribution

DATASET_PATH = os.path.join(os.path.dirname(__file__), 'datasets', 'crop_recommendation.csv')
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'saved_models')

# Known crop distributions (from Kaggle dataset)
CROP_PROFILES = {
    'rice':       {'N': (60, 100), 'P': (35, 60),  'K': (35, 55),  'temperature': (20, 27), 'humidity': (80, 95), 'ph': (5.0, 7.0), 'rainfall': (200, 300)},
    'maize':      {'N': (60, 100), 'P': (35, 60),  'K': (25, 45),  'temperature': (18, 27), 'humidity': (55, 75), 'ph': (5.5, 7.5), 'rainfall': (60, 110)},
    'chickpea':   {'N': (20, 60),  'P': (55, 80),  'K': (75, 85),  'temperature': (17, 22), 'humidity': (14, 20), 'ph': (5.5, 8.0), 'rainfall': (65, 100)},
    'kidneybeans':{'N': (15, 30),  'P': (55, 75),  'K': (15, 25),  'temperature': (15, 22), 'humidity': (18, 25), 'ph': (5.5, 6.5), 'rainfall': (60, 120)},
    'pigeonpeas': {'N': (15, 35),  'P': (55, 75),  'K': (18, 25),  'temperature': (18, 36), 'humidity': (30, 70), 'ph': (4.5, 7.5), 'rainfall': (120, 200)},
    'mothbeans':  {'N': (15, 35),  'P': (40, 65),  'K': (18, 25),  'temperature': (24, 32), 'humidity': (40, 65), 'ph': (3.5, 8.0), 'rainfall': (30, 70)},
    'mungbean':   {'N': (15, 35),  'P': (40, 65),  'K': (18, 25),  'temperature': (27, 30), 'humidity': (80, 90), 'ph': (6.0, 7.5), 'rainfall': (40, 60)},
    'blackgram':  {'N': (30, 50),  'P': (55, 75),  'K': (15, 25),  'temperature': (25, 35), 'humidity': (60, 75), 'ph': (6.0, 8.0), 'rainfall': (60, 80)},
    'lentil':     {'N': (12, 30),  'P': (55, 75),  'K': (15, 25),  'temperature': (18, 30), 'humidity': (20, 60), 'ph': (5.0, 8.0), 'rainfall': (35, 55)},
    'pomegranate':{'N': (15, 35),  'P': (5, 20),   'K': (35, 45),  'temperature': (18, 25), 'humidity': (85, 95), 'ph': (5.5, 7.5), 'rainfall': (100, 120)},
    'banana':     {'N': (80, 120), 'P': (70, 95),  'K': (45, 55),  'temperature': (25, 30), 'humidity': (75, 85), 'ph': (5.5, 7.0), 'rainfall': (90, 120)},
    'mango':      {'N': (15, 35),  'P': (15, 30),  'K': (25, 40),  'temperature': (27, 36), 'humidity': (45, 65), 'ph': (4.5, 7.0), 'rainfall': (90, 110)},
    'grapes':     {'N': (15, 35),  'P': (120, 145),'K': (195, 210),'temperature': (8, 43),  'humidity': (78, 84), 'ph': (5.5, 7.0), 'rainfall': (60, 80)},
    'watermelon': {'N': (80, 110), 'P': (5, 20),   'K': (45, 55),  'temperature': (24, 28), 'humidity': (80, 92), 'ph': (6.0, 7.0), 'rainfall': (40, 60)},
    'muskmelon':  {'N': (80, 110), 'P': (5, 20),   'K': (45, 55),  'temperature': (27, 30), 'humidity': (90, 95), 'ph': (6.0, 7.0), 'rainfall': (20, 30)},
    'apple':      {'N': (15, 35),  'P': (120, 145),'K': (195, 210),'temperature': (21, 25), 'humidity': (90, 94), 'ph': (5.5, 6.5), 'rainfall': (100, 130)},
    'orange':     {'N': (15, 35),  'P': (5, 20),   'K': (5, 15),   'temperature': (10, 35), 'humidity': (90, 95), 'ph': (6.0, 8.0), 'rainfall': (100, 120)},
    'papaya':     {'N': (35, 65),  'P': (45, 65),  'K': (45, 55),  'temperature': (25, 42), 'humidity': (90, 95), 'ph': (6.0, 7.0), 'rainfall': (120, 180)},
    'coconut':    {'N': (15, 30),  'P': (5, 20),   'K': (25, 35),  'temperature': (25, 30), 'humidity': (90, 98), 'ph': (5.5, 6.5), 'rainfall': (130, 200)},
    'cotton':     {'N': (100, 140),'P': (40, 60),  'K': (18, 22),  'temperature': (23, 27), 'humidity': (75, 85), 'ph': (6.0, 8.0), 'rainfall': (60, 110)},
    'jute':       {'N': (60, 100), 'P': (35, 55),  'K': (35, 45),  'temperature': (23, 37), 'humidity': (78, 92), 'ph': (6.0, 7.5), 'rainfall': (150, 200)},
    'coffee':     {'N': (80, 120), 'P': (15, 30),  'K': (25, 40),  'temperature': (23, 28), 'humidity': (55, 70), 'ph': (5.5, 7.0), 'rainfall': (150, 230)},
}

def generate_synthetic_dataset(n_per_crop=100):
    """Generate synthetic training data matching real distribution."""
    rows = []
    np.random.seed(42)
    for crop, ranges in CROP_PROFILES.items():
        for _ in range(n_per_crop):
            row = {}
            for feature, (lo, hi) in ranges.items():
                row[feature] = round(np.random.uniform(lo, hi), 2)
            row['label'] = crop
            rows.append(row)
    df = pd.DataFrame(rows)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    return df


def train():
    # Load or generate dataset
    if os.path.exists(DATASET_PATH):
        print(f"Loading dataset from {DATASET_PATH}")
        df = pd.read_csv(DATASET_PATH)
    else:
        print("Dataset not found. Generating synthetic data...")
        df = generate_synthetic_dataset()
        os.makedirs(os.path.dirname(DATASET_PATH), exist_ok=True)
        df.to_csv(DATASET_PATH, index=False)
        print(f"Saved synthetic dataset to {DATASET_PATH}")
    
    # Features and target
    feature_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    X = df[feature_cols].values
    y = df['label'].values
    
    # Encode labels
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    # Train RandomForest
    print("Training RandomForestClassifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy: {acc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=le.classes_))
    
    # Save model + encoder
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, os.path.join(MODEL_DIR, 'crop_model.pkl'))
    joblib.dump(le, os.path.join(MODEL_DIR, 'crop_label_encoder.pkl'))
    
    # Save class names for reference
    with open(os.path.join(MODEL_DIR, 'crop_classes.json'), 'w') as f:
        json.dump(list(le.classes_), f)
    
    print(f"\nModel saved to {MODEL_DIR}/crop_model.pkl")
    print(f"Label encoder saved to {MODEL_DIR}/crop_label_encoder.pkl")
    print(f"Classes: {list(le.classes_)}")
    return acc


if __name__ == '__main__':
    train()
