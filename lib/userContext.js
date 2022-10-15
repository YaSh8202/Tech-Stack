import { createContext } from "react";
import { useUserData } from "./hooks/useUserData";

export const UserContext = createContext({
  user: null,
  username: null,
});

export const UserContextProvider = ({ children }) => {
  const userData = useUserData();
  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
};
