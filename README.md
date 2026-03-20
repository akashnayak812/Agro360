# 🌾 Agro360 - Smart Farming Platform

Agro360 is an intelligent agricultural platform that leverages machine learning and AI to provide farmers with data-driven insights for optimal crop management, soil analysis, disease detection, and farming advisory.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Features in Detail](#features-in-detail)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **🌱 Crop Recommendation System** - ML-based crop suggestions based on soil nutrients (N, P, K), pH, temperature, humidity, and rainfall
- **💧 Fertilizer Recommendation** - Intelligent fertilizer suggestions based on soil conditions and crop type
- **📊 Yield Prediction** - Predict crop yield using historical data and environmental factors
- **🔬 Soil Health Analysis** - Comprehensive soil analysis with actionable recommendations
- **🦠 Disease Detection** - AI-powered plant disease identification using image recognition
- **🌤️ Weather Advisory** - Real-time farming advisory based on weather conditions
- **👥 Community Forum** - Platform for farmers to share knowledge and experiences
- **📈 Market Insights** - Live market prices, tracking, and seasonal trends
- **🏛️ Government Schemes** - Personalized eligibility checker and AI assistance for government benefits
- **🎤 Voice Assistant** - Multilingual voice-powered assistant for hands-free interaction
- **🌐 Multi-language Support** - Support for English, Hindi, and other regional languages
- **🎨 3D Farm Visualization** - Interactive 3D farm scenes using Three.js

## 🛠️ Tech Stack

### Backend
- **Framework:** Flask (Python)
- **Machine Learning:** 
  - scikit-learn - ML models for crop recommendation and predictions
  - TensorFlow - Deep learning for disease detection
  - NumPy & Pandas - Data processing
- **AI Integration:** Google Gemini AI - Natural language processing and conversational AI
- **Computer Vision:** OpenCV - Image processing for disease detection
- **Database:** MongoDB (placeholder for future implementation)
- **CORS:** Flask-CORS for cross-origin requests

### Frontend
- **Framework:** React 19.2.0 with Vite
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS
- **3D Graphics:** Three.js with React Three Fiber & Drei
- **Animations:** Framer Motion
- **Internationalization:** i18next, react-i18next
- **Icons:** Lucide React
- **UI Components:** Custom components with Tailwind

## 📁 Project Structure

```
Agro360/
├── backend/
│   ├── app.py                      # Main Flask application
│   ├── requirements.txt            # Python dependencies
│   ├── debug_gemini.py            # Gemini API testing
│   ├── models/
│   │   └── ml_models.py           # ML model implementations
│   ├── routes/
│   │   ├── advisory_routes.py     # Weather advisory endpoints
│   │   ├── community_routes.py    # Community forum endpoints
│   │   ├── crop_routes.py         # Crop recommendation endpoints
│   │   ├── disease_routes.py      # Disease detection endpoints
│   │   ├── fertilizer_routes.py   # Fertilizer recommendation endpoints
│   │   ├── market_routes.py       # Market insights endpoints
│   │   ├── schemes_routes.py      # Government schemes endpoints
│   │   ├── soil_routes.py         # Soil analysis endpoints
│   │   ├── voice_routes.py        # Voice assistant endpoints
│   │   └── yield_routes.py        # Yield prediction endpoints
│   └── services/
│       └── gemini_service.py      # Google Gemini AI integration
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── eslint.config.js
    └── src/
        ├── main.jsx               # Application entry point
        ├── App.jsx                # Main app component with routing
        ├── i18n.js                # Internationalization config
        ├── components/
        │   ├── Dashboard.jsx
        │   ├── CropRecommendation.jsx
        │   ├── FertilizerRecommendation.jsx
        │   ├── YieldPrediction.jsx
        │   ├── SoilAnalysis.jsx
        │   ├── DiseaseDetection.jsx
        │   ├── Advisory.jsx
        │   ├── Community.jsx
        │   ├── MarketInsights.jsx
        │   ├── GovtSchemes.jsx
        │   ├── VoiceAssistant.jsx
        │   ├── Layout.jsx
        │   ├── Sidebar.jsx
        │   ├── LanguageSelector.jsx
        │   ├── AnimatedBackground.jsx
        │   ├── AnimatedPage.jsx
        │   ├── 3d/
        │   │   └── FarmScene3D.jsx
        │   └── ui/
        │       ├── Button.jsx
        │       ├── Card.jsx
        │       └── Input.jsx
        ├── assets/
        └── lib/
            └── utils.js
```

## 📦 Prerequisites

- **Python:** 3.8 or higher
- **Node.js:** 16.x or higher
- **npm:** 8.x or higher
- **Google Gemini API Key:** Required for AI features

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Agro360.git
cd Agro360
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. **Environment Variables** (Optional - Create a `.env` file in the backend directory):

```env
# API Keys
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB (if using)
MONGO_URI=mongodb://localhost:27017/agro360

# Flask Settings
FLASK_ENV=development
FLASK_PORT=5001
```

2. **Update Gemini API Key** in [backend/services/gemini_service.py](backend/services/gemini_service.py):

```python
API_KEY = os.environ.get("GEMINI_API_KEY", "your_api_key_here")
```

### Frontend Configuration

Update the API base URL in frontend components if needed (currently defaults to `http://localhost:5001`).

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
python app.py
```

The backend API will run on `http://localhost:5001`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port shown in terminal)

### Access the Application

Open your browser and navigate to `http://localhost:5173`

## 🔌 API Endpoints

### Crop Recommendation
- **POST** `/api/crop/recommend`
  - Body: `{N, P, K, temperature, humidity, ph, rainfall}`
  - Returns: Recommended crop with confidence score

### Fertilizer Recommendation
- **POST** `/api/fertilizer/recommend`
  - Body: Soil parameters and crop type
  - Returns: Fertilizer recommendations

### Yield Prediction
- **POST** `/api/yield/predict`
  - Body: Crop details and environmental factors
  - Returns: Predicted yield

### Soil Analysis
- **POST** `/api/soil/analyze`
  - Body: Soil test results
  - Returns: Soil health analysis and recommendations

### Disease Detection
- **POST** `/api/disease/detect`
  - Body: Image file (multipart/form-data)
  - Returns: Detected disease with treatment suggestions

### Weather Advisory
- **POST** `/api/advisory/get`
  - Body: Location and crop information
  - Returns: Weather-based farming advisory

### Community
- **GET** `/api/community/posts`
- **POST** `/api/community/posts`

### Voice Assistant
- **POST** `/api/voice/process`
  - Body: `{text, language}`
  - Returns: AI response with intent and language

### Market Insights
- **POST** `/api/market/trends`
  - Body: `{crops}`
  - Returns: Trend analysis for the specified crops

### Government Schemes
- **POST** `/api/schemes/ai-help`
  - Body: `{scheme_id, question, language, scheme_details}`
  - Returns: AI answer, key points, next steps, and helpline
- **GET** `/api/schemes/all`
  - Returns: Central and state schemes metadata

### Health Check
- **GET** `/api/health`
  - Returns: API health status

## 🎯 Features in Detail

### Crop Recommendation System
Uses machine learning to analyze soil nutrients (Nitrogen, Phosphorus, Potassium), pH levels, temperature, humidity, and rainfall patterns to recommend the most suitable crop for optimal yield.

### Disease Detection
Employs computer vision and deep learning to identify plant diseases from leaf images. Provides treatment recommendations and preventive measures.

### Market Insights
Provides real-time crop prices across mandis, visual trend charts, and personalized "when to sell" recommendations based on historical data.

### Government Schemes
A dedicated module helping farmers discover and apply for central and state government benefits, complete with an eligibility checker and a Gemini-powered "Kisaan Mitra" conversational helper.

### Voice Assistant
Powered by Google Gemini AI, the voice assistant supports:
- Multilingual conversations (English, Hindi, and more)
- Domain-specific responses (agriculture only)
- Natural language understanding
- Intent detection for navigation and queries

### 3D Farm Visualization
Interactive 3D farm scenes created with Three.js provide an engaging visual experience for users to understand farming concepts.

### Multi-language Support
Built-in internationalization (i18n) allows farmers to use the platform in their preferred language, making it accessible to a wider audience.

## 🌟 Key Technologies

- **Machine Learning Models:** Pre-trained models for crop recommendation, yield prediction, and disease classification
- **Google Gemini AI:** Advanced conversational AI for natural language interaction
- **React Three Fiber:** Declarative 3D rendering in React
- **Framer Motion:** Smooth page transitions and animations
- **Tailwind CSS:** Utility-first styling for responsive design

## 🧪 Development Scripts

### Backend
```bash
# Run Flask development server
python app.py

# Test Gemini integration
python debug_gemini.py
```

### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

Akash Degavath

## 🙏 Acknowledgments

- Google Gemini AI for conversational intelligence
- scikit-learn and TensorFlow communities
- React and Vite teams
- Three.js community for 3D rendering capabilities

## 📧 Contact

For questions or support, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for farmers by developers**
