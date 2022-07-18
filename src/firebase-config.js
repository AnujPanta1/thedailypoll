import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDHIZMgyXkNM6HZboWPxDAUbOzPHCSWzas",
    authDomain: "daily-poll-fef6e.firebaseapp.com",
    projectId: "daily-poll-fef6e",
    storageBucket: "daily-poll-fef6e.appspot.com",
    messagingSenderId: "445812047582",
    appId: "1:445812047582:web:fa024b4f44b2160d560c4f",
    measurementId: "G-KP0E9PFFNN"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);