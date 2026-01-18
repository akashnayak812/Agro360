// Example: How to integrate search tracking in CropRecommendation.jsx
// Add these imports at the top of your component:

import { useAuth } from '../context/AuthContext';
import { trackSearch, SEARCH_TYPES } from '../lib/searchTracker';

// Then in your component:

const CropRecommendation = () => {
    const { token } = useAuth(); // Add this line
    const [formData, setFormData] = useState({
        N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/crop/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setResult(data);

            // TRACK THE SEARCH - Add this block
            if (data && data.crop) {
                await trackSearch(
                    token,
                    SEARCH_TYPES.CROP,
                    {
                        nitrogen: formData.N,
                        phosphorus: formData.P,
                        potassium: formData.K,
                        temperature: formData.temperature,
                        humidity: formData.humidity,
                        ph: formData.ph,
                        rainfall: formData.rainfall
                    },
                    `Recommended: ${data.crop}`
                );
            }
            // END OF TRACKING CODE

        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    // ... rest of your component
};

// ===================================================================
// Example for DiseaseDetection.jsx
// ===================================================================

const DiseaseDetection = () => {
    const { token } = useAuth();

    const handleDetection = async (imageFile) => {
        // ... your detection logic
        const result = await detectDisease(imageFile);

        // Track the search
        await trackSearch(
            token,
            SEARCH_TYPES.DISEASE,
            {
                image: imageFile.name,
                fileSize: imageFile.size
            },
            result.disease ? `Detected: ${result.disease}` : 'No disease detected'
        );
    };
};

// ===================================================================
// Example for FertilizerRecommendation.jsx
// ===================================================================

const FertilizerRecommendation = () => {
    const { token } = useAuth();

    const handleRecommendation = async (soilData) => {
        // ... your recommendation logic
        const result = await getFertilizerRecommendation(soilData);

        // Track the search
        await trackSearch(
            token,
            SEARCH_TYPES.FERTILIZER,
            soilData,
            result.fertilizer ? `Recommended: ${result.fertilizer}` : 'No recommendation'
        );
    };
};

// ===================================================================
// Example for SoilAnalysis.jsx
// ===================================================================

const SoilAnalysis = () => {
    const { token } = useAuth();

    const handleAnalysis = async (soilParams) => {
        // ... your analysis logic
        const result = await analyzeSoil(soilParams);

        // Track the search
        await trackSearch(
            token,
            SEARCH_TYPES.SOIL,
            soilParams,
            `pH: ${result.ph}, Type: ${result.soilType}`
        );
    };
};

// ===================================================================
// Example for YieldPrediction.jsx
// ===================================================================

const YieldPrediction = () => {
    const { token } = useAuth();

    const handlePrediction = async (cropData) => {
        // ... your prediction logic
        const result = await predictYield(cropData);

        // Track the search
        await trackSearch(
            token,
            SEARCH_TYPES.YIELD,
            cropData,
            result.yield ? `Predicted yield: ${result.yield} tons/acre` : 'Prediction unavailable'
        );
    };
};
