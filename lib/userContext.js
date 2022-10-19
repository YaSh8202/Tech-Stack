import { createContext, useEffect, useState } from "react";
import { useUserData } from "./hooks/useUserData";

export const UserContext = createContext({
  user: null,
  username: null,
  userModal: false,
  setUserModal: () => {},
  profileModal: false,
});

export const UserContextProvider = ({ children }) => {
  const [userModal, setUserModal] = useState(false);
  const userData = useUserData(setUserModal);

  // useEffect(() => {
  //   if (!userData.user || !userData.username) {
  //     setUserModal(true);
  //   } else {
  //     setUserModal(false);
  //   }
  // }, [userData]);

  return (
    <UserContext.Provider value={{ ...userData, userModal, setUserModal }}>
      {children}
    </UserContext.Provider>
  );
};
