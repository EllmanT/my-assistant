"use server";

import { Message } from "@/components/Chat";
import { adminDb } from "@/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";

// number of docs the user is allowed to have
const PRO_LIMIT = 1000;
const FREE_LIMIT = 200;

export async function askQuestion(id: string, question: string) {
  auth.protect();
  const { userId } = await auth();

  const chatRef = adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .collection("chat");

  // check how many user message are in the chat

  const chatSnapshot = await chatRef.get();
  const userMessages = chatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"
  );

  // check membership limits for messages in a document
  const userRef = await adminDb.collection("users").doc(userId!).get();

  // limit the PRO/FREE user

  if (!userRef.data()?.hasActiveMembership) {
    if (userMessages.length >= FREE_LIMIT) {
      return {
        success: false,
        message: `Upgrade to the PRO plan to ask more than ${FREE_LIMIT} questions`,
      };
    }
  }
  //  check if user on pro plan has asked more than 100 questions
  if (userRef.data()?.hasActiveMembership) {
    if (userMessages.length >= PRO_LIMIT) {
      return {
        success: false,
        message: `You reached the PRO limit of ${PRO_LIMIT} questions per document!`,
      };
    }
  }
  const userMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };
  await chatRef.add(userMessage);

  const reply = await generateLangchainCompletion(id, question);

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };
  await chatRef.add(aiMessage);
  return { success: true, message: reply };
}
