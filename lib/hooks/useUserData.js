import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, firestore } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export function useUserData() {
  // const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [joinedGroups, setJoinedGroups] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    let unsubscribe;
    if (user) {
      const ref = doc(collection(firestore, "users"), user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
        setAbout(doc.data()?.about);
        setJoinedGroups(doc.data()?.joinedGroups || []);
      });
    } else {
      setUsername(null);
      setAbout("");
    }
    if (user === undefined) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    return unsubscribe;
  }, [user]);

  return { user, username, about, loading , joinedGroups};
}
