// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDG-EC74yNZ5QSOgPtGIkdFtAqUkb4eqBA",
  authDomain: "reactchat-3da87.firebaseapp.com",
  projectId: "reactchat-3da87",
  storageBucket: "reactchat-3da87.appspot.com",
  messagingSenderId: "493361638810",
  appId: "1:493361638810:web:f5f7649027601bdfa69e23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const  auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()