"""
ML Models — Production Implementation
Loads real trained scikit-learn/TensorFlow models with Gemini fallback.
"""
import os
import json
import numpy as np
import joblib

# Paths
ML_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml' if os.path.exists(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml')) else '')
SAVED_MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml', 'saved_models')


# ═══════════════════════════════════════════════════════════════════
# 1. CROP RECOMMENDATION — RandomForestClassifier
# ═══════════════════════════════════════════════════════════════════
class CropRecommender:
    def __init__(self):
        self.model = None
        self.label_encoder = None
        self._load_model()
    
    def _load_model(self):
        try:
            model_path = os.path.join(SAVED_MODELS_DIR, 'crop_model.pkl')
            encoder_path = os.path.join(SAVED_MODELS_DIR, 'crop_label_encoder.pkl')
            if os.path.exists(model_path) and os.path.exists(encoder_path):
                self.model = joblib.load(model_path)
                self.label_encoder = joblib.load(encoder_path)
                print("✅ Crop RandomForest model loaded")
            else:
                print("⚠️ Crop model files not found — using Gemini fallback")
        except Exception as e:
            print(f"⚠️ Failed to load crop model: {e}")
    
    def predict(self, data):
        """
        data: numpy array of shape (1, 7) — [N, P, K, temp, humidity, ph, rainfall]
        Returns: (crop_name: str, confidence: float)
        """
        if self.model is not None and self.label_encoder is not None:
            features = np.array(data).reshape(1, -1) if len(np.array(data).shape) == 1 else data
            pred_idx = self.model.predict(features)[0]
            proba = self.model.predict_proba(features)[0]
            confidence = float(round(max(proba), 4))
            crop_name = self.label_encoder.inverse_transform([pred_idx])[0]
            return crop_name.capitalize(), confidence
        
        # Gemini fallback
        return self._gemini_fallback(data)
    
    def _gemini_fallback(self, data):
        try:
            from services.gemini_service import gemini_service
            features = np.array(data).flatten()
            prompt = f"""Act as an agronomy expert. Suggest the best crop based on:
            N: {features[0]}, P: {features[1]}, K: {features[2]},
            Temp: {features[3]}°C, Humidity: {features[4]}%, pH: {features[5]}, Rainfall: {features[6]}mm.
            Return ONLY JSON: {{ "crop": "Name", "confidence": 0.95 }}"""
            response = gemini_service.generate_response(prompt)
            if response:
                clean = response.replace('```json', '').replace('```', '').strip()
                res = json.loads(clean)
                return res['crop'], res['confidence']
        except Exception:
            pass
        return "Rice (Fallback)", 0.85


# ═══════════════════════════════════════════════════════════════════
# 2. FERTILIZER RECOMMENDATION — DecisionTreeClassifier
# ═══════════════════════════════════════════════════════════════════
class FertilizerRecommender:
    def __init__(self):
        self.model = None
        self.le_soil = None
        self.le_crop = None
        self.le_fert = None
        self._load_model()
    
    def _load_model(self):
        try:
            base = SAVED_MODELS_DIR
            if os.path.exists(os.path.join(base, 'fertilizer_model.pkl')):
                self.model = joblib.load(os.path.join(base, 'fertilizer_model.pkl'))
                self.le_soil = joblib.load(os.path.join(base, 'fertilizer_soil_encoder.pkl'))
                self.le_crop = joblib.load(os.path.join(base, 'fertilizer_crop_encoder.pkl'))
                self.le_fert = joblib.load(os.path.join(base, 'fertilizer_label_encoder.pkl'))
                print("✅ Fertilizer DecisionTree model loaded")
            else:
                print("⚠️ Fertilizer model files not found — using Gemini fallback")
        except Exception as e:
            print(f"⚠️ Failed to load fertilizer model: {e}")
    
    def predict(self, data, crop='rice', soil_type='Loamy', temperature=25, humidity=70, moisture=50):
        """
        data: [N, P, K, pH]
        Returns: fertilizer name string
        """
        if self.model is not None:
            try:
                # Encode categoricals safely
                soil_enc = self._safe_encode(self.le_soil, soil_type, 'Loamy')
                crop_enc = self._safe_encode(self.le_crop, crop.lower(), 'rice')
                
                features = np.array([[
                    temperature, humidity, moisture,
                    soil_enc, crop_enc,
                    float(data[0]), float(data[1]), float(data[2])
                ]])
                
                pred_idx = self.model.predict(features)[0]
                fertilizer = self.le_fert.inverse_transform([pred_idx])[0]
                return fertilizer
            except Exception as e:
                print(f"Fertilizer ML prediction error: {e}")
        
        # Gemini fallback
        return self._gemini_fallback(data)
    
    def _safe_encode(self, encoder, value, default):
        try:
            return encoder.transform([value])[0]
        except ValueError:
            return encoder.transform([default])[0]
    
    def _gemini_fallback(self, data):
        try:
            from services.gemini_service import gemini_service
            prompt = f"Suggest a fertilizer for soil with N:{data[0]}, P:{data[1]}, K:{data[2]}, pH:{data[3]}. Return ONLY the fertilizer name."
            response = gemini_service.generate_response(prompt)
            if response:
                return response.strip()
        except Exception:
            pass
        return "Urea (Fallback)"


