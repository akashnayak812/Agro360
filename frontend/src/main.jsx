import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'; // Import i18n configuration
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F1F8E9]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-700 animate-pulse" />
          <p className="text-gray-500 text-sm font-medium">Loading Agro360...</p>
        </div>
      </div>
    }>
      <App />
    </Suspense>
  </StrictMode>,
)
