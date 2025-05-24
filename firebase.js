
import { initializeApp, getApps } from "firebase/app";
import {  getDatabase, ref, set, get, child, query, orderByChild, equalTo } from 'firebase/database';
import { getStorage } from "firebase/storage";
import { getAuth ,updateProfile} from "firebase/auth";

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
 const storage = getStorage(app);
export { auth,database, ref, set, get, child, query, orderByChild, equalTo ,storage,updateProfile};