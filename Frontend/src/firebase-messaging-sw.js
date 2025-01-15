importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
// firebase.initializeApp();
firebase.initializeApp({
  apiKey: "AIzaSyCeA6LtoMYM9VcarlyD8l7d9gvAbAC1cxs",
  authDomain: "car-rental-f0e79.firebaseapp.com",
  projectId: "car-rental-f0e79",
  storageBucket: "car-rental-f0e79.appspot.com",
  messagingSenderId: "898414440900",
  appId: "1:898414440900:web:14e13460ce53e702fa3491",
  measurementId: "G-44N37PL491",
  vapidKey: 'BBF7bRi09DxzvY-Pp0kaxv47gEl-oo2F5PPygB7BcMFAjoM5zozgAHQ1VDMgUP2F_QGKMEHsMujegkyRDkcwHQk'
});

const messaging = firebase.messaging();
