import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../lib/userContext";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import ReactTooltip from "react-tooltip";
import ReactDOMServer from "react-dom/server";
import markdownItIns from "markdown-it-ins";
import { GroupContext } from "../../lib/groupContext";
import { GoReply } from "react-icons/go";
import SearchMessage from "../SearchSideBar/SearchMessage";
import { HiDownload } from "react-icons/hi";
import { storage } from "../../lib/firebase";
import { ref } from "firebase/storage";
import { BsFileEarmarkFill } from "react-icons/bs";
import MessageImage from "./MessageImage.jsx";
import Link from "next/link";

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const renderText = (txt) =>
  txt.split(" ").map((part) =>
    URL_REGEX.test(part) ? (
      <a
        key={part}
        target={"_blank"}
        rel="noopener noreferrer"
        className="text-blue-700 underline"
        href={part}
      >
        {part}{" "}
      </a>
    ) : (
      part + " "
    )
  );

const mdParser = new MarkdownIt();
mdParser.use(markdownItIns);
function getReadableFileSizeString(fileSizeInBytes) {
  var i = -1;
  var byteUnits = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
  do {
    fileSizeInBytes /= 1024;
    i++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}
const Message = ({ message, linkedMessage, needHeader, last }) => {
  const sender = message?.sender;
  const { username, user } = useContext(UserContext);
  const { setSelectedMessage, selectedGroup } = useContext(GroupContext);
  const isSender = user?.uid === sender?.id;
  // const downloadBtn = useRef(null);
  const file = message?.fileMeta;
  const messageRef = useRef(null);

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
    createdAt = new Date(message?.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  const downloadImage = () => {
    // if (!message.img || !downloadBtn?.current) return;

    let imageRef = {
      name: message.text,
    };
    try {
      imageRef = ref(storage, message.img);
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = (event) => {
        const blob = xhr.response;
        const URL = window.URL.createObjectURL(blob);
        const element = document.createElement("a");
        element.href = URL;
        element.download = imageRef.name;

        // simulate link click
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      };
      xhr.open("GET", message.img);
      xhr.send();
    } catch (e) {
      // console.log(e);
    }
  };

  function renderHTML(text) {
    return mdParser.render(text);
  }

  if (!message) {
    return null;
  }

  const handleReply = () => {
    setSelectedMessage(message);
  };

  return (
    <>
      {needHeader && <DateComponent date={message.date} />}
      <div
        id={message.id}
        className={` flex w-auto  min-w-[9rem] max-w-[92%]  flex-col rounded-md border p-[6px_7px_6px_9px] text-sm text-[#010101] md:max-w-[75%] ${
          isSender
            ? "mr-1 ml-auto rounded-tr-none bg-[#D7F8F4] message-sender-arrow-right "
            : "mr-auto ml-1 rounded-tl-none bg-white message-arrow-left "
        } `}
      >
        {/* header containing usernmae and time */}

        {selectedGroup.id !== "open-ai" && (
          <div
            ref={messageRef}
            className="flex flex-row items-center justify-between  "
          >
            <div
              data-html={true}
              data-tip={ReactDOMServer.renderToString(
                <div className="flex flex-row items-center justify-between rounded px-5 py-3  ">
                  <img
                    src={sender?.photoURL}
                    alt="sender"
                    className="h-10 w-10 rounded-full"
                    layout="intrinsic"
                    width={40}
                    height={40}
                  />
                  <div className="ml-3 flex flex-col items-end ">
                    <p>{sender?.displayName}</p>
                    <p className="text-xs">@{sender?.username}</p>
                  </div>
                </div>
              )}
              className=" cursor-pointer text-xs font-medium text-[#0c453e]  underline hover:font-semibold  "
            >
              {sender?.username}
            </div>
            <div className="flex items-center  ">
              <button onClick={handleReply}>
                <GoReply size={11} className="text-gray-600" />
              </button>

              <div className="ml-2 text-[10px] ">{createdAt}</div>
            </div>
          </div>
        )}
        {/* Header ends */}
        {linkedMessage && (
          <div className="block min-w-full max-w-[15rem] ">
            <SearchMessage message={linkedMessage} />
          </div>
        )}

        {/* message body */}
        <div
          className={`${
            message.isMarkdown
              ? "ml-auto max-w-xs overflow-auto md:max-w-md lg:max-w-lg xl:max-w-xl"
              : ""
          }  `}
        >
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
              {message.img && file && (
                <div className="group  relative  overflow-hidden  ">
                  {/* check if file type is of image */}
                  {file.type.startsWith("image") ? (
                    <MessageImage file={file} imgSrc={message.img} />
                  ) : file.type.startsWith("video") ? (
                    <div className="w-[18rem] md:w-[21rem]">
                      <video
                        src={message.img}
                        className="rounded-md "
                        controls
                        width={750}
                        height={450}
                      />
                    </div>
                  ) : (
                    <div className="flex max-w-[12rem] flex-row items-center  gap-2 rounded-md px-1 py-2">
                      <div className="group rounded-full border bg-green-500 p-3 text-white hover:text-white  ">
                        <BsFileEarmarkFill size={20} className=" " />
                      </div>
                      <div className="flex flex-1 flex-col overflow-hidden ">
                        <p
                          title={file.name}
                          className="truncate text-sm text-gray-600"
                        >
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500  ">
                          {getReadableFileSizeString(file.size)}
                        </p>
                      </div>
                    </div>
                  )}
                  {
                    <button
                      onClick={downloadImage}
                      className="invisible absolute bottom-1 right-1 rounded-full bg-gray-100 p-1 duration-150 group-hover:visible "
                      title={`Download ${file?.name}`}
                    >
                      <HiDownload className="text-gray-500  " size={16} />
                    </button>
                  }
                </div>
              )}

              {message.text && (
                <p className="cl self-end whitespace-pre-wrap text-sm">
                  {renderText(message.text.trim())}
                </p>
              )}
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
        {message.isMarkdown && !message.repliedTo && (
          <Link href={`/${selectedGroup.id}/${message.id}`}>
            <a
              title={"Answer this question"}
              className={`absolute rounded-full bg-teal-50 p-1 ${
                isSender ? "left-[-28px]" : "right-[-28px]"
              } top-[50%] translate-y-[-50%] `}
            >
              <img
                className="h-5 w-5"
                src="https://img.icons8.com/windows/64/null/stackexchange.png"
              />
            </a>
          </Link>
        )}
      </div>
    </>
  );
};

export default Message;

function isTodayDate(d) {
  const today = new Date();
  return (
    today.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      // year: "2-digit",
    }) === d
  );
}

const DateComponent = ({ date }) => {
  return (
    <div className="my-3 flex items-center  justify-center">
      <div className="flex h-8 items-center justify-center rounded-full bg-gray-100 py-4 px-6 text-gray-600 shadow-sm">
        {isTodayDate(date) ? "Today" : date}
      </div>
    </div>
  );
};
