import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CropRecommendation from './components/CropRecommendation';
import FertilizerRecommendation from './components/FertilizerRecommendation';
import YieldPrediction from './components/YieldPrediction';
import SoilAnalysis from './components/SoilAnalysis';
import DiseaseDetection from './components/DiseaseDetection';
import Advisory from './components/Advisory';
import Community from './components/Community';
import VoiceAssistant from './components/VoiceAssistant';
import AnimatedPage from './components/AnimatedPage';
import LandingPage from './components/LandingPage';
// import LanguageSelector from './components/LanguageSelector';
import Login from './components/Login';
import Register from './components/Register';
import Developer from './components/Developer';
import AIChatbot from './components/AIChatbot';
import DigitalTwin from './components/DigitalTwin';
import MarketInsights from './components/MarketInsights';
import RiskAssessment from './components/RiskAssessment';
import GovtSchemes from './components/GovtSchemes';
import Farm3DVisualization from './components/Farm3DVisualization';
import AccessibilityWidget from './components/AccessibilityWidget';
import AntiGravityCursor from './components/AntiGravityCursor';

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {isAuthPage || location.pathname === '/' ? (
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
            {/* Redirect any unknown routes to / if they are not authenticated pages mostly - though catch-all is below */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      ) : (
        <Layout>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
              <Route path="/crop" element={<AnimatedPage><CropRecommendation /></AnimatedPage>} />
              <Route path="/fertilizer" element={<AnimatedPage><FertilizerRecommendation /></AnimatedPage>} />
              <Route path="/yield" element={<AnimatedPage><YieldPrediction /></AnimatedPage>} />
              <Route path="/soil" element={<AnimatedPage><SoilAnalysis /></AnimatedPage>} />
              <Route path="/disease" element={<AnimatedPage><DiseaseDetection /></AnimatedPage>} />
              <Route path="/advisory" element={<AnimatedPage><Advisory /></AnimatedPage>} />
              <Route path="/community" element={<AnimatedPage><Community /></AnimatedPage>} />
              <Route path="/developer" element={<AnimatedPage><Developer /></AnimatedPage>} />
              <Route path="/simulator" element={<AnimatedPage><DigitalTwin /></AnimatedPage>} />
              <Route path="/market" element={<AnimatedPage><MarketInsights /></AnimatedPage>} />
              <Route path="/risk" element={<AnimatedPage><RiskAssessment /></AnimatedPage>} />
              <Route path="/farm3d" element={<AnimatedPage><Farm3DVisualization /></AnimatedPage>} />
              <Route path="/schemes" element={<AnimatedPage><GovtSchemes /></AnimatedPage>} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
          <AIChatbot />
          <AccessibilityWidget />
        </Layout>
      )}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LocationProvider>
          <Router>
            <AntiGravityCursor />
            <AppContent />
          </Router>
        </LocationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
