// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// (You get this from Project Settings in the Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyAdaF5Jcadn29rp0hSTAAJCKXQ0flIVY2w",
    authDomain: "sportguard-50842.firebaseapp.com",
    projectId: "sportguard-50842",
    storageBucket: "sportguard-50842.firebasestorage.app",
    messagingSenderId: "29438614720",
    appId: "1:29438614720:web:a67f0275b8256268b42125",
    measurementId: "G-4QX1KKYFEC"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);