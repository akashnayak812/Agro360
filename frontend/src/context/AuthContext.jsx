import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, googleProvider } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    signInWithPopup
} from 'firebase/auth';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth State Changed:", currentUser ? "User Logged In" : "No User");
            setUser(currentUser);
            setLoading(false);
        });

        // Fallback timeout in case Firebase hangs
        const timer = setTimeout(() => {
            setLoading((prev) => {
                if (prev) {
                    console.warn("Auth check timed out, forcing loading false");
                    return false;
                }
                return prev;
            });
        }, 3000);

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    const login = async (email, password) => {
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (err) {
            console.error("Login Error", err);
            setError(err.message || "Failed to sign in");
            return false;
        }
    };

    const register = async (name, email, password) => {
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            return true;
        } catch (err) {
            console.error("Register Error", err);
            setError(err.message || "Failed to register");
            return false;
        }
    };

    const loginWithGoogle = async () => {
        setError(null);
        try {
            await signInWithPopup(auth, googleProvider);
            return true;
        } catch (err) {
            console.error("Google Login Error", err);
            setError(err.message || "Failed to sign in with Google");
            return false;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            return true;
        } catch (err) {
            console.error("Logout Error", err);
            return false;
        }
    };

    // Visual Loader Component
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            register,
            loginWithGoogle,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
