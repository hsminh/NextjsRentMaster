import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAqH_zUoDy1ya9FU-JE-df2sq7kP7pXy6E",
    authDomain: "rentmaster-4d3e5.firebaseapp.com",
    databaseURL: "https://rentmaster-4d3e5-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "rentmaster-4d3e5",
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