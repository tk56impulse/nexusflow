// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestoreを使う場合
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "process.env.NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "propflow-dev-20260306.firebaseapp.com",
  projectId: "propflow-dev-20260306",
  storageBucket: "propflow-dev-20260306.firebasestorage.app",
  messagingSenderId: "779268275967",
  appId: "1:779268275967:web:ce45dde945cfab9f9c56ca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // これで他のファイルからFirestoreを使えるようになります