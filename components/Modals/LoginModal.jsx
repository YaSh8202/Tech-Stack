import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CgStack } from "react-icons/cg";
import GoogleButton from "./GoogleButton";
import { IoClose } from "react-icons/io5";
import { UserContext } from "../../lib/userContext";
import debounce from "lodash.debounce";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { auth, firestore } from "../../lib/firebase";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { BsGithub } from "react-icons/bs";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { AiOutlineEdit } from "react-icons/ai";
import { TiTickOutline } from "react-icons/ti";

const LoginModal = () => {
  const { user, username, userModal, setUserModal, about } =
    useContext(UserContext);
  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        // console.log(user, result, token);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        // ...
        toast.error(errorMessage);
        console.log(errorCode, errorMessage, email, credential);
      });
  };

  if (!userModal) return null;

  return (
    <div className="absolute inset-0">
      <div
        onClick={() => {
          setUserModal(false);
        }}
        className={` fixed inset-0  z-10 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50`}
      ></div>
      <div className="absolute left-[50%] top-28 z-20 translate-x-[-50%]">
        {user && username ? (
          <ProfileComponent about={about} username={username} user={user} />
        ) : (
          <>
            <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
              <button
                onClick={() => setUserModal(false)}
                className="absolute right-8 top-8 rounded-full hover:bg-gray-50 "
              >
                <IoClose className="text-xl text-gray-700 " />
              </button>
              <div className="mt-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  {/* TEch Stack Icon */}
                  <CgStack />
                </div>
                <h3 className="mt-2 text-xl font-bold leading-6  text-blue-600">
                  Tech Stack
                </h3>
                <div className="my-3 items-center px-4 py-3">
                  {user ? (
                    username ? (
                      <>show profile</>
                    ) : (
                      <UsernameForm />
                    )
                  ) : (
                    <>
                      <GoogleButton
                        closeModal={() => {
                          setUserModal(false);
                        }}
                      />
                      <GithubOAuthButton onClick={signInWithGithub}>
                        Login with Github
                      </GithubOAuthButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        about: "",
        joinedGroups: ["open-ai"],
      });
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    !username && (
      <section>
        <h3 className="text-xl font-bold">Choose Username</h3>
        <form className="mt-2" onSubmit={onSubmit}>
          <div className="mb-2 flex items-center">
            <input
              className="user-input focus:border-b  "
              type="text"
              name="username"
              placeholder="username"
              value={formValue}
              onChange={onChange}
            />
            <button
              type="submit"
              className=" rounded bg-green-400 p-2 text-white   "
              disabled={!isValid}
            >
              Choose
            </button>
          </div>
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />

          {/* <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div> */}
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
  } else if (username.length <= 3 && username.length > 0) {
    return <p className="text-error">Username must be at least 4 characters</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">This username is already taken!</p>;
  } else {
    return <p></p>;
  }
}

export default LoginModal;

const GithubOAuthButton = ({ onClick }) => (
  <button
    className="mt-3 flex h-12 w-full flex-row items-center justify-center gap-3 bg-[#333333] duration-150 hover:opacity-90 "
    onClick={onClick}
  >
    <BsGithub className="h-8 w-8 text-white" />
    <p className="text-lg font-medium text-white">Signin with Github</p>
  </button>
);
function auto_grow(element) {
  element.style.height = "16px";
  element.style.height = element.scrollHeight + "px";
}

export const ProfileComponent = ({
  user,
  username,
  about = "Front end Developer, avid reader. Love to take a long walk, swim",
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newAbout, setNewAbout] = useState(about);
  const aboutRef = useRef(null);

  const submitEdit = useCallback(() => {
    const ref = doc(collection(firestore, "users"), user.uid);
    updateDoc(ref, {
      about: newAbout,
    });
  }, [newAbout, user]);

  return (
    <>
      <div className="card relative mx-auto w-96 rounded   bg-white p-5 py-8  shadow-2xl hover:shadow">
        <div className="mx-auto -mt-20 w-32 rounded-full border-8 border-white">
          <Image
            className="rounded-full"
            src={user.photoURL}
            alt=""
            layout="responsive"
            width={200}
            height={200}
          />
        </div>
        <div className="mt-2 text-center text-3xl font-medium">
          {user?.displayName}
        </div>
        <div className="mt-2 text-center text-sm font-light">@{username}</div>
        <div className="mt-3 flex text-sm font-light ">
          <textarea
            onInput={(e) => auto_grow(aboutRef.current)}
            onChange={(e) => {
              setNewAbout(e.target.value);
            }}
            readOnly={!isEdit}
            className={`${
              isEdit ? "block border-b " : ""
            } about min-h-[21px]  w-full resize-none overflow-hidden outline-none   `}
            value={newAbout}
            ref={aboutRef}
            placeholder="About you"
          />

          <button
            onClick={() => {
              const end = aboutRef.current.value.length;
              aboutRef.current.setSelectionRange(end, end);
              aboutRef.current.focus();

              if (isEdit) submitEdit();

              setIsEdit((prev) => !prev);
            }}
            className=" self-end "
          >
            {isEdit ? (
              <TiTickOutline color="green" size={16} />
            ) : (
              <AiOutlineEdit size={16} />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
