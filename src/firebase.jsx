// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjNXAioYr1b0sfQfcVi9F20cVaOEWvZXA",
  authDomain: "expense-2a6a3.firebaseapp.com",
  projectId: "expense-2a6a3",
  storageBucket: "expense-2a6a3.firebasestorage.app",
  messagingSenderId: "495844447054",
  appId: "1:495844447054:web:49fac57aae4b21ea14841f",
  measurementId: "G-D6CSG1Q215"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log(analytics);