// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDnpdNykIN8MXutXb1P1Tv_78O6CQev50M",
  authDomain: "my-stor-2-11916.firebaseapp.com",
  projectId: "my-stor-2-11916",
  storageBucket: "my-stor-2-11916.appspot.com",
  messagingSenderId: "676194836897",
  appId: "1:676194836897:web:24c51679ff978553b7abe0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();