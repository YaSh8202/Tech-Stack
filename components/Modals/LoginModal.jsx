import React, { useCallback, useContext, useEffect, useState } from "react";
import { CgStack } from "react-icons/cg";
import GoogleButton from "./GoogleButton";
import { IoClose } from "react-icons/io5";
import { UserContext } from "../../lib/userContext";
import debounce from "lodash.debounce";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { auth, firestore } from "../../lib/firebase";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { BsGithub } from "react-icons/bs";

const LoginModal = () => {
  const { user, username, userModal, setUserModal } = useContext(UserContext);
  console.log(user);
  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        console.log(user, result, token);
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
        className={` ${
          userModal ? "" : "hidden"
        } fixed z-10  inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full`}
      ></div>
      <div className="absolute left-[50%] top-20 translate-x-[-50%] z-20">
        {user ? (
          <ProfileComponent username={username} user={user} />
        ) : (
          <>
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <button
                onClick={() => setUserModal(false)}
                className="absolute right-8 top-8 hover:bg-gray-50 rounded-full "
              >
                <IoClose className="text-xl text-gray-700 " />
              </button>
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  {/* TEch Stack Icon */}
                  <CgStack />
                </div>
                <h3 className="font-bold text-xl leading-6 mt-2  text-blue-600">
                  Tech Stack
                </h3>
                <div className="items-center my-3 px-4 py-3">
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
          <div className="flex items-center mb-2">
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
              className=" btn-green p-2 text-white rounded   "
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
    className="bg-[#333333] w-full hover:opacity-90 duration-150 items-center flex flex-row justify-center gap-3 h-12 mt-3 "
    onClick={onClick}
  >
    <BsGithub className="w-8 h-8 text-white" />
    <p className="text-white text-lg font-medium">Signin with Github</p>
  </button>
);

export const ProfileComponent = ({ user, username }) => {
  return (
    <>
      {/* <div className="bg-gray-200 font-sans h-screen w-full flex flex-row justify-center items-center"> */}
      <div className="card relative top-32 p-5 py-8   w-96 mx-auto bg-white  shadow-xl hover:shadow">
        <img
          className="w-32 mx-auto rounded-full -mt-20 border-8 border-white"
          src={user.photoURL}
          alt=""
        />
        <div className="text-center mt-2 text-3xl font-medium">
          {user?.displayName}
        </div>
        <div className="text-center mt-2 font-light text-sm">@{username}</div>
        {/* <div className="text-center font-normal text-lg">Kerala</div> */}
        <div className="px-6 text-center mt-2 font-light text-sm">
          <p>
            Front end Developer, avid reader. Love to take a long walk, swim
          </p>
        </div>
        {/* <hr className="mt-8" /> */}
        {/* <div className="flex p-4">
          <div className="w-1/2 text-center">
            <span className="font-bold">1.8 k</span> Followers
          </div>
          <div className="w-0 border border-gray-300"></div>
          <div className="w-1/2 text-center">
            <span className="font-bold">2.0 k</span> Following
          </div>
        </div> */}
      </div>
      {/* </div> */}
    </>
  );
};
