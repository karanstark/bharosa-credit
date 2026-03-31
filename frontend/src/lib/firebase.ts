import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5jazw8hMEYaJcRZcA8iIgrKUQ7DzZRlo",
  authDomain: "bharosa-credit.firebaseapp.com",
  projectId: "bharosa-credit",
  storageBucket: "bharosa-credit.firebasestorage.app",
  messagingSenderId: "1078972914122",
  appId: "1:1078972914122:web:cccc4a1f312200d914d733"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
