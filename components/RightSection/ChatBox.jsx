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
import { flushSync } from "react-dom";

const ChatBox = () => {
  const { selectedGroup } = useContext(GroupContext);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (!selectedGroup) return;
    if (!selectedGroup || selectedGroup.id === "open-ai") {
      setMessages([]);
      return;
    };

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
        flushSync(() => {
          setMessages(msgs);
        });
        var elem = document.getElementById("messages");
        elem.scroll({ top: elem.scrollHeight, behavior: "smooth" });
      });
      return unsubscribe;
    };
    getMessages();
    // return () => unsubscribe();
  }, [selectedGroup]);
  return (
    <div
      id="messages"
      className="flex flex-col flex-1 w-full px-6  overflow-auto overflow-y-scroll scrollbar-hide  "
    >
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default ChatBox;
