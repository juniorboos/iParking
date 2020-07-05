import * as firebase from 'firebase';
import "firebase/firestore"

// Optionally import the services that you want to use
import "firebase/auth";
//import "firebase/database";
//import "firebase/firestore";
import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase - 
// PUT Your FirebaseAPP Config Here
const firebaseConfig = {
   apiKey: "AIzaSyDNUwSDHswB96jExirz3CCTubZEg1qxg9k",
   authDomain: "mqtt-teste-iot.firebaseapp.com",
   databaseURL: "https://mqtt-teste-iot.firebaseio.com",
   projectId: "mqtt-teste-iot",
   storageBucket: "mqtt-teste-iot.appspot.com",
   messagingSenderId: "786143734656",
   appId: "1:786143734656:web:ef5c81b64f93381f5a2f65",
   measurementId: "G-DWBT867426"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export default firebase;