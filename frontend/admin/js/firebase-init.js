// تهيئة Firebase للواجهة الأمامية (Client-side)

// إعدادات Firebase من المعلومات المقدمة
const firebaseConfig = {
  apiKey: "AIzaSyDVwLER-g5AL8TH52Go2sTEbS7O-HwaimE",
  authDomain: "mahjooz-aca56.firebaseapp.com",
  projectId: "mahjooz-aca56",
  storageBucket: "mahjooz-aca56.appspot.com", // تصحيح نطاق التخزين إذا لزم الأمر
  messagingSenderId: "339972782124",
  appId: "1:339972782124:web:49dabf8ed86f0ebfae3989",
  measurementId: "G-49LJS40ZG2"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// إنشاء مراجع للخدمات المستخدمة
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

console.log("تم تهيئة Firebase بنجاح");
