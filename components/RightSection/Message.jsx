import { collection, doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { firestore } from "../../lib/firebase";
import { UserContext } from "../../lib/userContext";

const Message = ({ message }) => {
  const [sender, setSender] = useState(null);
  const { username } = useContext(UserContext);
  const isSender = username === sender?.username;
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

  if (message.isMarkdown === true) return;

  return (
    <div
      key={message.id}
      className={`flex flex-col gap-2   ${
        isSender ? "ml-auto bg-[#D7F8F4] " : "mr-auto bg-white "
      } my-2 px-3 py-2 rounded-md `}
    >
      <div className="flex flex-row gap-2 items-center">
        {/* <Image
          src={sender?.photoURL}
          alt="sender"
          className="w-10 h-10 rounded-full"
          layout="intrinsic"
          width={40}
          height={40}
        /> */}
        <div className="flex flex-col">
          {!isSender && (
            <p className="text-sm font-semibold">{sender?.username}</p>
          )}
          <p className="text-sm whitespace-pre-wrap ">{message.text}</p>
          {/* {NewlineText({ text: message.text })} */}
        </div>
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
  );
};

export default Message;
