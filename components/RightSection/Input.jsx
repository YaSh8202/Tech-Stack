import EmojiPicker from "emoji-picker-react";
import React, { useContext, useState } from "react";
import { BsEmojiLaughing, BsMarkdown } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { v4 as uuid } from "uuid";
import { auth, firestore, storage } from "../../lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { GroupContext } from "../../lib/groupContext";

const Input = () => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const { selectedGroup } = useContext(GroupContext);

  const emojiClickHandler = (emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (message.trim() === "" && !file) return;

    const messageId = uuid();
    const storageRef = ref(storage, messageId);
    const messagesRef = doc(
      collection(
        doc(collection(firestore, "Groups"), selectedGroup?.id),
        "messages"
      ),
      messageId
    );
    if (file) {
      uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          await setDoc(messagesRef, {
            id: messageId,
            text: message,
            createdAt: serverTimestamp(),
            senderId: auth.currentUser.uid,
            img: downloadURL,
            isMarkdown: false,
          });
        });
      });
    } else {
      await setDoc(messagesRef, {
        id: messageId,
        text: message,
        createdAt: serverTimestamp(),
        senderId: auth.currentUser.uid,
        isMarkdown: false,
      });
    }

    if (message.trim() !== "") {
      await updateDoc(doc(firestore, "Groups", selectedGroup?.id), {
        lastMessage: {
          text: message,
        },
        updatedAt: serverTimestamp(),
      });
    }
    setMessage("");
    setFile(null);
  };

  return (
    <div className="relative flex flex-row h-20 py-2 items-center justify-around w-full px-5 gap-4 bg-[#F6F6F6] ">
      <button onClick={() => setShowEmojis((prev) => !prev)}>
        {showEmojis ? (
          <AiOutlineCloseCircle size={24} />
        ) : (
          <BsEmojiLaughing size={24} />
        )}
      </button>

      <label className="cursor-pointer">
        <PlusIcon size={24} />
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          className="hidden"
          type="file"
          name="file"
        />
      </label>
      <button>
        <BsMarkdown size={24} />
      </button>
      <form className="flex-1" onSubmit={submitHandler}>
        <input
          id="message"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Say Something..."
          className="h-12 w-full bg-white rounded-full  border outline-none mx-2 px-5 py-1"
        />
        {showEmojis && (
          <div className="absolute left-2 bottom-16 ">
            <EmojiPicker onEmojiClick={emojiClickHandler} />
          </div>
        )}
        <button type="submit" className="hidden" />
      </form>
    </div>
  );
};

export default Input;
const PlusIcon = (props) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 8.327v7.326M15.667 11.99H8.333"
      stroke="#128C7E"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      clipRule="evenodd"
      d="M16.686 2H7.314C4.048 2 2 4.312 2 7.585v8.83C2 19.688 4.038 22 7.314 22h9.372C19.962 22 22 19.688 22 16.415v-8.83C22 4.312 19.962 2 16.686 2Z"
      stroke="#130F26"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
