import React, { useContext, useState } from "react";
import { GroupContext } from "../../lib/groupContext";
import { GroupImage } from "../Group";
import { BsSearch } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import DropDownMenu from "./Menu";
import { Menu } from "@headlessui/react";
import { arrayRemove, collection, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../lib/firebase";
import { UserContext } from "../../lib/userContext";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const Header = () => {
  const { selectedGroup, setSelectedGroup, setShowSearchBar } =
    useContext(GroupContext);
  const { user, joinedGroups } = useContext(UserContext);

  return (
    <div className="flex h-[70px] w-full flex-row justify-between bg-[#F7F7FC] py-4 px-6  ">
      <div className="flex flex-1 flex-row items-center">
        <button
          onClick={() => setSelectedGroup(null)}
          className="block md:hidden"
        >
          <IoArrowBackOutline className=" mr-2 h-5 w-5 text-gray-700 " />
        </button>
        <div className="aspect-square h-full ">
          <GroupImage size={50} image={selectedGroup?.image} />
        </div>
        <h2 className="ml-4 truncate text-base font-semibold text-gray-700 md:text-lg ">
          {selectedGroup?.name}
        </h2>
      </div>
      <div className="relative mr-2 flex flex-row items-center gap-5  ">
        <button
          onClick={() => {
            setShowSearchBar((prev) => !prev);
          }}
          className=" rounded-full p-2.5 duration-200 checked:bg-gray-50 hover:bg-gray-100 "
        >
          <BsSearch className="text-gray-600  " size={18} />
        </button>

        {user && joinedGroups.includes(selectedGroup.id) && (
          <DropDownMenu>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={async () => {
                    const userRef = doc(
                      collection(firestore, "users"),
                      user.uid
                    );
                    await updateDoc(userRef, {
                      joinedGroups: arrayRemove(selectedGroup.id),
                    });
                  }}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block w-full px-4 py-2  text-sm"
                  )}
                >
                  Exit Group
                </button>
              )}
            </Menu.Item>
          </DropDownMenu>
        )}
      </div>
    </div>
  );
};

export default Header;