# ═══════════════════════════════════════════════════════════════════
# 3. YIELD PREDICTION — GradientBoostingRegressor
# ═══════════════════════════════════════════════════════════════════
class YieldPredictor:
    def __init__(self):
        self.model = None
        self.le_crop = None
        self._load_model()
    
    def _load_model(self):
        try:
            base = SAVED_MODELS_DIR
            if os.path.exists(os.path.join(base, 'yield_model.pkl')):
                self.model = joblib.load(os.path.join(base, 'yield_model.pkl'))
                self.le_crop = joblib.load(os.path.join(base, 'yield_crop_encoder.pkl'))
                print("✅ Yield GradientBoosting model loaded")
            else:
                print("⚠️ Yield model files not found — using Gemini fallback")
        except Exception as e:
            print(f"⚠️ Failed to load yield model: {e}")
    
    def predict(self, data, crop_name='rice'):
        """
        data: [crop_idx, area, rainfall, fertilizer]
        Returns: predicted yield (float, tons)
        """
        if self.model is not None:
            try:
                crop_enc = self._safe_encode(self.le_crop, crop_name.lower(), 'rice')
                area = float(data[1])
                rainfall = float(data[2])
                fertilizer = float(data[3])
                temperature = float(data[4]) if len(data) > 4 else 25.0
                humidity = float(data[5]) if len(data) > 5 else 70.0
                
                features = np.array([[crop_enc, area, rainfall, fertilizer, temperature, humidity]])
                pred = self.model.predict(features)[0]
                return round(float(pred), 2)
            except Exception as e:
                print(f"Yield ML prediction error: {e}")
        
        # Gemini fallback
        return self._gemini_fallback(data)
    
    def _safe_encode(self, encoder, value, default):
        try:
            return encoder.transform([value])[0]
        except ValueError:
            return encoder.transform([default])[0]
    
    def _gemini_fallback(self, data):
        try:
            from services.gemini_service import gemini_service
            prompt = f"Estimate crop yield (tons) for: Area: {data[1]}ha, Rainfall: {data[2]}mm, Fertilizer: {data[3]}kg. Return ONLY the number."
            response = gemini_service.generate_response(prompt)
            if response:
                return float(''.join(c for c in response if c.isdigit() or c == '.'))
        except Exception:
            pass
        return 4.5


# ═══════════════════════════════════════════════════════════════════
# 4. SOIL HEALTH ANALYSIS — Rule-based scoring engine
# ═══════════════════════════════════════════════════════════════════
class SoilHealthAnalyzer:
    def predict(self, data, language='en'):
        """
        data: [N, P, K, pH, moisture]
        Returns: (status, advice, recommended_crops)
        """
        from services.soil_scoring import compute_soil_health
        
        n, p, k, ph = float(data[0]), float(data[1]), float(data[2]), float(data[3])
        moisture = float(data[4]) if len(data) > 4 else 50.0
        
        result = compute_soil_health(n, p, k, ph, moisture)
        
        status = result['classification']
        health_score = result['health_score']
        
        # Build advice from recommendations
        advice = f"Soil Health Score: {health_score}/100 ({status}). "
        advice += " ".join(result['recommendations'])
        
        # Get AI-enhanced advice
        recommended_crops = self._get_crop_suggestions(n, p, k, ph)
        
        # Try to get richer advice from Gemini
        try:
            from services.gemini_service import gemini_service
            prompt = f"""Analyze soil: N:{n}, P:{p}, K:{k}, pH:{ph}, Moisture:{moisture}%.
            Health Score: {health_score}/100 ({status}).
            Deficiencies: {', '.join(result['deficiencies']) if result['deficiencies'] else 'None'}.
            Give 2-3 sentences of practical advice for an Indian farmer. Return plain text only."""
            ai_advice = gemini_service.generate_response(prompt, language)
            if ai_advice:
                advice = f"Score: {health_score}/100. {ai_advice.strip()}"
        except Exception:
            pass
        
        return status, advice, recommended_crops, health_score, result
    
    def _get_crop_suggestions(self, n, p, k, ph):
        """Simple rule-based crop suggestions based on soil values."""
        crops = []
        if n > 60 and ph >= 5.5:
            crops.append("Rice")
        if n > 50 and p > 35:
            crops.append("Wheat")
        if k > 40 and ph >= 5.5:
            crops.append("Maize")
        if p > 50 and k > 40:
            crops.append("Potato")
        if n > 30 and ph < 7.0:
            crops.append("Coffee")
        if not crops:
            crops = ["Lentil", "Chickpea", "Mungbean"]
        return crops[:5]


