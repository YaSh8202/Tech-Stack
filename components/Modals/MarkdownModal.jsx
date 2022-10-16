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
import { collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../../lib/firebase";

const mdParser = new MarkdownIt(/* Markdown-it options */);
const MarkdownModal = ({ children }) => {
  const [showModal, setShowModal] = React.useState(false);
  const { markdown, setMarkdown, selectedGroup } = useContext(GroupContext);

  function handleEditorChange({ html, text }) {
    console.log("handleEditorChange", text);
    setMarkdown(text);
  }
  async function handleSendMarkdown(event) {
    event.preventDefault();
    setShowModal(false);
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
        senderId: auth.currentUser.uid,
        isMarkdown: true,
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
        className={` ${
          showModal ? "" : "hidden"
        } fixed z-10  inset-0 bg-gray-800 bg-opacity-50 overflow-y-auto h-full w-full`}
      ></div>
      <div className="absolute left-[50%] top-20 translate-x-[-50%] z-20 ">
        <button
          onClick={() => setShowModal(false)}
          className="absolute z-30 right-2 top-1 bg-gray-200 rounded-full "
        >
          <IoClose className="text-xl text-gray-800 " />
        </button>
        <button
          onClick={handleSendMarkdown}
          title="Send Message"
          className="absolute z-30 right-14 top-[34.5px] group "
        >
          <AiOutlineSend className="text-lg text-gray-800 group-hover:text-green-500 " />
        </button>
        <div className="relative px-4 py-6 border w-[70vw] shadow-lg rounded-md bg-white">
          <div>
            <MdEditor
              style={{ height: "500px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              canView={{ menu: true, md: true, html: true, fullScreen: false }}
              syncScrollMode={["leftFollowRight", "rightFollowLeft"]}
              value={markdown}
              shortcuts={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownModal;