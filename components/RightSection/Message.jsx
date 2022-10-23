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
import styles from "../styles.module.css";
import markdownItIns from "markdown-it-ins";

const mdParser = new MarkdownIt();
mdParser.use(markdownItIns);
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

  function renderHTML(text) {
    return mdParser.render(text);
  }

  if (!message) {
    return null;
  }

  return (
    <div
      id={message.id}
      className={` max-w-[90vw] border rounded-md p-[6px_7px_6px_9px] flex flex-col text-sm text-[#010101] min-w-[10rem] ${
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
          className=" text-[#0c453e] text-xs underline cursor-pointer  hover:font-semibold font-medium  "
        >
          {sender?.username}
        </div>
        <div className="text-[10px]">{createdAt}</div>
      </div>
      <div className="text-xs overflow-hidden w-full ">
        {message.isMarkdown ? (
          // if message is markdown
          <MdEditor
            value={message.text}
            view={{ menu: false, md: false, html: true }}
            renderHTML={renderHTML}
            readOnly
            plugins={[markdownItIns]}
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
        padding="0 0"
        place="top"
        type="light"
        effect="solid"
        borderColor="#e5e7eb"
        border
      />
    </div>
  );
};

export default Message;
