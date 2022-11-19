import Head from "next/head";
import RightSection from "../components/RightSection/RightSection";
import SearchSideBar from "../components/SearchSideBar/SearchSideBar";
import { useContext } from "react";
import { GroupContext } from "../lib/groupContext";

export default function Home({}) {
  const { showSearchBar } = useContext(GroupContext);
  return (
    <>
      <RightSection />
      {showSearchBar && <SearchSideBar />}
    </>
  );
}

// export async function getStaticProps() {
//   const groupsQuery = query(
//     collection(firestore, "Groups"),
//     orderBy("updatedAt", "desc")
//   );

//   const querySnapshot = await getDocs(groupsQuery);
//   const groups = [];
//   querySnapshot?.forEach((doc) => {
//     groups.push(postToJSON(doc));
//   });

//   // console.log(groups);
//   return {
//     props: {
//       groups,
//     },
//     // revalidate: 1000,
//   };
// }
