import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
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
import LanguageSelector from './components/LanguageSelector';
import Login from './components/Login';
import Register from './components/Register';
import Developer from './components/Developer';
import AIChatbot from './components/AIChatbot';

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {!isAuthPage && (
        <div className="absolute top-4 right-6 z-50">
          <LanguageSelector />
        </div>
      )}

      {isAuthPage ? (
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      ) : (
        <Layout>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
              <Route path="/crop" element={<AnimatedPage><CropRecommendation /></AnimatedPage>} />
              <Route path="/fertilizer" element={<AnimatedPage><FertilizerRecommendation /></AnimatedPage>} />
              <Route path="/yield" element={<AnimatedPage><YieldPrediction /></AnimatedPage>} />
              <Route path="/soil" element={<AnimatedPage><SoilAnalysis /></AnimatedPage>} />
              <Route path="/disease" element={<AnimatedPage><DiseaseDetection /></AnimatedPage>} />
              <Route path="/advisory" element={<AnimatedPage><Advisory /></AnimatedPage>} />
              <Route path="/community" element={<AnimatedPage><Community /></AnimatedPage>} />
              <Route path="/developer" element={<AnimatedPage><Developer /></AnimatedPage>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
          <VoiceAssistant />
          <AIChatbot />
        </Layout>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
