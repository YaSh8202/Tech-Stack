import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
// import { auth } from "../lib/firebase";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-row ">
      <Sidebar />
      <div className="flex flex-col w-full flex-1"></div>
    </div>
  );
}
