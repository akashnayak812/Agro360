/**
 * Agro360 Chatbot Intent Parser
 * Client-side navigation intent detection with multilingual keyword support.
 * Falls back to Gemini API for complex/ambiguous queries.
 */

// Complete route map for Agro360 app
export const NAVIGATION_ROUTES = {
  dashboard: { path: '/dashboard', label: 'Dashboard' },
  crop: { path: '/crop', label: 'Crop Recommendation' },
  fertilizer: { path: '/fertilizer', label: 'Fertilizer' },
  yield: { path: '/yield', label: 'Yield Prediction' },
  soil: { path: '/soil', label: 'Soil Health' },
  disease: { path: '/disease', label: 'Disease Detection' },
  advisory: { path: '/advisory', label: 'Advisory' },
  community: { path: '/community', label: 'Community' },
  simulator: { path: '/simulator', label: 'Farm Simulator' },
  market: { path: '/market', label: 'Market Insights' },
  risk: { path: '/risk', label: 'Risk Assessment' },
  farm3d: { path: '/farm3d', label: '3D Farm View' },
  schemes: { path: '/schemes', label: 'Govt Schemes' },
  developer: { path: '/developer', label: 'Developer' },
  login: { path: '/login', label: 'Login' },
  register: { path: '/register', label: 'Register' },
};

