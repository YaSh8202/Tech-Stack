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
  groups: [],
  selectedGroup: null,
  setSelectedGroup: () => {},
  openAIMessages: [],
  setGroups: () => {},
  messages: [],
  showSearchBar: false,
  setShowSearchBar: () => {},
});

export const GroupContextProvider = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openAIMessages, setOpenAIMessages] = useState([]);
  const [markdown, setMarkdown] = useState("");
  const [messages, setMessages] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    if (!selectedGroup) return;
    if (selectedGroup.id === "open-ai") {
      setMessages(openAIMessages);
      return;
    }
    setShowSearchBar(false);

    const getMessages = async () => {
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
    };
    getMessages();
    // return () => unsubscribe();
  }, [selectedGroup, openAIMessages]);

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const groupsQuery = query(
      collection(firestore, "Groups"),
      orderBy("updatedAt", "desc")
    );
    const unsubscribe = onSnapshot(groupsQuery, (snapshot) => {
      const groups = snapshot.docs.map(postToJSON);
      setGroups(groups);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // get open ai messages from local storage
    const openAI = localStorage.getItem("openAI");
    if (openAI) {
      setOpenAIMessages(JSON.parse(openAI));
    }
    console.log("openAI", openAIMessages);
  }, []);

  return (
    <GroupContext.Provider
      value={{
        groups,
        selectedGroup,
        setSelectedGroup,
        openAIMessages,
        setOpenAIMessages,
        markdown,
        setMarkdown,
        setGroups,
        messages,
        showSearchBar,
        setShowSearchBar,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
