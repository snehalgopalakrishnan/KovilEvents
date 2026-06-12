import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyAl_Sci94uBxXYA7O1Dy7_ywwBshLNvLqk",
  authDomain: "kovilevents.firebaseapp.com",
  projectId: "kovilevents",
  storageBucket: "kovilevents.firebasestorage.app",
  messagingSenderId: "1032943476348",
  appId: "1:1032943476348:web:d12a8a2571f21cfcc4f3f9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);


