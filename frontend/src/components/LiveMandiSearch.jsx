import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MarketSelector from './MarketSelector';
import MarketInsightsCard from './MarketInsightsCard';
import { API_URL } from '../lib/api';

const LiveMandiSearch = () => {
    const [states, setStates] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [crops, setCrops] = useState([]);

    const [selectedState, setSelectedState] = useState('');
    const [selectedMarket, setSelectedMarket] = useState('');
    const [selectedCrop, setSelectedCrop] = useState('');

    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingMarkets, setLoadingMarkets] = useState(false);
    const [loadingCrops, setLoadingCrops] = useState(false);

    const [insightData, setInsightData] = useState(null);
    const [loadingInsight, setLoadingInsight] = useState(false);
    const [error, setError] = useState(null);

    // Fetch States on Mount
    useEffect(() => {
        const fetchStates = async () => {
            setLoadingStates(true);
            try {
                const res = await axios.get(`${API_URL}/api/market/states`);
                if (res.data.success) {
                    setStates(res.data.states || []);
                }
            } catch (err) {
                console.error("Failed to fetch states", err);
            } finally {
                setLoadingStates(false);
            }
        };
        fetchStates();
    }, []);

    // Fetch Markets when State changes
    useEffect(() => {
        if (!selectedState) {
            setMarkets([]);
            setSelectedMarket('');
            return;
        }
        const fetchMarkets = async () => {
            setLoadingMarkets(true);
            try {
                const res = await axios.get(`${API_URL}/api/market/markets-by-state?state=${selectedState}`);
                if (res.data.success) {
                    setMarkets(res.data.markets || []);
                }
            } catch (err) {
                console.error("Failed to fetch markets", err);
            } finally {
                setLoadingMarkets(false);
            }
        };
        fetchMarkets();
    }, [selectedState]);

    // Fetch Crops when Market changes
    useEffect(() => {
        if (!selectedMarket) {
            setCrops([]);
            setSelectedCrop('');
            return;
        }
        const fetchCrops = async () => {
            setLoadingCrops(true);
            try {
                const res = await axios.get(`${API_URL}/api/market/crops?market=${selectedMarket}`);
                if (res.data.success) {
                    setCrops(res.data.crops || []);
                }
            } catch (err) {
                console.error("Failed to fetch crops", err);
            } finally {
                setLoadingCrops(false);
            }
        };
        fetchCrops();
    }, [selectedMarket]);

    // Fetch Insight Data when Crop changes
    useEffect(() => {
        if (!selectedState || !selectedMarket || !selectedCrop) {
            setInsightData(null);
            return;
        }
        const fetchInsight = async () => {
            setLoadingInsight(true);
            setError(null);
            try {
                const res = await axios.get(`${API_URL}/api/market/market-insights`, {
                    params: { state: selectedState, market: selectedMarket, crop: selectedCrop }
                });
                if (res.data.success) {
                    setInsightData(res.data.data);
                } else {
                    setError(res.data.error || "No data found");
                    setInsightData(null);
                }
            } catch (err) {
                console.error("Failed to fetch insights", err);
                setError(err.response?.data?.error || "Failed to fetch APMC data.");
                setInsightData(null);
            } finally {
                setLoadingInsight(false);
            }
        };
        fetchInsight();
    }, [selectedState, selectedMarket, selectedCrop]);

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-[#1A3C2B] mb-4">Official APMC Real-Time Rates</h2>
            <MarketSelector
                states={states}
                markets={markets}
                crops={crops}
                selectedState={selectedState}
                selectedMarket={selectedMarket}
                selectedCrop={selectedCrop}
                onStateChange={(val) => { setSelectedState(val); setSelectedMarket(''); setSelectedCrop(''); setInsightData(null); }}
                onMarketChange={(val) => { setSelectedMarket(val); setSelectedCrop(''); setInsightData(null); }}
                onCropChange={setSelectedCrop}
                loadingStates={loadingStates}
                loadingMarkets={loadingMarkets}
                loadingCrops={loadingCrops}
            />
            
            {loadingInsight && (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {insightData && !loadingInsight && (
                <MarketInsightsCard data={insightData} />
            )}
        </div>
    );
};

export default LiveMandiSearch;