// Multilingual keyword → route key mapping
// Each entry maps lowercase keywords/phrases to a NAVIGATION_ROUTES key
const KEYWORD_MAP = [
  // Dashboard
  { keys: ['dashboard', 'home', 'main', 'डैशबोर्ड', 'होम', 'డాష్‌బోర్డ్', 'డాష్బోర్డ్', 'டாஷ்போர்டு', 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', 'ഡാഷ്ബോർഡ്', 'ড্যাশবোর্ড', 'डॅशबोर्ड', 'ડેશબોર્ડ', 'ਡੈਸ਼ਬੋਰਡ', 'ڈیش بورڈ', 'panel', 'tableau', 'startseite', '仪表板', '控制台'], route: 'dashboard' },

  // Crop
  { keys: ['crop', 'crops', 'फसल', 'पंट', 'పంట', 'పంటలు', 'பயிர்', 'ಬೆಳೆ', 'വിള', 'ফসল', 'पीक', 'પાક', 'ਫ਼ਸਲ', 'فصل', 'cultivo', 'culture', 'ernte', '作物', '农作物'], route: 'crop' },

  // Fertilizer
  { keys: ['fertilizer', 'fertiliser', 'उर्वरक', 'खाद', 'ఎరువు', 'ఎరువులు', 'உரம்', 'ಗೊಬ್ಬರ', 'വളം', 'সার', 'खत', 'ખાતર', 'ਖਾਦ', 'کھاد', 'fertilizante', 'engrais', 'dünger', '肥料'], route: 'fertilizer' },

  // Yield
  { keys: ['yield', 'harvest', 'उपज', 'దిగుబడి', 'விளைச்சல்', 'ಇಳುವರಿ', 'വിളവ്', 'ফলন', 'उत्पादन', 'ઉપજ', 'ਝਾੜ', 'پیداوار', 'rendimiento', 'rendement', 'ertrag', '产量'], route: 'yield' },

  // Soil
  { keys: ['soil', 'मिट्टी', 'मृदा', 'నేల', 'మట్టి', 'மண்', 'ಮಣ್ಣು', 'മണ്ണ്', 'মাটি', 'माती', 'જમીન', 'ਮਿੱਟੀ', 'مٹی', 'suelo', 'sol', 'boden', '土壤'], route: 'soil' },

  // Disease
  { keys: ['disease', 'रोग', 'बीमारी', 'వ్యాధి', 'రోగం', 'நோய்', 'ರೋಗ', 'രോഗം', 'রোগ', 'आजार', 'રોગ', 'ਰੋਗ', 'بیماری', 'enfermedad', 'maladie', 'krankheit', '病害', '疾病', 'plant doctor'], route: 'disease' },

  // Advisory
  { keys: ['advisory', 'advice', 'सलाह', 'సలహా', 'ஆலோசனை', 'ಸಲಹೆ', '�DÉÈÌÍupadesh', 'পরামর্শ', 'सल्ला', 'સલાહ', 'ਸਲਾਹ', 'مشورہ', 'consejo', 'conseil', 'beratung', '咨询', 'weather'], route: 'advisory' },

  // Community
  { keys: ['community', 'समुदाय', 'సమాజం', 'சமூகம்', 'ಸಮುದಾಯ', 'സമൂഹം', 'সম্প্রদায়', 'समाज', 'સમુદાય', 'ਭਾਈਚਾਰਾ', 'کمیونٹی', 'comunidad', 'communauté', 'gemeinschaft', '社区', 'forum', 'farmers'], route: 'community' },

  // Simulator / Digital Twin
  { keys: ['simulator', 'simulation', 'digital twin', 'सिमुलेटर', 'సిమ్యులేటర్', 'சிமுலேட்டர்', 'ಸಿಮ್ಯುಲೇಟರ್', 'സിമുലേറ്റർ', 'সিমুলেটর', 'सिम्युलेटर', 'સિમ્યુલેટર', 'ਸਿਮੂਲੇਟਰ', 'سمیلیٹر', 'simulador', 'simulateur', '模拟器'], route: 'simulator' },

  // Market
  { keys: ['market', 'price', 'prices', 'बाजार', 'भाव', 'मंडी', 'మార్కెట్', 'ధరలు', 'சந்தை', 'விலை', 'ಮಾರುಕಟ್ಟೆ', 'ವിപണ', 'വിപണി', 'বাজার', 'दर', 'બજાર', 'ਮੰਡੀ', 'منڈی', 'بازار', 'mercado', 'marché', 'markt', '市场', '价格'], route: 'market' },

  // Risk
  { keys: ['risk', 'जोखिम', 'రిస్క్', 'ஆபத்து', 'ಅಪಾಯ', 'അപകടം', 'ঝুঁকি', 'धोका', 'જોખમ', 'ਖ਼ਤਰਾ', 'خطرہ', 'riesgo', 'risque', 'risiko', '风险'], route: 'risk' },

  // Farm 3D
  { keys: ['3d', 'farm3d', '3d farm', '3d view', '3d दृश्य', '3D పొలం', '3D பண்ணை', '3D ಹೊಲ', '3D ഫാം', '3D খামার', '3D शेत', '3D ખેતર', '3D ਖੇਤ', '3D فارم', 'granja 3d', 'ferme 3d', '3d bauernhof', '3D农场'], route: 'farm3d' },

  // Schemes
  { keys: ['scheme', 'schemes', 'government', 'govt', 'योजना', 'सरकारी', 'పథకం', 'ప్రభుత్వ', 'திட்டம்', 'ಯೋಜನೆ', 'പദ്ധതി', 'প্রকল্প', 'योजना', 'યોજના', 'ਯੋਜਨਾ', 'اسکیم', 'سرکاری', 'esquema', 'régime', 'programm', '计划', '政府'], route: 'schemes' },

  // Developer
  { keys: ['developer', 'dev', 'डेवलपर', 'డెవలపర్', 'டெவலப்பர்', 'ಡೆವಲಪರ್', 'ഡെവലപ്പർ', 'ডেভেলপার', 'विकासक', 'ડેવલપર', 'ਡਿਵੈਲਪਰ', 'ڈویلپر', 'desarrollador', 'développeur', 'entwickler', '开发者'], route: 'developer' },

  // Login
  { keys: ['login', 'sign in', 'signin', 'लॉगिन', 'साइन इन', 'లాగిన్', 'உள்நுழை', 'ಲಾಗಿನ್', 'ലോഗിൻ', 'লগইন', 'लॉगिन', 'લૉગિન', 'ਲੌਗਇਨ', 'لاگ ان', 'iniciar sesión', 'connexion', 'anmelden', '登录'], route: 'login' },

  // Register
  { keys: ['register', 'sign up', 'signup', 'create account', 'रजिस्टर', 'నమోదు', 'பதிவு', 'ನೋಂದಣಿ', 'രജിസ്റ്റർ', 'নিবন্ধন', 'नोंदणी', 'નોંધણી', 'ਰਜਿਸਟਰ', 'رجسٹر', 'registrarse', 'inscription', 'registrieren', '注册'], route: 'register' },
];

// Navigation trigger phrases in multiple languages
const NAV_TRIGGERS = [
  // English
  'go to', 'open', 'show', 'navigate', 'take me to', 'visit', 'switch to',
  // Hindi
  'खोलो', 'जाओ', 'दिखाओ', 'पर जाएं', 'खोलें', 'दिखाएं',
  // Telugu
  'తెరవండి', 'చూపించు', 'వెళ్ళండి', 'చూపండి',
  // Tamil
  'திற', 'திறக்க', 'காட்டு', 'செல்',
  // Kannada
  'ತೆರೆ', 'ತೋರಿಸು', 'ಹೋಗು',
  // Malayalam
  'തുറക്കൂ', 'കാണിക്കൂ', 'പോകൂ',
  // Bengali
  'খুলুন', 'দেখান', 'যান',
  // Marathi
  'उघडा', 'दाखवा', 'जा',
  // Gujarati
  'ખોલો', 'બતાવો', 'જાવ',
  // Punjabi
  'ਖੋਲੋ', 'ਦਿਖਾਓ', 'ਜਾਓ',
  // Urdu
  'کھولیں', 'دکھائیں', 'جائیں',
  // Spanish
  'abrir', 'ir a', 'mostrar',
  // French
  'ouvrir', 'aller', 'montrer',
  // German
  'öffnen', 'gehe zu', 'zeigen',
  // Chinese
  '打开', '去', '显示', '前往',
];

/**
 * Detect if the user message has a navigation intent.
 * @param {string} text - User's message
 * @returns {{ intent: string, route: string, label: string } | null}
 */
export function detectNavigationIntent(text) {
  if (!text || typeof text !== 'string') return null;

  const lower = text.toLowerCase().trim();

  // Check if the message contains a navigation trigger phrase
  const hasNavTrigger = NAV_TRIGGERS.some(trigger => lower.includes(trigger));

  // Search for a matching route keyword
  for (const entry of KEYWORD_MAP) {
    for (const keyword of entry.keys) {
      if (lower.includes(keyword.toLowerCase())) {
        const routeInfo = NAVIGATION_ROUTES[entry.route];
        if (routeInfo) {
          // For keywords that are very generic (like "home"), require a nav trigger
          const genericKeys = ['home', 'main', 'advice', 'weather', 'forum', 'farmers', 'price', 'prices', 'dev'];
          const isGeneric = genericKeys.includes(keyword.toLowerCase());

          if (isGeneric && !hasNavTrigger) continue;

          return {
            intent: `navigate_${entry.route}`,
            route: routeInfo.path,
            label: routeInfo.label,
          };
        }
      }
    }
  }

  return null;
}

/**
 * Parse a backend intent string (like "navigate_dashboard") into route info.
 * @param {string} intent - Intent string from Gemini API
 * @returns {{ route: string, label: string } | null}
 */
export function parseBackendIntent(intent) {
  if (!intent || !intent.startsWith('navigate_')) return null;

  const routeKey = intent.replace('navigate_', '');
  const routeInfo = NAVIGATION_ROUTES[routeKey];

  if (routeInfo) {
    return { route: routeInfo.path, label: routeInfo.label };
  }

  return null;
}

/**
 * Map i18n language code to BCP-47 speech recognition code.
 * @param {string} lang - i18n language code (e.g., 'te', 'hi')
 * @returns {string} BCP-47 code (e.g., 'te-IN', 'hi-IN')
 */
export function getLanguageCode(lang) {
  const langMap = {
    en: 'en-US',
    hi: 'hi-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    pa: 'pa-IN',
    ur: 'ur-PK',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    zh: 'zh-CN',
  };
  return langMap[lang] || 'en-US';
}

/**
 * Get the language name for TTS voice matching.
 * @param {string} lang - i18n language code
 * @returns {string} Language name for voice matching
 */
export function getTTSLanguage(lang) {
  const map = {
    en: 'en', hi: 'hi', te: 'te', ta: 'ta', kn: 'kn',
    ml: 'ml', bn: 'bn', mr: 'mr', gu: 'gu', pa: 'pa',
    ur: 'ur', es: 'es', fr: 'fr', de: 'de', zh: 'zh',
  };
  return map[lang] || 'en';
}
