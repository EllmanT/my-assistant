"use client";

import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import { useTransition } from "react";
import useSubsription from "@/hooks/useSubscription";
import { Button } from "./ui/button";
import { DownloadCloud, Trash2Icon } from "lucide-react";
import { deleteDocument } from "@/action/deleteDocument";
function Document({
  id,
  name,
  size,
  downloadUrl,
}: {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
}) {
  const router = useRouter();
  const [isDeleting, startTransition] = useTransition();
  const { hasActiveMembership, isOverFileLimit } = useSubsription();
  console.log(isOverFileLimit);

  return (
    <div className="group flex h-60 w-48 cursor-pointer flex-col justify-between rounded-xl bg-white p-4 drop-shadow-md transition-all hover:scale-105 hover:bg-indigo-600 hover:text-white">
      <div
        className="flex-1"
        onClick={() => {
          router.push(`/dashboard/files/${id}`);
        }}
      >
        <p className="line-clamp-2 font-semibold">{name}</p>
        <p className="text-sm text-gray-500 group-hover:text-indigo-100">
          {byteSize(size).value}KB
        </p>
      </div>

      {/* actions */}
      <div className="flex justify-end space-x-2 ">
        <Button
          variant="outline"
          // For testing pupropses we enable it
          // disabled={isDeleting || !hasActiveMembership}
          disabled={isDeleting}
          onClick={() => {
            const prompt = window.confirm(
              "Are you sure you want to delete the document?"
            );

            if (prompt) {
              // delete document
              startTransition(async () => {
                await deleteDocument(id);
              });
            }
          }}
        >
          <Trash2Icon className="size-6 text-red-500" />
          {/* For testing purposes I will enable this */}
          {hasActiveMembership && (
            <>
              <span className="ml-2 text-red-500">PRO</span>
            </>
          )}
        </Button>
        <Button variant="outline" asChild>
          <a href={downloadUrl} download target="_blank">
            <DownloadCloud className="size-6 text-indigo-600" />
          </a>
        </Button>
      </div>
    </div>
  );
}

export default Document;
