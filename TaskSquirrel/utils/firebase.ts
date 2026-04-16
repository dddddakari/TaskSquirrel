import { initializeApp } from "firebase/app";
import { 
  initializeAuth, 
  // @ts-ignore
  getReactNativePersistence, 
  getAuth 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Firebase config pulled from .env.local via Expo's EXPO_PUBLIC_ prefix
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Basic safety check for environment variables
const isConfigComplete = Object.values(firebaseConfig).every(val => !!val);
if (!isConfigComplete && Platform.OS === 'web') {
  console.warn(
    "Firebase config is incomplete. Please check your .env.local file " +
    "and ensure all EXPO_PUBLIC_FIREBASE_* variables are set."
  );
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence for Native, or standard for Web
export const auth = Platform.OS === 'web' 
  ? getAuth(app) 
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });

// Firestore instance — used for task and settings storage
export const db = getFirestore(app);
