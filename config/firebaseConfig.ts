import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: "arquicreai.firebaseapp.com",
	projectId: "arquicreai",
	storageBucket: "arquicreai.firebasestorage.app",
	messagingSenderId: "488634355612",
	appId: "1:488634355612:web:fb7f0a9e449dfae7914259",
	measurementId: "G-42WWS8EGXL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const storage = getStorage(app);
