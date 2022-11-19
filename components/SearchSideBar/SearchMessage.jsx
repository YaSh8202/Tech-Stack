import { collection, doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { BiImageAlt } from "react-icons/bi";
import { BsMarkdown } from "react-icons/bs";
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
          block: "start",
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
      className={`box-border flex w-full cursor-pointer flex-col rounded bg-gray-100 px-3 py-2 {${
        inputType ? "hover:scale-[1.02]" : ""
      } duration-150  hover:shadow  `}
    >
      <p className="text-xs text-gray-600"> {createdAt}</p>
      <div className="flex flex-row items-center">
        <p className="text-sm text-gray-600 underline">@{sender?.username}</p>
        <div className="ml-2 flex w-min flex-1 items-center truncate text-sm font-medium text-gray-700 ">
          {message?.img && message?.img !== "" && (
            <>
              <BiImageAlt size={16} />
              <p>Image</p>
            </>
          )}
          <p className="max-w-full truncate "> {message?.text}</p>
        </div>
      </div>
    </div>
  );
};

export default SearchMessage;
