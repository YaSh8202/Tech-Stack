/* eslint-disable @next/next/no-img-element */
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { UserContext } from "../lib/userContext";
import { useCallback, useContext, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Enter({}) {
  const { user, username } = useContext(UserContext);

  //1. user signed out <SignInButton />
  //2. user signed in, but missing username <SignInButton />
  //1. user signed in, has username <SignInButton />

  return (
    <main className=" w-[33vw] flex flex-col mx-auto my-[10vh] max-w-4xl">
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

//Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    // eslint-disable-next-line react/jsx-no-comment-textnodes
    <button
      className="bg-gray-300 text-gray-900 py-4 px-8 flex items-center justify-center font-bold cursor-pointer  "
      onClick={signInWithGoogle}
    >
      <img className="w-7 mr-2.5" src="/google.png" alt="" /> Sign in with
      Google
    </button>
  );
}

function SignOutButton() {
  return (
    <button
      className="bg-gray-300 text-gray-900 py-4 px-8 flex items-center justify-center font-bold cursor-pointer"
      onClick={() => {
        signOut(auth);
      }}
    >
      Sign Out
    </button>
  );
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, username } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    // force form  value typed in form to match correct format
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // only set form value if length is <3 or it passes regex

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }
    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  // hit the database for username match after each debounced change
  //  useCallback is required for debounce to work

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(collection(firestore, "usernames"), username);
        const docSnap = await getDoc(ref);
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // create refs for both documents
      const userDoc = doc(collection(firestore, "users"), user.uid);
      const usernameDoc = doc(collection(firestore, "usernames"), formValue);

      // commit both docs together as a batch write
      const batch = writeBatch(firestore);
      batch.set(userDoc, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    !username && (
      <section>
        <h3 className="text-xl font-bold">Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            className="user-input"
            type="text"
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn btn-green" disabled={!isValid}>
            Choose
          </button>
          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking..,</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is avaiable!</p>;
  } else if (username && !isValid) {
    <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
