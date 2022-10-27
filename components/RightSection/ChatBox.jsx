import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { firestore, postToJSON } from "../../lib/firebase";
import { GroupContext } from "../../lib/groupContext";
import Message from "./Message";
import ScrollableFeed from "react-scrollable-feed";

const ChatBox = () => {
  const { messages } = useContext(GroupContext);
  return (
    <ScrollableFeed
      // forceScroll={true}
      id="messages"
      className="flex flex-col mt-2 gap-2 flex-1 w-full px-2 md:px-6  overflow-auto overflow-y-scroll scrollbar-hide  "
    >
      {messages &&
        messages.map((message, i) => (
          <Message key={message.id} message={message} />
        ))}
    </ScrollableFeed>
  );
};

export default ChatBox;
