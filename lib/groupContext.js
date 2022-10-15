import { collection, orderBy, query } from "firebase/firestore";
import { createContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore, postToJSON } from "./firebase";

export const GroupContext = createContext({
  groups: [],
  selectedGroup: null,
  setSelectedGroup: () => {},
  openAIMessages: [],
});

export const GroupContextProvider = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openAIMessages, setOpenAIMessages] = useState([]);

  const groupsQuery = query(
    collection(firestore, "Groups"),
    orderBy("updatedAt", "desc")
  );

  const [groupSnapshot] = useCollection(groupsQuery);
  const groups = groupSnapshot?.docs.map(postToJSON);

  return (
    <GroupContext.Provider
      value={{
        groups,
        selectedGroup,
        setSelectedGroup,
        openAIMessages,
        setOpenAIMessages,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
