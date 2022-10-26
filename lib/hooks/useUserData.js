import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let unsubscribe;
    if (user) {
      const ref = doc(collection(firestore, "users"), user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
        setAbout(doc.data()?.about);
      });
    } else {
      setUsername(null);
      setAbout("");
    }
    setLoading(false);

    return unsubscribe;
  }, [user]);

  return { user, username, about, loading };
}
