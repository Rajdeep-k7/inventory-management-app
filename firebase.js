// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7AbuPiJ1ToR-O7uQNqAmbDeP20gOuNQE",
  authDomain: "inventory-management-583e6.firebaseapp.com",
  projectId: "inventory-management-583e6",
  storageBucket: "inventory-management-583e6.appspot.com",
  messagingSenderId: "851665225496",
  appId: "1:851665225496:web:c0745a720c008f2e60c06d",
  measurementId: "G-VELDVW8SWV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };