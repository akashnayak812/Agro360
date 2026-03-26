const weatherCache = new Map();

export const fetchRealWeather = async (lat, lon) => {
    const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    
    if (weatherCache.has(cacheKey)) {
        return weatherCache.get(cacheKey);
    }
    
    // Explicit error for user regarding OpenWeather Map API Key
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!API_KEY) {
        throw new Error('Please enter VITE_OPENWEATHER_API_KEY in frontend/.env to fetch live data!');
    }

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch weather data from OpenWeatherMap');
    }

    const data = await response.json();
    
    // Extract rainfall if available (OpenWeather provides it occasionally per 1h or 3h)
    const rainfall = data.rain ? (data.rain['1h'] || data.rain['3h'] || 0) : 0;
    
    // Map OpenWeather conditions to our advisory conditions
    let conditionName = 'Cloudy';
    if (data.weather && data.weather.length > 0) {
        const main = data.weather[0].main;
        if (main === 'Clear') conditionName = 'Sunny';
        else if (['Rain', 'Drizzle', 'Thunderstorm', 'Snow'].includes(main)) conditionName = 'Rainy';
        else if (main === 'Clouds') conditionName = 'Cloudy';
    }

    const result = {
        temperature: Math.round(data.main.temp),
        humidity: Math.round(data.main.humidity),
        rainfall: rainfall,
        condition: conditionName,
        windSpeed: data.wind ? Math.round(data.wind.speed * 3.6) : null, // Convert m/s to km/h
        timestamp: new Date().toLocaleTimeString()
    };
    
    weatherCache.set(cacheKey, result);
    return result;
};

export const fetchWeatherByIP = async () => {
    try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) throw new Error('Google Maps API Key missing');
        
        const geoResponse = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}) // Empty body uses IP address for fallback
        });
        
        if (!geoResponse.ok) throw new Error('Geolocation API request failed');
        
        const geoData = await geoResponse.json();
        const { lat, lng } = geoData.location;
        
        return await fetchRealWeather(lat, lng);
    } catch (error) {
        console.error('Error fetching weather by IP:', error);
        throw error;
    }
};
