// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzUsP294V8B0NgNZ3K1Tuo5MGRhPrZToY",
  authDomain: "chat-with-pdf-ai-ef204.firebaseapp.com",
  projectId: "chat-with-pdf-ai-ef204",
  storageBucket: "chat-with-pdf-ai-ef204.firebasestorage.app",
  messagingSenderId: "972493667925",
  appId: "1:972493667925:web:647504b2ba59c3a41ddedc",
  measurementId: "G-GMRE700TQ5",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, storage, analytics };
