import { createContext, useState } from "react";
import { useUserData } from "./hooks/useUserData";

export const UserContext = createContext({
  user: null,
  username: null,
  userModal: false,
  setUserModal: () => {},
  profileModal: false,
});

export const UserContextProvider = ({ children }) => {
  const userData = useUserData();
  const [userModal, setUserModal] = useState(false);
  return (
    <UserContext.Provider value={{ ...userData, userModal, setUserModal }}>
      {children}
    </UserContext.Provider>
  );
};
