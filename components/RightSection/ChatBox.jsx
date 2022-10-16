import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { firestore } from "../../lib/firebase";
import { GroupContext } from "../../lib/groupContext";
import Message from "./Message";
import ScrollableFeed from "react-scrollable-feed";

const ChatBox = () => {
  const { selectedGroup, openAIMessages } = useContext(GroupContext);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (!selectedGroup) return;
    if (selectedGroup.id === "open-ai") {
      setMessages(openAIMessages);
      return;
    }

    const getMessages = async () => {
      const messagesRef = collection(
        doc(collection(firestore, "Groups"), selectedGroup?.id),
        "messages"
      );
      const messagesQuery = query(messagesRef, orderBy("createdAt"));
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const msgs = [];
        snapshot.forEach(async (d) => {
          msgs.push(d.data());
        });

        setMessages(msgs);
      });
      return unsubscribe;
    };
    getMessages();
    // return () => unsubscribe();
  }, [selectedGroup, openAIMessages]);
  return (
    <ScrollableFeed
      id="messages"
      className="flex flex-col flex-1 w-full px-6  overflow-auto overflow-y-scroll scrollbar-hide  "
    >
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </ScrollableFeed>
  );
};

export default ChatBox;
