import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBePLN4kdCyK7mIXTr-Vj2amYq9bHMIZss",
    authDomain: "test-d0212.firebaseapp.com",
    databaseURL: "https://test-d0212-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "test-d0212",
    storageBucket: "rentmaster-4d3e5.firebasestorage.app",
    messagingSenderId: "878417427220",
    appId: "1:878417427220:web:c4117db47a0c8a5259a001",
    measurementId: "G-Q8BDLHZRFG"
};

let firebaseApp: FirebaseApp;
let analytics: any;
let database: any;

if (typeof window !== 'undefined') {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    database = getDatabase(firebaseApp);
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(firebaseApp);
        }
    });
}

export { firebaseApp, analytics, database };
export default database;