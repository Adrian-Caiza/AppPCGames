// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA7UQPBeETeeNR_75mrk5NRaugQMoI7HHU",
    authDomain: "apppcgames-1e13c.firebaseapp.com",
    projectId: "apppcgames-1e13c",
    storageBucket: "apppcgames-1e13c.firebasestorage.app",
    messagingSenderId: "830914057525",
    appId: "1:830914057525:web:a9c7b7053a1a0d645fe87c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);