"""
Plant Disease Detection Model Training
Uses MobileNetV2 transfer learning on PlantVillage dataset.

NOTE: The PlantVillage dataset (~87K images, ~2.5GB) is too large to include.
This script will:
  1. Check if dataset exists at datasets/PlantVillage/
  2. If not, create a small synthetic placeholder and train a minimal model
  3. For production, download PlantVillage dataset from Kaggle and retrain

The model uses Gemini Vision API as the PRIMARY detector (higher accuracy),
with this CNN as a FAST OFFLINE FALLBACK.
"""
import os
import json
import numpy as np

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'saved_models')
DATASET_DIR = os.path.join(os.path.dirname(__file__), 'datasets', 'PlantVillage')

# 38 classes from PlantVillage dataset
DISEASE_CLASSES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy',
    'Cherry___Powdery_mildew', 'Cherry___healthy',
    'Corn___Cercospora_leaf_spot', 'Corn___Common_rust', 'Corn___Northern_Leaf_Blight', 'Corn___healthy',
    'Grape___Black_rot', 'Grape___Esca', 'Grape___Leaf_blight', 'Grape___healthy',
    'Orange___Haunglongbing',
    'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper___Bacterial_spot', 'Pepper___healthy',
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites', 'Tomato___Target_Spot',
    'Tomato___Yellow_Leaf_Curl_Virus', 'Tomato___Mosaic_virus', 'Tomato___healthy'
]

# Treatment suggestions per disease
DISEASE_TREATMENTS = {
    'Apple___Apple_scab': ['Apply fungicide (captan or mancozeb)', 'Remove infected leaves', 'Ensure good air circulation'],
    'Apple___Black_rot': ['Prune dead branches', 'Apply fungicide', 'Remove mummified fruits'],
    'Apple___Cedar_apple_rust': ['Apply myclobutanil fungicide', 'Remove nearby juniper trees', 'Use resistant varieties'],
    'Corn___Common_rust': ['Apply foliar fungicide', 'Plant resistant hybrids', 'Monitor early in season'],
    'Corn___Northern_Leaf_Blight': ['Apply strobilurin fungicide', 'Rotate crops', 'Use resistant varieties'],
    'Grape___Black_rot': ['Apply mancozeb fungicide', 'Remove infected berries', 'Prune for air flow'],
    'Potato___Early_blight': ['Apply chlorothalonil fungicide', 'Rotate crops every 2 years', 'Remove infected foliage'],
    'Potato___Late_blight': ['Apply metalaxyl fungicide immediately', 'Destroy infected plants', 'Avoid overhead irrigation'],
    'Tomato___Bacterial_spot': ['Apply copper-based bactericide', 'Use disease-free seeds', 'Avoid working with wet plants'],
    'Tomato___Early_blight': ['Apply chlorothalonil or mancozeb', 'Mulch around plants', 'Remove lower affected leaves'],
    'Tomato___Late_blight': ['Apply metalaxyl fungicide', 'Remove and destroy infected plants', 'Improve air circulation'],
    'Tomato___Leaf_Mold': ['Improve ventilation in greenhouse', 'Apply fungicide', 'Reduce humidity'],
    'Tomato___Yellow_Leaf_Curl_Virus': ['Control whitefly vectors', 'Use resistant varieties', 'Remove infected plants'],
}

def get_default_treatment(disease_name):
    """Get treatment or return generic advice."""
    if disease_name in DISEASE_TREATMENTS:
        return DISEASE_TREATMENTS[disease_name]
    if 'healthy' in disease_name.lower():
        return ['Plant appears healthy!', 'Continue regular care', 'Monitor for any changes']
    return ['Consult a local agricultural expert', 'Take samples for lab analysis', 'Isolate affected plants']


def train():
    """Train or create a placeholder disease model."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    has_dataset = os.path.exists(DATASET_DIR) and len(os.listdir(DATASET_DIR)) > 10
    
    if has_dataset:
        print("PlantVillage dataset found! Training MobileNetV2...")
        _train_real_model()
    else:
        print("PlantVillage dataset not found.")
        print("Creating placeholder model configuration...")
        print("Disease detection will use Gemini Vision API as primary detector.")
        _create_placeholder()


def _create_placeholder():
    """Save class names and treatment data for Gemini-based detection."""
    config = {
        'classes': DISEASE_CLASSES,
        'treatments': DISEASE_TREATMENTS,
        'model_type': 'gemini_vision',
        'note': 'CNN model not trained - using Gemini Vision API. Download PlantVillage dataset and retrain for offline CNN.'
    }
    with open(os.path.join(MODEL_DIR, 'disease_classes.json'), 'w') as f:
        json.dump(config, f, indent=2)
    print(f"Saved disease config to {MODEL_DIR}/disease_classes.json")


def _train_real_model():
    """Train MobileNetV2 on PlantVillage dataset."""
    try:
        import tensorflow as tf
        from tensorflow.keras.applications import MobileNetV2
        from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
        from tensorflow.keras.models import Model
        from tensorflow.keras.preprocessing.image import ImageDataGenerator
        
        IMG_SIZE = 224
        BATCH_SIZE = 32
        EPOCHS = 10
        
        datagen = ImageDataGenerator(
            rescale=1./255,
            validation_split=0.2,
            rotation_range=20,
            horizontal_flip=True,
            zoom_range=0.2
        )
        
        train_gen = datagen.flow_from_directory(
            DATASET_DIR,
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            class_mode='categorical',
            subset='training'
        )
        
        val_gen = datagen.flow_from_directory(
            DATASET_DIR,
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            class_mode='categorical',
            subset='validation'
        )
        
        num_classes = train_gen.num_classes
        
        base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))
        base_model.trainable = False  # Freeze base
        
        x = base_model.output
        x = GlobalAveragePooling2D()(x)
        x = Dropout(0.3)(x)
        x = Dense(256, activation='relu')(x)
        x = Dropout(0.3)(x)
        predictions = Dense(num_classes, activation='softmax')(x)
        
        model = Model(inputs=base_model.input, outputs=predictions)
        model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
        
        print(f"Training on {train_gen.samples} images, {num_classes} classes...")
        model.fit(train_gen, validation_data=val_gen, epochs=EPOCHS)
        
        model.save(os.path.join(MODEL_DIR, 'disease_model.h5'))
        
        # Save class mapping
        class_indices = train_gen.class_indices
        classes = {v: k for k, v in class_indices.items()}
        
        config = {
            'classes': [classes[i] for i in range(num_classes)],
            'treatments': DISEASE_TREATMENTS,
            'model_type': 'mobilenetv2_cnn'
        }
        with open(os.path.join(MODEL_DIR, 'disease_classes.json'), 'w') as f:
            json.dump(config, f, indent=2)
        
        print("Disease CNN model saved successfully!")
        
    except Exception as e:
        print(f"CNN training failed: {e}")
        print("Falling back to Gemini Vision placeholder...")
        _create_placeholder()


if __name__ == '__main__':
    train()
