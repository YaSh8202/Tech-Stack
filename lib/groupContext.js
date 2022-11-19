import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { firestore, postToJSON } from "./firebase";

export const GroupContext = createContext({
  selectedGroup: null,
  setSelectedGroup: () => {},
  messages: [],
  showSearchBar: false,
  setShowSearchBar: () => {},
  setMessages: () => {},
  selectedMessage: null,
  setSelectedMessage: () => {},
  loading: true,
});

export const GroupContextProvider = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [messages, setMessages] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedGroup || selectedGroup.answerPage) return;
    setSelectedMessage(null);
    setShowSearchBar(false);
    setMessages([]);

    if (selectedGroup.id === "open-ai") {
      const openAI = localStorage.getItem("openAI");
      if (openAI) {
        setMessages(JSON.parse(openAI));
      } else {
        setMessages([]);
      }
      return;
    }

    try {
      if (!selectedGroup) return;

      setLoading(true);
      const messagesRef = collection(
        doc(collection(firestore, "Groups"), selectedGroup.id),
        "messages"
      );
      const messagesQuery = query(messagesRef, orderBy("createdAt"));
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const msgs = [];
        snapshot.forEach((d) => {
          // setMessages((prev) => [...prev, postToJSON(d)]);
          msgs.push(postToJSON(d));
        });
        setMessages(msgs);
      });
      setLoading(false);
      return unsubscribe;
    } catch (e) {
      console.log(e);
    }
  }, [selectedGroup]);

  return (
    <GroupContext.Provider
      value={{
        selectedGroup,
        setSelectedGroup,
        markdown,
        setMarkdown,
        messages,
        showSearchBar,
        setShowSearchBar,
        setMessages,
        selectedMessage,
        setSelectedMessage,
        loading,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
