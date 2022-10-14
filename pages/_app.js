import { GroupContextProvider } from "../lib/groupContext";
import { useUserData } from "../lib/hooks/useUserData";
import { UserContext } from "../lib/userContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <GroupContextProvider>
        <Component {...pageProps} />
      </GroupContextProvider>
    </UserContext.Provider>
  );
}

export default MyApp;
