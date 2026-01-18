import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Simple translation resources for demo
// In a real app, these would be in public/locales/en/translation.json
const resources = {
    en: {
        translation: {
            "welcome": "Welcome to Agro360",
            "subtitle": "Smart Farming for a Better Future",
            "ask_assistant": "Ask Agro360...",
            "nav": {
                "dashboard": "Dashboard",
                "crop": "Crop Recommendation",
                "fertilizer": "Fertilizer",
                "yield": "Yield Prediction",
                "soil": "Soil Health",
                "disease": "Disease Detection",
                "advisory": "Advisory",
                "community": "Community"
            },
            "voice": {
                "listening": "Listening...",
                "processing": "Thinking...",
                "error": "Sorry, I didn't catch that."
            },
            "soil": {
                "leaf_growth": "Leaf Growth",
                "flowering": "Flowers & Fruits",
                "plant_strength": "Plant Strength",
                "leaf_desc": "Makes plants green and leafy",
                "flower_desc": "Helps flowers bloom and fruits grow",
                "strength_desc": "Makes plants strong and disease-resistant",
                "good": "Good",
                "moderate": "Moderate",
                "poor": "Needs Improvement"
            },
            "fertilizer": {
                "cow_dung": "Cow dung manure or Urea",
                "bone_meal": "Bone meal or DAP fertilizer",
                "wood_ash": "Wood ash or MOP fertilizer",
                "need_leaf": "Soil needs nutrition for leaf growth",
                "need_flower": "Soil needs help for flowering",
                "need_strength": "Plants need more strength"
            }
        }
    },

    hi: {
        translation: {
            "welcome": "Agro360 में आपका स्वागत है",
            "subtitle": "बेहतर भविष्य के लिए स्मार्ट खेती",
            "ask_assistant": "Agro360 से पूछें...",
            "nav": {
                "dashboard": "डैशबोर्ड",
                "crop": "फसल सुझाव",
                "fertilizer": "उर्वरक",
                "yield": "उपज भविष्यवाणी",
                "soil": "मृदा स्वास्थ्य",
                "disease": "रोग पहचान",
                "advisory": "सलाह",
                "community": "समुदाय"
            },
            "voice": {
                "listening": "सुन रहा हूँ...",
                "processing": "सोच रहा हूँ...",
                "error": "क्षमा करें, मैं समझ नहीं पाया।"
            },
            "soil": {
                "leaf_growth": "पत्ती वृद्धि",
                "flowering": "फूल और फल",
                "plant_strength": "पौधों की ताकत",
                "leaf_desc": "पौधों को हरा और पत्तेदार बनाता है",
                "flower_desc": "फूल खिलने और फल बढ़ने में मदद करता है",
                "strength_desc": "पौधों को मजबूत और रोग प्रतिरोधक बनाता है",
                "good": "अच्छा",
                "moderate": "मध्यम",
                "poor": "सुधार की आवश्यकता"
            },
            "fertilizer": {
                "cow_dung": "गोबर की खाद या यूरिया",
                "bone_meal": "हड्डी का चूरा या DAP",
                "wood_ash": "लकड़ी की राख या MOP",
                "need_leaf": "पत्तियों की वृद्धि के लिए पोषण चाहिए",
                "need_flower": "फूल आने के लिए मदद चाहिए",
                "need_strength": "पौधों को अधिक ताकत चाहिए"
            }
        }
    },

    te: {
        translation: {
            "welcome": "Agro360-ki Swagatam",
            "subtitle": "Manchi Bhavishyattu kosam Smart Vyavasayam",
            "ask_assistant": "Agro360-ni adagandi...",
            "nav": {
                "dashboard": "Dashboard",
                "crop": "Panta Salahalu",
                "fertilizer": "Eruvulu",
                "yield": "Digubadi Anchana",
                "soil": "Bhoomi Arogyam",
                "disease": "RogaNirdharana",
                "advisory": "Salaha",
                "community": "Samajam"
            },
            "voice": {
                "listening": "Vintunnanu...",
                "processing": "Aalochistunnanu...",
                "error": "Kshaminchandi, ardham kaledu."
            },
            "soil": {
                "leaf_growth": "Aaku Perugu",
                "flowering": "Puvvu mariyu Pandlu",
                "plant_strength": "Chettla Balam",
                "leaf_desc": "Chettlanu pachaga mariyu aakulu tho nimputhundi",
                "flower_desc": "Puvvulu mariyu pandlu peruguthayi",
                "strength_desc": "Chettlanu balanga mariyu roga nirodhakanga chesthundi",
                "good": "Manchidi",
                "moderate": "Parledhu",
                "poor": "Marchi Kavali"
            },
            "fertilizer": {
                "cow_dung": "Govu penta leda Urea",
                "bone_meal": "Emukala podi leda DAP",
                "wood_ash": "Karra Budida leda MOP",
                "need_leaf": "Aaku perugudaniki poshanalu kavali",
                "need_flower": "Puvvulanike sahayam kavali",
                "need_strength": "Chettlaniki ekkuva balam kavali"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
