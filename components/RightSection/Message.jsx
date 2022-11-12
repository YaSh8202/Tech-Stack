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

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const renderText = (txt) =>
  txt.split(" ").map((part) =>
    URL_REGEX.test(part) ? (
      <a
        key={part}
        target={"_blank"}
        rel="noopener noreferrer"
        className="underline text-blue-700"
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
  // const [sender, setSender] = useState(null);
  const sender = message?.sender;
  const { username, user } = useContext(UserContext);
  const { setSelectedMessage, selectedGroup } = useContext(GroupContext);
  const isSender = user?.uid === sender?.id;
  const downloadBtn = useRef(null);
  // const [file, setFile] = useState({});
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

  useEffect(() => {
    if (!message.img || !downloadBtn?.current) return;

    const imageRef = ref(storage, message.img);
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = (event) => {
      const blob = xhr.response;
      const URL = window.URL.createObjectURL(blob);
      if (downloadBtn.current) {
        downloadBtn.current.href = URL;
        downloadBtn.current.download = imageRef.name;
      }
    };
    xhr.open("GET", message.img);
    xhr.send();
  }, []);

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
      {needHeader && <DateComponent date={message?.date} />}
      <div
        id={message.id}
        className={` max-w-[80%] md:max-w-[70%] w-auto border rounded-md p-[6px_7px_6px_9px] flex flex-col text-sm text-[#010101] min-w-[9rem] ${
          isSender
            ? "bg-[#D7F8F4] mr-1 ml-auto rounded-tr-none message-sender-arrow-right "
            : "bg-white mr-auto ml-1 rounded-tl-none message-arrow-left "
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
            <div className="flex items-center  ">
              <button onClick={handleReply}>
                <GoReply size={11} className="text-gray-600" />
              </button>
              <div className="text-[10px] ml-2 ">{createdAt}</div>
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
        <div className={`${message.isMarkdown ? "ml-auto" : ""}`}>
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
                <div className="relative  overflow-hidden  group  ">
                  {/* check if file type is of image */}
                  {file?.type?.startsWith("image") ? (
                    <div className="relative w-[16rem] h-[12rem] md:w-80">
                      <Image
                        layout="fill"
                        src={message.img}
                        alt="message"
                        className="rounded-md "
                        objectFit="cover"
                        sizes="100vw"
                      />
                    </div>
                  ) : file?.type?.startsWith("video") ? (
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
                    <div className="flex flex-row items-center gap-2  rounded-md px-1 py-2 max-w-[12rem]">
                      <div className="group bg-green-500 hover:text-white rounded-full p-3 border text-white  ">
                        <BsFileEarmarkFill size={20} className=" " />
                      </div>
                      <div className="flex flex-col flex-1 overflow-hidden ">
                        <p
                          title={file?.name}
                          className="text-sm text-gray-600 truncate"
                        >
                          {file?.name}
                        </p>
                        <p className="text-xs text-gray-500  ">
                          {getReadableFileSizeString(file?.size)}
                        </p>
                      </div>
                    </div>
                  )}
                  <a
                    id="download"
                    ref={downloadBtn}
                    className="absolute bottom-1 right-1 invisible group-hover:visible duration-150 p-1 rounded-full bg-gray-100 "
                    title={`Download ${file?.name}`}
                  >
                    <HiDownload className="text-gray-500  " size={16} />
                  </a>
                </div>
              )}

              {message.text && (
                <p className="text-sm whitespace-pre-wrap self-end cl">
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
      </div>
    </>
  );
};

export default Message;

const DateComponent = ({ date }) => {
  return (
    <div className="flex items-center justify-center  my-3">
      <div className="flex items-center justify-center shadow-sm py-4 px-6 h-8 bg-gray-100 rounded-full text-gray-500">
        {date}
      </div>
    </div>
  );
};
