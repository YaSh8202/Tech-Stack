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
});

export const GroupContextProvider = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [messages, setMessages] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (!selectedGroup) return;
    setSelectedMessage(null);
    setShowSearchBar(false);
    setMessages(null);

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
      if (!selectedGroup?.id) return;

      const messagesRef = collection(
        doc(collection(firestore, "Groups"), selectedGroup?.id),
        "messages"
      );
      const messagesQuery = query(messagesRef, orderBy("createdAt"));
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const msgs = [];
        snapshot.forEach((d) => {
          msgs.push(postToJSON(d));
        });
        setMessages(msgs);
      });
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
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
