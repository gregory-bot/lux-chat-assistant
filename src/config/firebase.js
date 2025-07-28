// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCbnsbYdQDuj_9pBWCeWBU1eXr8_-j8b4c",
  authDomain: "support-chat-3dab4.firebaseapp.com",
  projectId: "support-chat-3dab4",
  storageBucket: "support-chat-3dab4.firebasestorage.app",
  messagingSenderId: "906167021290",
  appId: "1:906167021290:web:83974728341973e732b193",
  measurementId: "G-JLT6LNFDZM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;