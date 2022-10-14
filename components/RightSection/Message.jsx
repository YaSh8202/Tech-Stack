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
    const getSender = async () => {
      const senderRef = doc(collection(firestore, "users"), message.senderId);
      const senderDoc = await getDoc(senderRef);
      setSender(senderDoc.data());
    };
    getSender();
  }, []);

  return (
    <div
      key={message.id}
      className={`flex flex-col gap-2   ${
        isSender ? "ml-auto bg-[#D7F8F4] " : "mr-auto bg-white "
      } my-2 px-4 py-2 rounded-md `}
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
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
      {message.img && (
        <img src={message.img} alt="message" className="w-64 h-64 rounded-md" />
      )}
    </div>
  );
};

export default Message;
