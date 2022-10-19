import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase";

export function useUserData(setUserModal) {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe;
    if (user) {
      const ref = doc(collection(firestore, "users"), user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
        if (
          typeof doc.data()?.username === "string" &&
          doc.data()?.username !== ""
        ) {
          setUserModal(false);
        } else {
          setUserModal(true);
        }
      });
    } else {
      setUsername(null);
      setUserModal(true);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}
