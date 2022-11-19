import React, { useContext } from "react";
import * as ReactDOM from "react-dom";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import { IoClose } from "react-icons/io5";
import { GroupContext } from "../../lib/groupContext";
import { AiOutlineSend } from "react-icons/ai";
import { v4 as uuid } from "uuid";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, firestore } from "../../lib/firebase";
import { toast } from "react-hot-toast";
import markdownItIns from "markdown-it-ins";
import { UserContext } from "../../lib/userContext";

function onImageUpload(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (data) => {
      resolve(data.target.result);
    };
    reader.readAsDataURL(file);
  });
}

const mdParser = new MarkdownIt(/* Markdown-it options */);
mdParser.use(markdownItIns);
const MarkdownModal = ({ children }) => {
  const [showModal, setShowModal] = React.useState(false);
  const { markdown, setMarkdown, selectedGroup, selectedMessage } =
    useContext(GroupContext);
  const { username, user } = useContext(UserContext);

  function handleEditorChange({ html, text }) {
    // console.log("handleEditorChange", text);
    setMarkdown(text);
  }
  async function handleSendMarkdown(event) {
    event.preventDefault();
    setShowModal(false);
    const toastId = toast.loading("Sending message...");
    try {
      const messageId = uuid();
      const messagesRef = doc(
        collection(
          doc(collection(firestore, "Groups"), selectedGroup?.id),
          "messages"
        ),
        messageId
      );
      await setDoc(messagesRef, {
        id: messageId,
        text: markdown,
        createdAt: serverTimestamp(),
        isMarkdown: true,
        sender: {
          id: user.uid,
          username: username,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        repliedTo: selectedMessage ? selectedMessage.id : "",
      });
      await updateDoc(doc(firestore, "Groups", selectedGroup?.id), {
        lastMessage: {
          text: "Markdown",
        },
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    }
    setMarkdown("");
    toast.success("Message Sent", {
      id: toastId,
    });
  }

  if (!showModal) {
    return (
      <button onClick={() => setShowModal(true)} className="bg-transparent">
        {children}
      </button>
    );
  }
  return (
    <div className="absolute inset-0">
      <div
        onClick={() => {
          setShowModal(false);
        }}
        className={`  fixed inset-0  z-10 h-full w-full overflow-y-auto bg-gray-800 bg-opacity-50`}
      ></div>
      <div className="absolute left-[50%] top-20 z-20 translate-x-[-50%] ">
        <button
          onClick={() => setShowModal(false)}
          className="absolute right-2 top-1 z-30 rounded-full bg-gray-200 "
        >
          <IoClose className="text-xl text-gray-800 " />
        </button>
        <button
          onClick={handleSendMarkdown}
          title="Send Message"
          className="group absolute right-9 bottom-9 z-30 flex md:right-14   md:top-[34.5px] "
        >
          <AiOutlineSend className="text-lg text-gray-800 group-hover:text-green-500 " />
        </button>
        <div className="relative w-[70vw] rounded-md border bg-white px-4 py-6 shadow-lg">
          <div>
            <MdEditor
              style={{ height: "500px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              canView={{
                menu: window.innerWidth > 850 ? true : false,
                md: true,
                html: true,
                fullScreen: false,
              }}
              view={{ html: window.innerWidth > 850 ? true : false }}
              syncScrollMode={["leftFollowRight", "rightFollowLeft"]}
              value={markdown}
              shortcuts={true}
              onImageUpload={onImageUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownModal;
