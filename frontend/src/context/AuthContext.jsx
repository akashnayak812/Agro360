import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user profile from backend
    const fetchUserProfile = async (authToken) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                return userData;
            }
        } catch (err) {
            console.error('Failed to fetch user profile:', err);
        }
        return null;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser && token) {
                // Fetch full user profile from backend
                await fetchUserProfile(token);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [token]);

    const login = async (email, password) => {
        setError(null);
        try {
            // Login with backend
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token
                localStorage.setItem('token', data.access_token);
                setToken(data.access_token);
                
                // Also login to Firebase for realtime features
                try {
                    await signInWithEmailAndPassword(auth, email, password);
                } catch (firebaseErr) {
                    console.log('Firebase login failed, but backend auth succeeded');
                }
                
                setUser(data.user);
                return true;
            } else {
                setError(data.msg || 'Failed to login');
                return false;
            }
        } catch (err) {
            console.error("Login Error", err);
            setError("Failed to sign in");
            return false;
        }
    };

    const register = async (name, email, password) => {
        setError(null);
        try {
            // Register with backend
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token
                localStorage.setItem('token', data.access_token);
                setToken(data.access_token);
                
                // Also register in Firebase
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    await updateProfile(userCredential.user, { displayName: name });
                } catch (firebaseErr) {
                    console.log('Firebase registration failed, but backend auth succeeded');
                }
                
                setUser(data.user);
                return true;
            } else {
                setError(data.msg || 'Failed to register');
                return false;
            }
        } catch (err) {
            console.error("Register Error", err);
            setError("Failed to register");
            return false;
        }
    };

    const logout = async () => {
        try {
            // Logout from backend
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Logout from Firebase
            await signOut(auth);
            
            // Clear local state
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            
            return true;
        } catch (err) {
            console.error("Logout Error", err);
            return false;
        }
    };

    const refreshUser = async () => {
        if (token) {
            await fetchUserProfile(token);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token,
            loading, 
            error, 
            login, 
            register, 
            logout,
            refreshUser
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