# ═══════════════════════════════════════════════════════════════════
# 5. DISEASE DETECTION — MobileNetV2 CNN / Gemini Vision
# ═══════════════════════════════════════════════════════════════════
class DiseaseDetector:
    def __init__(self):
        self.cnn_model = None
        self.class_names = []
        self.treatments = {}
        self._load_model()
    
    def _load_model(self):
        try:
            # Load class config
            config_path = os.path.join(SAVED_MODELS_DIR, 'disease_classes.json')
            if os.path.exists(config_path):
                with open(config_path) as f:
                    config = json.load(f)
                self.class_names = config.get('classes', [])
                self.treatments = config.get('treatments', {})
            
            # Try loading CNN model
            model_path = os.path.join(SAVED_MODELS_DIR, 'disease_model.h5')
            if os.path.exists(model_path):
                import tensorflow as tf
                self.cnn_model = tf.keras.models.load_model(model_path)
                print("✅ Disease CNN (MobileNetV2) model loaded")
            else:
                print("ℹ️ No CNN model — using Gemini Vision for disease detection")
        except Exception as e:
            print(f"⚠️ Disease model loading: {e}")
    
    def predict(self, image_data, language='en'):
        """
        image_data: PIL Image
        Returns: (disease_name, symptoms, treatment_steps)
        """
        # Try CNN first (if model exists)
        if self.cnn_model is not None and image_data is not None:
            try:
                return self._cnn_predict(image_data, language)
            except Exception as e:
                print(f"CNN prediction failed: {e}, falling back to Gemini Vision")
        
        # Gemini Vision fallback
        return self._gemini_predict(image_data, language)
    
    def _cnn_predict(self, image_data, language):
        """Run MobileNetV2 CNN inference."""
        import tensorflow as tf
        
        img = image_data.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        predictions = self.cnn_model.predict(img_array, verbose=0)
        pred_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][pred_idx])
        
        disease_name = self.class_names[pred_idx] if pred_idx < len(self.class_names) else "Unknown"
        
        # Clean name for display
        display_name = disease_name.replace('___', ' - ').replace('_', ' ')
        symptoms = f"Detected with {confidence*100:.1f}% confidence by CNN model."
        treatment = self.treatments.get(disease_name, ['Consult an agricultural expert', 'Take samples for lab analysis'])
        
        return display_name, symptoms, treatment
    
    def _gemini_predict(self, image_data, language='en'):
        """Use Gemini Vision API for disease detection."""
        try:
            from services.gemini_service import gemini_service
            prompt = """Analyze this plant leaf image. Identify the disease (if any).
            Return purely JSON:
            { "disease": "Name", "symptoms": "Description", "treatment_steps": ["Step 1", "Step 2", "Step 3"] }
            If not a plant or unclear: { "disease": "Unknown", "symptoms": "Image not clear", "treatment_steps": ["Upload a clearer image."] }"""
            
            if image_data:
                response = gemini_service.analyze_image(prompt, image_data, language)
                if response:
                    clean = response.replace('```json', '').replace('```', '').strip()
                    res = json.loads(clean)
                    return res.get('disease', 'Unknown'), res.get('symptoms', ''), res.get('treatment_steps', [])
        except Exception as e:
            print(f"Gemini disease detection error: {e}")
        
        return "Unknown", "Could not analyze image", ["Please upload a clearer image of a plant leaf."]


# ═══════════════════════════════════════════════════════════════════
# SINGLETON INSTANCES
# ═══════════════════════════════════════════════════════════════════
print("\n🧠 Loading ML Models...")
crop_model = CropRecommender()
fertilizer_model = FertilizerRecommender()
yield_model = YieldPredictor()
soil_model = SoilHealthAnalyzer()
disease_model = DiseaseDetector()
print("🧠 All models ready!\n")
