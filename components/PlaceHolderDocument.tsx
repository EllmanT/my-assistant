"use client";
import React from "react";
import { Button } from "./ui/button";
import { FrownIcon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import useSubsription from "@/hooks/useSubscription";

function PlaceHolderDocument() {
  const { isOverFileLimit } = useSubsription();
  const router = useRouter();
  console.log(isOverFileLimit);
  const HandleClick = () => {
    // Check if the user is FREE tier and if there over limit push to upgrade page

    if (isOverFileLimit) {
      router.push("/dashboard/upgrade");
    } else {
      router.push("/dashboard/upload");
    }
  };
  return (
    <Button
      onClick={HandleClick}
      className="flex h-60 w-48 flex-col items-center rounded-xl bg-gray-200 text-gray-400 drop-shadow-md "
    >
      {isOverFileLimit ? (
        <FrownIcon className="size-16" />
      ) : (
        <PlusCircleIcon className="size-16" />
      )}
      <p className="font-semibold">
        {isOverFileLimit ? "Upgrade to add more" : "Add a document"}
      </p>
    </Button>
  );
}

export default PlaceHolderDocument;
