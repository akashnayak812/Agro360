import cv2
import numpy as np
import io
from PIL import Image

class SoilAnalyzer:
    @staticmethod
    def analyze_image(image_bytes):
        """
        Analyze soil image to determine type and estimate NPK/pH.
        """
        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                # Try PIL fallback if cv2 fails to read directly
                image = Image.open(io.BytesIO(image_bytes))
                img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

            # Resize for faster processing
            img = cv2.resize(img, (150, 150))
            
            # Convert to HSV
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            
            # Calculate average color
            avg_color_per_row = np.average(hsv, axis=0)
            avg_color = np.average(avg_color_per_row, axis=0)
            
            h, s, v = avg_color
            
            # Soil Classification Logic (Heuristic based on Hue/Sat/Val)
            # Hue ranges: 0-179 in OpenCV
            
            soil_type = "Unknown"
            confidence = 0.5
            
            # Check for generic soil colors
            # Red Soil: Hue around 0-20 or 160-180 (Red), Saturation moderate to high
            if (h < 20 or h > 160) and s > 50:
                soil_type = "Red Soil"
                confidence = 0.85
                nutrients = {"N": "Low", "P": "Low", "K": "Medium", "pH": 6.5}
                message = "Rich in iron, suitable for cotton, wheat, pulses."
                
            # Black Soil: Low Value (Dark), Low Saturation (Grayish/Black)
            elif v < 60:
                soil_type = "Black Soil"
                confidence = 0.90
                nutrients = {"N": "High", "P": "Low", "K": "High", "pH": 7.5}
                message = "Excellent moisture retention. Good for cotton, sugarcane."

            # Sandy/Yellow Soil: Hue around 20-35 (Yellow/Orange), Low Saturation
            elif 20 <= h <= 40:
                soil_type = "Sandy/Loamy Soil"
                confidence = 0.80
                nutrients = {"N": "Low", "P": "Medium", "K": "Medium", "pH": 7.0}
                message = "Well-drained. Good for groundnut, potato."
                
            # Brown/Alluvial: Generic brownish
            elif 10 <= h <= 25 and 60 <= v <= 150:
                soil_type = "Alluvial Soil"
                confidence = 0.75
                nutrients = {"N": "Medium", "P": "Medium", "K": "High", "pH": 7.2}
                message = "Very fertile. Suitable for rice, wheat, sugarcane."
                
            else:
                soil_type = "Loamy Soil" # Fallback
                confidence = 0.60
                nutrients = {"N": "Medium", "P": "Medium", "K": "Medium", "pH": 7.0}
                message = "Balanced texture. Good for most crops."

            # Moisture estimation based on V (Value/Brightness)
            # Darker usually means wetter
            moisture = int(np.interp(v, [40, 200], [90, 10])) # Map 40-200 brightness to 90-10% moisture

            return {
                "success": True,
                "soil_type": soil_type,
                "confidence": confidence,
                "estimates": nutrients,
                "moisture_percent": moisture,
                "message": message,
                "color_detected": f"HSV({int(h)},{int(s)},{int(v)})"
            }

        except Exception as e:
            print(f"Soil Analysis Error: {e}")
            return {"success": False, "error": str(e)}

soil_analyzer = SoilAnalyzer()
