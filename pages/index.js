import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import { firestore, postToJSON } from "../lib/firebase";
import { GroupConext } from "../lib/groupContext";

export default function Home({ groups }) {
  return (
    <GroupConext.Provider value={{ groups }}>
      <div className="h-screen w-screen overflow-hidden flex flex-row ">
        <Sidebar />
        <div className="flex flex-col w-full flex-1"></div>
      </div>
    </GroupConext.Provider>
  );
}

export async function getServerSideProps(context) {
  const groupsQuery = query(
    collection(firestore, "Groups"),
    orderBy("updatedAt", "desc")
  );
  const groupsSnap = await getDocs(groupsQuery);
  const groups = groupsSnap.docs.map(postToJSON);

  return {
    props: {
      groups,
    },
  };
}
