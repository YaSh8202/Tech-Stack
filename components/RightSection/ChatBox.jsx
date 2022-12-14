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
    if (selectedGroup.questionPage) {
      return;
    }

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
      className="mt-2 flex w-full flex-1 flex-col gap-2 overflow-x-hidden overflow-y-scroll   px-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 md:px-6   "
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
              needHeader={i === 0 || messages[i - 1].date !== message.date}
              last={i === messages.length - 1}
            />
          ))}
        </>
      )}
    </ScrollableFeed>
  );
};

export default ChatBox;
