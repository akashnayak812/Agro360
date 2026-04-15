import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

// Setup API URL dynamically based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';

export function LocationProvider({ children }) {
  // Global State
  const [location, setLocation] = useState(null); // { lat, lon }
  const [address, setAddress] = useState(null); // { city, district, state, formatted }
  const [weather, setWeather] = useState(null);
  const [soil, setSoil] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);

  // Load cached data on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('userLocationData');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.weather) setWeather(parsed.weather);
        if (parsed.soil) setSoil(parsed.soil);
      }
    } catch (e) {
      console.error('Failed to parse cached location data:', e);
    }
  }, []);

  // Sync state to localStorage whenever it fully updates
  useEffect(() => {
    if (location && address && weather) {
      localStorage.setItem('userLocationData', JSON.stringify({
        location,
        address,
        weather,
        soil,
        lastUpdated: new Date().toISOString()
      }));
    }
  }, [location, address, weather, soil]);

  // Main action: Cascaded fetch
  const fetchLocationAndData = async () => {
    setIsLocating(true);
    setError(null);

    try {
      // 1. Get GPS coordinates
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setLocation({ lat, lon });

      // 2. Reverse Geocode (OpenStreetMap Nominatim)
      // Note: Nominatim limit is 1 request/second. We respect this by aggressive caching via localStorage and manual 'Refresh' buttons.
      let state = '', district = '', city = '', formatted = '';
      try {
        const geocodeRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        if (geocodeRes.ok) {
          const geoData = await geocodeRes.json();
          formatted = geoData.display_name;
          const a = geoData.address;
          state = a.state || '';
          // Handle various namings for district/county
          district = a.state_district || a.county || a.city_district || '';
          city = a.city || a.town || a.village || a.suburb || district || 'Unknown Location';
          
          setAddress({ city, district, state, formatted });
        }
      } catch (err) {
        console.warn('Nominatim reverse geocoding failed, continuing without precise address.', err);
      }

      // 3. Fetch Weather from backend (which uses OpenWeatherMap securely)
      try {
        const weatherRes = await fetch(`${API_URL}/api/location/weather`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lon, state, district })
        });
        if (weatherRes.ok) {
          const weatherData = await weatherRes.json();
          setWeather(weatherData);
        }
      } catch (err) {
        console.error('Weather fetch failed:', err);
      }

      // 4. Fetch Soil Data from backend (which uses SoilGrids)
      try {
        const soilRes = await fetch(`${API_URL}/api/location/soil/soilgrids`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lon, state, district })
        });
        if (soilRes.ok) {
          const soilData = await soilRes.json();
          setSoil(soilData);
        }
      } catch (err) {
        console.error('Soil fetch failed:', err);
      }

    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch(err.code) {
          case err.PERMISSION_DENIED:
             setError('Location access denied. Please allow location permissions in your browser.');
             break;
          case err.POSITION_UNAVAILABLE:
             setError('Location information is unavailable.');
             break;
          case err.TIMEOUT:
             setError('The request to get user location timed out.');
             break;
          default:
             setError('An unknown error occurred while retrieving location.');
        }
      } else {
        setError(err.message || 'Failed to determine location.');
      }
      console.error(err);
    } finally {
      setIsLocating(false);
    }
  };

  // Manual action: Fetch via address input
  const fetchLocationByAddress = async (state, district) => {
    setIsLocating(true);
    setError(null);
    try {
      let lat, lon;
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const geoQuery = encodeURIComponent(`${district}, ${state}, IN`);
      const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${geoQuery}&limit=1&appid=${apiKey}`);
      
      if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData && geoData.length > 0) {
              lat = geoData[0].lat;
              lon = geoData[0].lon;
          }
      }

      if (!lat || !lon) {
        const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(district + ", " + state + ", India")}&limit=1`);
        if (nomRes.ok) {
            const nomData = await nomRes.json();
            if (nomData && nomData.length > 0) {
                lat = parseFloat(nomData[0].lat);
                lon = parseFloat(nomData[0].lon);
            }
        }
      }

      if (!lat || !lon) throw new Error("Could not find coordinates for this location.");

      setLocation({ lat, lon });
      setAddress({ state, district, city: district, formatted: `${district}, ${state}` });

      // Fetch Weather
      try {
        const weatherRes = await fetch(`${API_URL}/api/location/weather`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lon, state, district })
        });
        if (weatherRes.ok) setWeather(await weatherRes.json());
      } catch (e) {
        console.error('Weather fetch error on manual address:', e);
      }

      // Fetch Soil
      try {
        const soilRes = await fetch(`${API_URL}/api/location/soil/soilgrids`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lon, state, district })
        });
        if (soilRes.ok) setSoil(await soilRes.json());
      } catch (e) {
        console.error('Soil fetch error on manual address:', e);
      }

    } catch (err) {
      setError(err.message || 'Failed to determine manual location.');
      console.error('fetchLocationByAddress error:', err);
    } finally {
      setIsLocating(false);
    }
  };

  const clearLocation = () => {
    setLocation(null);
    setAddress(null);
    setWeather(null);
    setSoil(null);
    setError(null);
    localStorage.removeItem('userLocationData');
  };

  return (
    <LocationContext.Provider value={{
      location,
      address,
      weather,
      soil,
      isLocating,
      error,
      fetchLocationAndData,
      fetchLocationByAddress,
      clearLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationData() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationData must be used within a LocationProvider');
  }
  return context;
}
