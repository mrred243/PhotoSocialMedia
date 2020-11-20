import firebase from 'firebase';


// Api details
var config = {
  apiKey: "AIzaSyD4qaQwPSfcJ0INTTr9Ig0hCUI-cN9J5l8",
  authDomain: "photo-feed-e77ef.firebaseapp.com",
  databaseURL: "https://photo-feed-e77ef.firebaseio.com",
  projectId: "photo-feed-e77ef",
  storageBucket: "photo-feed-e77ef.appspot.com",
  messagingSenderId: "465930600216",
  appId: "1:465930600216:web:dfff803eeb91ccd460286d",
  measurementId: "G-29QMVE3MG2"
};

firebase.initializeApp(config);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
