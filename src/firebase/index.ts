import { initializeApp } from "firebase/app";



const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "tio-patinhas.firebaseapp.com",
  databaseURL: "https://tio-patinhas.firebaseio.com",
  projectId: "tio-patinhas",
  storageBucket: "tio-patinhas.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

initializeApp(firebaseConfig);
