import { collection, doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import TimeAgo from "timeago-react";
import { firestore } from "../../lib/firebase";
import { UserContext } from "../../lib/userContext";

const SearchMessage = ({ message }) => {
  const [sender, setSender] = useState(null);
  const { username } = useContext(UserContext);
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

  useEffect(() => {
    if (message?.senderId === "open-ai") {
      return;
    }

    const getSender = async () => {
      const senderRef = doc(collection(firestore, "users"), message.senderId);
      const senderDoc = await getDoc(senderRef);
      setSender(senderDoc.data());
    };
    getSender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={() => {
        const msg = document.getElementById(message?.id);
        msg?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }}
      className="flex flex-col px-3 py-2 box-border w-full bg-gray-100 rounded"
    >
      <p className="text-xs text-gray-600"> {createdAt}</p>
      <div className="flex flex-row items-center">
        <p className="text-sm text-gray-600 ">{sender?.username}</p>
        <p className="ml-2 text-sm text-gray-700 font-medium flex-1 truncate ">
          {message?.text}
        </p>
      </div>
    </div>
  );
};

export default SearchMessage;
