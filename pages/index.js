import Head from "next/head";
import LoginModal from "../components/Modals/LoginModal";
import Sidebar from "../components/Sidebar";
import RightSection from "../components/RightSection/RightSection";
import SearchSideBar from "../components/SearchSideBar/SearchSideBar";
import { useContext } from "react";
import { GroupContext } from "../lib/groupContext";

export default function Home({}) {
  const { showSearchBar } = useContext(GroupContext);
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-row   ">
      <Head>
        <title>Tech Stack</title>
      </Head>
      <Sidebar />
      <RightSection />
      {showSearchBar && <SearchSideBar />}
      <LoginModal />
    </div>
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
