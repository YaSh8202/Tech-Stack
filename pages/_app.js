import Head from "next/head";
import { Toaster } from "react-hot-toast";
import LoginModal from "../components/Modals/LoginModal";
import RightSection from "../components/RightSection/RightSection";
import SearchSideBar from "../components/SearchSideBar/SearchSideBar";
import Sidebar from "../components/Sidebar";
import { GroupContextProvider } from "../lib/groupContext";
import { UserContextProvider } from "../lib/userContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <GroupContextProvider>
        <Head>
          <title>Tech Stack</title>
        </Head>
        <div className="flex h-screen w-screen flex-row overflow-hidden   ">
          <Sidebar />
          <Component {...pageProps} />
          <LoginModal />
        </div>
        <Toaster />
      </GroupContextProvider>
    </UserContextProvider>
  );
}

export default MyApp;
