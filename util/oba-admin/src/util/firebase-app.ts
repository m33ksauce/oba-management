import { initializeApp } from 'firebase/app';
import * as fsStore from 'firebase-admin/firestore';
import * as fs from 'firebase-admin';

const firebaseConfig = {
    apiKey: "AIzaSyDz1uUwChe8wd60bhRbSI2W_Yf8cg2jDlc",
    authDomain: "oralbibleapp.firebaseapp.com",
    projectId: "oralbibleapp",
    storageBucket: "oralbibleapp",
    messagingSenderId: "739955817746",
    appId: "1:739955817746:web:d6079198ae9f20f5a507cb",
    measurementId: "G-X61F34DT86",
    credential: fs.credential.applicationDefault(),
};

// Initialize Firebase
const app = fs.initializeApp(firebaseConfig);

export function getFirestore() {
    return fsStore.getFirestore(app);
}

export function getStorage() {
    return app.storage()
}