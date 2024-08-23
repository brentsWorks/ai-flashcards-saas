// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNwbyqAHc_16uKQcPkIRUR-hLPialvmTc",
  authDomain: "flashcard-saas-7fbb5.firebaseapp.com",
  projectId: "flashcard-saas-7fbb5",
  storageBucket: "flashcard-saas-7fbb5.appspot.com",
  messagingSenderId: "415608095035",
  appId: "1:415608095035:web:87887a2628bbade30fb71e",
  measurementId: "G-SLE6ZE0XBK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}