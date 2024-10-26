import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase.config';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { GoogleAuthProvider } from "firebase/auth";


const AuthContext = createContext();
export const useAuth = () => {
    return useContext(AuthContext)
}


const GoogleProvider = new GoogleAuthProvider();
// * authProvider
export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // * Register a user
    const registerUser = async (email, password) => {
        return await createUserWithEmailAndPassword(auth, email, password);
    }

    // * Login a user
    const loginUser = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password);
    }

    // * Sign up with Google
    const signInWithGoogle = async () => {
        return signInWithPopup(auth, GoogleProvider);
    }

    // * Logout the user
    const logout = () => {
        return signOut(auth);
    }

    // * Manage user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => { 
            setCurrentUser(user);
            setLoading(false);

            if (user) {
                const { email, displayName, photoURL } = user;
                const userData = {
                    email, username: displayName, photo: photoURL
                }
            }
        })
        return () => unsubscribe();
    }, [])
    const value = {
        currentUser,
        loading,
        registerUser,
        loginUser,
        signInWithGoogle,
        logout
    }
    return( 
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}