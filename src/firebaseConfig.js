import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA2oTukhKMxFLgswgONY1rr1WEF75cXr5s",
  authDomain: "crystalstore-d44f1.firebaseapp.com",
  databaseURL: "https://crystalstore-d44f1-default-rtdb.firebaseio.com",
  projectId: "crystalstore-d44f1",
  storageBucket: "crystalstore-d44f1.appspot.com",   // <-- fixed here
  messagingSenderId: "533191378127",
  appId: "1:533191378127:web:6312797ede13eea05923ba",
  measurementId: "G-S6M120DVPB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const projectId = "crystalstore-d44f1";
export const firestoreRestUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
