import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCBVoWMdFHXDZ7jbloLNLv-QerhrtokrxI",
    authDomain: "sardordev-movie.firebaseapp.com",
    projectId: "sardordev-movie",
    storageBucket: "sardordev-movie.appspot.com",
    messagingSenderId: "676678702809",
    appId: "1:676678702809:web:adb4afc1d633ab4e41d0c8"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth();

export default app;
export { db, auth };