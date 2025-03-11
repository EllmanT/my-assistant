import React from "react";
import PlaceHolderDocument from "./PlaceHolderDocument";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/firebaseAdmin";
import Document from "./Document";

async function Documents() {
  auth.protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }
  const documentsSnapshot = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .get();
  return (
    <div className=" mx-auto flex max-w-7xl flex-wrap justify-center gap-5 rounded-sm bg-gray-100 p-5 lg:justify-start">
      {documentsSnapshot.docs.map((doc) => {
        const { name, downloadUrl, size } = doc.data();

        return (
          <Document
            key={doc.id}
            id={doc.id}
            name={name}
            size={size}
            downloadUrl={downloadUrl}
          />
        );
      })}
      <PlaceHolderDocument />
    </div>
  );
}

export default Documents;
