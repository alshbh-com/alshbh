// تهيئة Firebase للواجهة الأمامية
// تطبيق محجوز - حجز الفنادق في اليمن

// تكوين Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDVwLER-g5AL8TH52Go2sTEbS7O-HwaimE",
  authDomain: "mahjooz-aca56.firebaseapp.com",
  projectId: "mahjooz-aca56",
  storageBucket: "mahjooz-aca56.firebasestorage.app",
  messagingSenderId: "339972782124",
  appId: "1:339972782124:web:49dabf8ed86f0ebfae3989",
  measurementId: "G-49LJS40ZG2"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// تعريف المتغيرات العامة
const auth = firebase.auth();
const db = firebase.firestore();

// إعداد اللغة العربية لـ Firebase Auth
auth.languageCode = 'ar';
