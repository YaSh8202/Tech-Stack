import Head from "next/head";
import RightSection from "../../components/RightSection/RightSection";
import SearchSideBar from "../../components/SearchSideBar/SearchSideBar";
import { useContext, useEffect } from "react";
import { GroupContext } from "../../lib/groupContext";
import { firestore, postToJSON } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function GroupPage({ group }) {
  const { showSearchBar, setSelectedGroup } = useContext(GroupContext);

  useEffect(() => {
    setSelectedGroup(group);
  }, [group]);

  return (
    <>
      <Head>
        <title>Tech Stack</title>
      </Head>
      <RightSection />
      {showSearchBar && <SearchSideBar />}
    </>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { groupId } = params;

  const groupQuery = doc(firestore, "Groups", groupId);

  const groupDoc = await getDoc(groupQuery);

  if (!groupDoc.exists()) {
    return {
      notFound: true,
    };
  }

  const group = postToJSON(groupDoc);
  return {
    props: {
      group,
    },
  };
}
