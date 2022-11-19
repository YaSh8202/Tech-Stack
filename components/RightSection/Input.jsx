import EmojiPicker from "emoji-picker-react";
import React, { useContext, useRef, useState } from "react";
import { BsEmojiLaughing, BsMarkdown } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { v4 as uuid } from "uuid";
import { auth, firestore, storage } from "../../lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { GroupContext } from "../../lib/groupContext";
import { UserContext } from "../../lib/userContext";
import { getPicture, getResponse } from "../../lib/openai";
import MarkdownModal from "../Modals/MarkdownModal";
import { toast } from "react-hot-toast";
import SearchMessage from "../SearchSideBar/SearchMessage";

const Input = () => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const { selectedGroup, setMessages, selectedMessage, setSelectedMessage } =
    useContext(GroupContext);
  const { user, username, setUserModal, joinedGroups } =
    useContext(UserContext);
  const inputRef = useRef(null);
  const showInput = !joinedGroups || joinedGroups.includes(selectedGroup?.id);
  const [imageMode, setImageMode] = useState(false);

  const emojiClickHandler = (emojiObject) => {
    setMessage(message + emojiObject.emoji);
    inputRef.current.focus();
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage("");
    if ((message.trim() === "" && !file) || !selectedGroup) return;

    if (selectedGroup.id === "open-ai") {
      const newMessages = [
        {
          id: Math.random(),
          text: message,
          sender: {
            id: user.uid,
          },
          date: new Date()?.toDateString([], {
            day: "numeric",
            month: "short",
          }),
        },
      ];
      setMessages((prev) => [...prev, ...newMessages]);

      const toastId = toast.loading("Thinking...");

      const response = imageMode
        ? await getPicture(message)
        : await getResponse(message);

      let url;
      if (imageMode) {
        try {
          const imgResult = await fetch("/api/aiimage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: response, name: message }),
          });
          const img = await imgResult.json();
          url = img?.downloadURL;
        } catch (e) {
          console.log(e);
        }
      }

      newMessages.push({
        id: Math.random(),
        text: imageMode ? "" : response,
        sender: {
          id: "open-ai",
        },
        date: new Date()?.toDateString([], {
          day: "numeric",
          month: "short",
        }),
        img: imageMode ? url : "",
        fileMeta: imageMode
          ? { type: "image", name: message, width: 256, height: 256 }
          : null,
      });
      setMessages((prev) => [...prev, newMessages[1]]);
      toast.success("Done!", { id: toastId });

      const prevMessages = JSON.parse(localStorage.getItem("openAI")) || [];
      localStorage.setItem(
        "openAI",
        JSON.stringify([...prevMessages, ...newMessages])
      );
      return;
    }

    const toastId = toast.loading("Sending message...");
    const messageId = uuid();
    const messagesRef = doc(
      collection(
        doc(collection(firestore, "Groups"), selectedGroup.id),
        "messages"
      ),
      messageId
    );

    try {
      if (file) {
        const storageRef = ref(storage, `images/${file.name}`);
        let width = 0,
          height = 0;
        if (file.type.includes("image")) {
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          img.onload = function () {
            width = this.width;
            height = this.height;
          };
          img.src = _URL.createObjectURL(file);
        }

        uploadBytesResumable(storageRef, file).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            await setDoc(messagesRef, {
              id: messageId,
              text: message,
              createdAt: serverTimestamp(),
              sender: {
                id: auth.currentUser.uid,
                username,
                photoURL: user.photoURL,
                displayName: user.displayName,
              },
              img: downloadURL,
              isMarkdown: false,
              repliedTo: selectedMessage ? selectedMessage.id : "",
              fileMeta: {
                name: file.name,
                size: file.size,
                type: file.type,
                width,
                height,
              },
            });
          });
        });
      } else {
        const msg = {
          id: messageId,
          text: message,
          createdAt: serverTimestamp(),
          isMarkdown: false,
          repliedTo: selectedMessage ? selectedMessage.id : "",
          sender: {
            id: auth.currentUser.uid,
            username,
            photoURL: user.photoURL,
            displayName: user.displayName,
          },
        };
        setMessages((prev) => [...prev, msg]);
        await setDoc(messagesRef, msg);
      }

      await updateDoc(doc(firestore, "Groups", selectedGroup.id), {
        lastMessage: {
          text: message.trim() === "" ? file.type.split("/")[0] : message,
        },
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
      toast.error("Error Sending Message", {
        id: toastId,
      });
    }

    toast.success("Message sent!", { id: toastId });
    setSelectedMessage(null);

    setFile(null);
  };

  const addGroupHandler = async () => {
    const userRef = doc(collection(firestore, "users"), user.uid);
    await updateDoc(userRef, {
      joinedGroups: arrayUnion(selectedGroup.id),
    });
    toast.success("Group Joined");
  };

  if (!showInput && user) {
    return (
      <button
        onClick={addGroupHandler}
        className="flex h-[3rem] w-full cursor-pointer items-center justify-center bg-[#D7F8F4] duration-150 hover:brightness-105 "
      >
        <h5>Join</h5>
      </button>
    );
  }

  return (
    <div className="flex  w-full flex-col items-start">
      {selectedMessage && (
        <div className="flex w-full  bg-gray-200 px-4 py-2  ">
          <div className="   ml-auto  max-h-[6rem] overflow-y-auto overflow-x-hidden ">
            <SearchMessage inputType={true} message={selectedMessage} />
          </div>
          <button className="ml-3" onClick={() => setSelectedMessage(null)}>
            <AiOutlineCloseCircle size={20} />
          </button>
        </div>
      )}
      <div className=" flex h-20 w-full flex-row-reverse items-center justify-around gap-4 bg-[#F6F6F6] py-2 px-5 md:flex-row ">
        {selectedGroup?.id !== "open-ai" ? (
          <>
            <button
              disabled={!user || selectedGroup.id === "open-ai"}
              onClick={() => {
                setShowEmojis((prev) => !prev);
                inputRef.current.focus();
              }}
            >
              {showEmojis ? (
                <AiOutlineCloseCircle size={24} />
              ) : (
                <BsEmojiLaughing size={24} className="hover:text-green-600" />
              )}
            </button>

            <label className="cursor-pointer">
              <PlusIcon size={24} className="hover:text-green-600" />
              <input
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
                className="hidden"
                type="file"
                name="file"
                disabled={!user || selectedGroup.id === "open-ai"}
              />
            </label>
            <MarkdownModal disabled={!user || selectedGroup.id === "open-ai"}>
              <BsMarkdown className="hover:text-green-600" size={24} />
            </MarkdownModal>
          </>
        ) : (
          <MyToggle enabled={imageMode} setEnabled={setImageMode} />
        )}
        <form className="relative flex-1 " onSubmit={submitHandler}>
          <input
            ref={inputRef}
            id="message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={!user ? "Please Login..." : "Say Something..."}
            className="h-12 w-full rounded-full border  bg-white px-5 py-1 outline-none focus-within:border-[#128C7E] disabled:opacity-50 lg:mx-2 "
            disabled={!selectedGroup || !user || !username}
            onClick={() => {
              if (!username) {
                setUserModal(true);
              }
            }}
          />
          {showEmojis && (
            <div className="absolute left-0 bottom-16 md:left-[-8rem] ">
              <EmojiPicker
                autoFocusSearch={false}
                onEmojiClick={emojiClickHandler}
              />
            </div>
          )}
          <button type="submit" className="hidden" />
        </form>
      </div>
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
    className="group"
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
      className="group-hover:stroke-green-600"
    />
  </svg>
);

import { Switch } from "@headlessui/react";
function MyToggle({ enabled, setEnabled }) {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? "bg-blue-600" : "bg-gray-200"
      } relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
}
