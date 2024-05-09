// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXvkvhYSaGEyIyNCmAvRYu5_nlBft2eZU",
  authDomain: "turar-joy.firebaseapp.com",
  projectId: "turar-joy",
  storageBucket: "turar-joy.appspot.com",
  messagingSenderId: "102759287799",
  appId: "1:102759287799:web:9893aab300af2d49977cf2"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore()