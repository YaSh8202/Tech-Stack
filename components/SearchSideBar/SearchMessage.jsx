import { collection, doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import TimeAgo from "timeago-react";
import { firestore } from "../../lib/firebase";
import { GroupContext } from "../../lib/groupContext";
import { UserContext } from "../../lib/userContext";

const SearchMessage = ({ message, inputType }) => {
  
  const sender = message?.sender;
  const { username } = useContext(UserContext);
  const { setShowSearchBar } = useContext(GroupContext);
  const isSender = username === sender?.username;
  let createdAt = null;
  try {
    createdAt =
      typeof message?.createdAt === "number"
        ? new Date(message?.createdAt)?.toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            // dateStyle: "short",
            day: "numeric",
            month: "short",
          })
        : message.createdAt?.toDate()?.toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            // dateStyle: "short",
            day: "numeric",
            month: "short",
          });
  } catch (err) {
    console.log(err);
  }

  return (
    <div
      onClick={() => {
        const msg = document.getElementById(message?.id);
        msg?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
        // add transition
        msg?.classList.add("animate-scaleFocus");
        if (window.innerWidth < 1024) {
          setShowSearchBar(false);
        }
        setTimeout(() => {
          msg?.classList.remove("animate-scaleFocus");
        }, 1000);
      }}
      className={`flex flex-col px-3 py-2 box-border w-full bg-gray-100 rounded cursor-pointer {${
        inputType ? "hover:scale-[1.02]" : ""
      } hover:shadow  duration-150  `}
    >
      <p className="text-xs text-gray-600"> {createdAt}</p>
      <div className="flex flex-row items-center">
        <p className="text-sm text-gray-600 underline">@{sender?.username}</p>
        <p className="ml-2 text-sm text-gray-700 font-medium w-min flex-1 truncate ">
          {message?.isMarkdown ? "Markdown" : message?.text}
        </p>
      </div>
    </div>
  );
};

export default SearchMessage;
