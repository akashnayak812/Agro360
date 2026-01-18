// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDn84FHKdEeG_dIFPE79N7GxIPeVRQhc4g",
    authDomain: "agro-360-fc63d.firebaseapp.com",
    projectId: "agro-360-fc63d",
    storageBucket: "agro-360-fc63d.firebasestorage.app",
    messagingSenderId: "294943780532",
    appId: "1:294943780532:web:cdc71d84730a7dc18ff1e1",
    measurementId: "G-QQJXH6PSKB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };