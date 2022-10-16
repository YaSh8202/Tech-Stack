import { collection, doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { firestore } from "../../lib/firebase";
import { UserContext } from "../../lib/userContext";
import MdEditor from "react-markdown-editor-lite";
// Import styles
import "react-markdown-editor-lite/lib/index.css";
// Two different markdown parser
import MarkdownIt from "markdown-it";
const mdParser = new MarkdownIt(/* Markdown-it options */);

const Message = ({ message }) => {
  const [sender, setSender] = useState(null);
  const { username } = useContext(UserContext);
  const isSender = username === sender?.username;
  let createdAt = null;
  try {
    createdAt =
      typeof message?.createdAt === "number"
        ? new Date(message?.createdAt)?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : message.createdAt?.toDate()?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
  } catch (err) {
    console.log(err);
  }

  useEffect(() => {
    if (message.senderId === "open-ai") {
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

  function renderHTML(text) {
    return mdParser.render(text);
  }
  return (
    <div
      key={message.id}
      className={`flex flex-col gap-2   ${
        isSender ? "ml-auto bg-[#D7F8F4] " : "mr-auto bg-white "
      } my-2 min-w-[5rem] relative  rounded-md ${
        message.isMarkdown ? "" : "px-3 pt-1 pb-2.5 "
      } `}
    >
      {message.isMarkdown === true ? (
        <MdEditor
          value={message.text}
          view={{ menu: false, md: false, html: true }}
          renderHTML={renderHTML}
        />
      ) : (
        <div className="flex flex-row gap-2 items-center ">
          {/* <Image
          src={sender?.photoURL}
          alt="sender"
          className="w-10 h-10 rounded-full"
          layout="intrinsic"
          width={40}
          height={40}
        /> */}
          <div className="flex flex-col ">
            {!isSender && (
              <p className="text-sm font-semibold">{sender?.username}</p>
            )}
            <p className="text-sm whitespace-pre-wrap ">{message.text}</p>
            {/* {NewlineText({ text: message.text })} */}
          </div>
          {message.img && (
            <div className="relative w-80 h-64 ">
              <Image
                layout="fill"
                src={message.img}
                alt="message"
                className="rounded-md"
                objectFit="cover"
              />
            </div>
          )}
        </div>
      )}

      {createdAt && (
        <span className="absolute bottom-[2px] right-[2px] text-xs text-gray-500 whitespace-nowrap ">
          {createdAt}
        </span>
      )}
    </div>
  );
};

export default Message;
