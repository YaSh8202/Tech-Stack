import dynamic from "next/dynamic";
import Head from "next/head";
import LoginModal from "../components/Modals/LoginModal";
import Sidebar from "../components/Sidebar";
import RightSection from "../components/RightSection/RightSection";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore, postToJSON } from "../lib/firebase";
import { GroupContext } from "../lib/groupContext";
import { useContext, useEffect } from "react";

export default function Home({ groups }) {
  const { setGroups } = useContext(GroupContext);

  useEffect(() => {
    setGroups(groups);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-row min-w-full  ">
      <Head>
        <title>Tech Stack</title>
      </Head>
      <Sidebar />
      <RightSection />
      <LoginModal />
    </div>
  );
}

export async function getStaticProps() {
  const groupsQuery = query(
    collection(firestore, "Groups"),
    orderBy("updatedAt", "desc")
  );

  const querySnapshot = await getDocs(groupsQuery);
  const groups = [];
  querySnapshot?.forEach((doc) => {
    groups.push(postToJSON(doc));
  });

  // console.log(groups);
  return {
    props: {
      groups,
    },
    // revalidate: 1000,
  };
}
