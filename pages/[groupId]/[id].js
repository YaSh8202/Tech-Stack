import {
  getDoc,
  doc,
  collection,
  query,
  getDocs,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import React, { useContext, useEffect } from "react";
import RightSection from "../../components/RightSection/RightSection";
import SearchSideBar from "../../components/SearchSideBar/SearchSideBar";
import { firestore, postToJSON } from "../../lib/firebase";
import { GroupContext } from "../../lib/groupContext";

function QuestionPage({ questionMessage, answers, group }) {
  const { showSearchBar, setMessages, setSelectedGroup, setSelectedMessage } =
    useContext(GroupContext);

  useEffect(() => {
    setSelectedGroup({ ...group, answerPage: true });
    setMessages([questionMessage, ...answers]);
    setSelectedMessage(questionMessage);
  }, []);

  useEffect(() => {
    const answersRef = query(
      collection(doc(collection(firestore, "Groups"), group.id), "messages"),
      where("repliedTo", "==", questionMessage.id),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(answersRef, (snapshot) => {
      setMessages((prev) => [
        questionMessage,
        ...snapshot.docs.map(postToJSON),
      ]);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <RightSection />
      {showSearchBar && <SearchSideBar />}
    </>
  );
}

export default QuestionPage;

export async function getServerSideProps(context) {
  const { groupId, id } = context.query;

  const groupQuery = doc(firestore, "Groups", groupId);

  const groupDoc = await getDoc(groupQuery);

  if (!groupDoc.exists()) {
    return {
      notFound: true,
    };
  }

  const group = postToJSON(groupDoc);

  const questionRef = doc(
    collection(doc(collection(firestore, "Groups"), groupId), "messages"),
    id
  );

  const questionMessage = await getDoc(questionRef);
  if (!questionMessage.exists()) {
    return {
      notFound: true,
    };
  }

  const answersRef = query(
    collection(doc(collection(firestore, "Groups"), groupId), "messages"),
    where("repliedTo", "==", id),
    orderBy("createdAt")
  );

  const answersSnapshot = await getDocs(answersRef);
  const answers = [];
  answersSnapshot.forEach((doc) => {
    answers.push(postToJSON(doc));
  });

  return {
    props: { id, questionMessage: postToJSON(questionMessage), answers, group },
  };
}
