import Chat from "@/components/Chat";
import PdfView from "@/components/PdfView";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import React from "react";

interface ChatProps {
  params: Promise<{
    id: string;
  }>;
}

// @ts-error
async function ChatToFilePage({ params }: ChatProps) {
  auth.protect();
  const { userId } = await auth();
  const { id } = await params;
  console.log(id);
  const ref = await adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .get();

  const docUrl = await ref.data()?.downloadUrl;
  // get the actual url of the cloud storage bucket
  // My case was gsutil cors set cors.json gs://chat-with-pdf-ai-ef204.firebasestorage.app

  return (
    <div className="grid h-full overflow-hidden lg:grid-cols-5">
      <div className="col-span-5 overflow-y-auto lg:col-span-2">
        <Chat id={id} />
      </div>
      <div className="col-span-5 overflow-auto border-r-2 bg-gray-100 lg:-order-1 lg:col-span-3 lg:border-indigo-600">
        <PdfView url={docUrl} />
      </div>
    </div>
  );
}

export default ChatToFilePage;
