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
    <div className="w-full flex flex-row justify-between py-4 px-6 bg-[#F7F7FC] h-[70px]  ">
      <div className="flex flex-1 flex-row items-center">
        <button
          onClick={() => setSelectedGroup(null)}
          className="block md:hidden"
        >
          <IoArrowBackOutline className=" mr-2 w-5 h-5 text-gray-700 " />
        </button>
        <div className="h-full aspect-square ">
          <GroupImage size={50} image={selectedGroup?.image} />
        </div>
        <h2 className="ml-4 text-base md:text-lg text-gray-700 font-semibold truncate ">
          {selectedGroup?.name}
        </h2>
      </div>
      <div className="flex flex-row items-center mr-2 gap-5 relative  ">
        <button
          onClick={() => {
            setShowSearchBar((prev) => !prev);
          }}
          className=" checked:bg-gray-50 rounded-full p-2.5 hover:bg-gray-100 duration-200 "
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
                    "block px-4 py-2 text-sm  w-full"
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
