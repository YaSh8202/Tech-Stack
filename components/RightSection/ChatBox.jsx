import React, { useContext, useEffect, useRef, useState } from "react";
import { GroupContext } from "../../lib/groupContext";
import Message from "./Message";
import ScrollableFeed from "react-scrollable-feed";
import Lottie from "react-lottie";
import animationData from "../../lib/lotties/messageLoading.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const ChatBox = () => {
  const { messages, selectedGroup, loading } = useContext(GroupContext);
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setTimeout(() => {
      scrollRef.current?.scrollToBottom({
        behavior: "smooth",
      });
    }, 100);

    return () => clearTimeout(interval);
  }, [loading, messages]);

  return (
    <ScrollableFeed
      id="messages"
      ref={scrollRef}
      className="flex flex-col mt-2 gap-2 flex-1 w-full px-2 md:px-6  overflow-y-scroll scrollbar-hide   "
    >
      {loading || !messages ? (
        <Lottie options={defaultOptions} height={400} width={400} />
      ) : (
        <>
          {messages.map((message, i) => (
            <Message
              key={message.id}
              message={message}
              linkedMessage={messages.find((m) => {
                return m.id === message.repliedTo;
              })}
              needHeader={
                i === 0 ||
                messages[i - 1].sender.username !== message.sender.username
              }
            />
          ))}
        </>
      )}
    </ScrollableFeed>
  );
};

export default ChatBox;
