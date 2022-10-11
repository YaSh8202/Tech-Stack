import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { UserContext } from "../lib/userContext";

const Navbar = () => {
  const { user, username } = useContext(UserContext);

  return (
    <nav className=" h-16 w-full bg-white text-gray-800 fixed top-0 px-[10vw] font-bold border-b-gray-300 z-[30]">
      <ul className="flex items-center justify-between h-full" >
        <li>
          <Link href="/">
            <button className="btn-logo">MINI PROJECT</button>
          </Link>
        </li>

        {/* user if signed-in and has username */}
        {user && (
          <>
            {/* <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Join Group</button>
              </Link>
            </li> */}
            <li>
              <Link href={`/${username}`}>
                <Image className="rounded-full cursor-pointer " layout="intrinsic" width={50} height={50}  alt="user" src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!user && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
