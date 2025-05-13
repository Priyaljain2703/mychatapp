// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import {  getDatabase, ref, set, get, child, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCoullLDc4G1b2_vxqMU4eTqStT8psXbI",
  authDomain: "myrealtimechatapp-29fec.firebaseapp.com",
  projectId: "myrealtimechatapp-29fec",
  storageBucket: "myrealtimechatapp-29fec.firebasestorage.app",
  messagingSenderId: "651164580399",
  appId: "1:651164580399:web:d185b846325da8ae7064da",
  measurementId: "G-RB8Q6S538S",
  databaseURL: "https://myrealtimechatapp-29fec-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
 const database = getDatabase(app);
export { auth,database, ref, set, get, child, query, orderByChild, equalTo};