/* eslint-disable @next/next/no-img-element */
import { collection, doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { firestore } from "../../lib/firebase";
import { UserContext } from "../../lib/userContext";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import ReactTooltip from "react-tooltip";
import ReactDOMServer from "react-dom/server";

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

  console.log(sender);

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
      className={` border rounded-md p-[6px_7px_6px_9px] flex flex-col text-sm text-[#010101] min-w-[10rem] ${
        isSender
          ? "bg-[#D7F8F4] mr-1 ml-auto rounded-tr-none message-sender-arrow-right "
          : "bg-white mr-auto ml-1 rounded-tl-none message-arrow-left "
      } `}
    >
      {/* header containing usernmae and time */}
      <div className="flex flex-row items-center justify-between  ">
        <div
          data-html={true}
          data-tip={ReactDOMServer.renderToString(
            <div className="flex flex-row items-center justify-between px-5 py-3 rounded  ">
              <img
                src={sender?.photoURL}
                alt="sender"
                className="w-10 h-10 rounded-full"
                layout="intrinsic"
                width={40}
                height={40}
              />
              <div className="flex flex-col items-end ml-3 ">
                <p>{sender?.displayName}</p>
                <p className="text-xs">@{sender?.username}</p>
              </div>
            </div>
          )}
          className=" text-[#020e0c] font-medium hover:underline "
        >
          {sender?.username}
        </div>
        <div className="text-[10px]">{createdAt}</div>
      </div>
      <div>
        {message.isMarkdown ? (
          // if message is markdown
          <MdEditor
            value={message.text}
            view={{ menu: false, md: false, html: true }}
            renderHTML={renderHTML}
          />
        ) : (
          <div className="flex flex-col gap-2  py-1  ">
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
            <p className="text-sm whitespace-pre-wrap self-end ">
              {message.text}
            </p>
          </div>
        )}
      </div>
      <ReactTooltip
        backgroundColor="#f4fdfc"
        padding="0 0"
        place="top"
        type="light"
        effect="solid"
      />
    </div>
  );
};

export default Message;

/*

(
    <div
      key={message.id}
      className={`flex flex-col gap-2   ${
        isSender
          ? "mr-1 ml-auto message-sender-arrow-right rounded-tl-none bg-[#D7F8F4] "
          : "mr-auto bg-white message-arrow-left ml-1 rounded-tr-none "
      } my-2 min-w-[5rem] relative  rounded-md  ${
        message.isMarkdown ? "p-1" : "px-3 pt-1 pb-2.5 "
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
           <Image
          src={sender?.photoURL}
          alt="sender"
          className="w-10 h-10 rounded-full"
          layout="intrinsic"
          width={40}
          height={40}
        /> 
        <div className="flex flex-col ">
        {!isSender && (
          <p className="text-sm font-semibold">{sender?.username}</p>
        )}
        <p className="text-sm whitespace-pre-wrap ">{message.text}</p>
        {/* {NewlineText({ text: message.text })}
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



*/
