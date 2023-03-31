import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC37Czp9FXxlEUcs4C3gctDhTnPEt8Cf1M",
  authDomain: "get-working-edf01.firebaseapp.com",
  projectId: "get-working-edf01",
  storageBucket: "get-working-edf01.appspot.com",
  messagingSenderId: "864434557897",
  appId: "1:864434557897:web:ba1f3c950757e38cc70e18",
  measurementId: "G-8RM79ZX461",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;
