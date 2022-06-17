const firebaseConfig = {
  apiKey: "AIzaSyBhNwEduxNfTWZqWxwkfT_OcXJ9vAL1dp8",
  authDomain: "proyectointegrado-d1208.firebaseapp.com",
  projectId: "proyectointegrado-d1208",
  storageBucket: "proyectointegrado-d1208.appspot.com",
  messagingSenderId: "998283958585",
  appId: "1:998283958585:web:8a896bdca369621110f0e8"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const fs = firebase.firestore()