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
  authDomain: "mini-project-f3b74.firebaseapp.com",
  projectId: "mini-project-f3b74",
  storageBucket: "mini-project-f3b74.appspot.com",
  messagingSenderId: "333984169286",
  appId: "1:333984169286:web:79aed264c2d0c4a339b947",
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
      ? new Date(date)?.toDateString([], {
          day: "numeric",
          month: "short",
        })
      : date?.toDate()?.toDateString([], {
          day: "numeric",
          month: "short",
        });
  return {
    ...data,

    date: createdAt,
  };
}
