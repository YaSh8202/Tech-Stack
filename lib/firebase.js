import { getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  collection,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "techstack-e7ab0.firebaseapp.com",
  projectId: "techstack-e7ab0",
  storageBucket: "techstack-e7ab0.appspot.com",
  messagingSenderId: "16252364548",
  appId: "1:16252364548:web:2c1295c815f82a6a1ed251",
};

// Initialize Firebase
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}
export const firestore = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
export const googleAuthProvider = new GoogleAuthProvider();

// helper functions
export async function getUserWithUsername(username) {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));
  const userDoc = await getDocs(q);

  return userDoc.docs[0] || null;
}

export function postToJSON(doc) {
  const data = doc.data();
  const date = data.createdAt;
  const createdAt =
    typeof date === "number"
      ? new Date(date)?.toLocaleDateString([], {
          day: "numeric",
          month: "short",
          // year: "2-digit",
        })
      : date?.toDate()?.toLocaleDateString([], {
          day: "numeric",
          month: "short",
          // year: "2-digit",
        });
  return {
    ...data,
    updatedAt: data?.updatedAt?.toMillis() || null,
    date: createdAt || null,
    createdAt: data?.createdAt?.toMillis() || null,
  };
}
