import { GroupContextProvider } from "../lib/groupContext";
import { UserContextProvider } from "../lib/userContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <GroupContextProvider>
        <Component {...pageProps} />
      </GroupContextProvider>
    </UserContextProvider>
  );
}

export default MyApp;
