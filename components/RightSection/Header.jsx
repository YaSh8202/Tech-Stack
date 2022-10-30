import React, { useContext } from "react";
import { GroupContext } from "../../lib/groupContext";
import { GroupImage } from "../Group";
import { BsSearch } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { IoArrowBackOutline } from "react-icons/io5";

const Header = () => {
  const { selectedGroup, setSelectedGroup, setShowSearchBar } =
    useContext(GroupContext);
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
      <div className="flex flex-row items-center mr-2 gap-5  ">
        <button
          onClick={() => {
            setShowSearchBar((prev) => !prev);
          }}
          className=" checked:bg-gray-50 rounded-full p-2.5 hover:bg-gray-100 duration-200 "
        >
          <BsSearch className="text-gray-600  " size={18} />
        </button>
        <FiChevronDown className="text-gray-600" size={20} />
      </div>
    </div>
  );
};

export default Header;
