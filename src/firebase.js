import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAME7mdt71fKie_FnjvMh6YEWSLhGZchVc",
  authDomain: "ryslingecity.firebaseapp.com",
  projectId: "ryslingecity",
  storageBucket: "ryslingecity.firebasestorage.app",
  messagingSenderId: "254225760313",
  appId: "1:254225760313:web:a7d9a98370ab1c00fe4de8",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
