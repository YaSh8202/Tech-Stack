import Image from "next/image";
import React from "react";

const ProfileAvatar = ({
  profilePic = "https://icons8.com/icon/83190/user",
  size,
}) => {
  return (
    <Image
      src={profilePic}
      alt=""
      className="rounded-full cursor-pointer"
      layout="intrinsic"
      width={size}
      height={size}
    />
  );
};

export default ProfileAvatar;
