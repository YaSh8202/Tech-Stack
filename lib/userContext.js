import { createContext, useEffect, useState } from "react";
import { useUserData } from "./hooks/useUserData";

export const UserContext = createContext({
  user: null,
  username: null,
  userModal: false,
  setUserModal: () => {},
  profileModal: false,
  about: "",
});

export const UserContextProvider = ({ children }) => {
  const [userModal, setUserModal] = useState(false);
  const { user, username, about, loading } = useUserData();

  useEffect(() => {
    if (!loading && (!user || !username)) {
      setUserModal(true);
    } else {
      setUserModal(false);
    }
  }, [user, username, loading]);

  return (
    <UserContext.Provider
      value={{ user, username, about, userModal, loading, setUserModal }}
    >
      {children}
    </UserContext.Provider>
  );
};
