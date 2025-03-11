"use client";

import { toast } from "@/hooks/use-toast";
import useSubsription from "@/hooks/useSubscription";
import useUpload, { StatusText } from "@/hooks/useUpload";
import {
  CheckCheckIcon,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { JSX, useCallback, useEffect } from "react";

import { useDropzone } from "react-dropzone";
function FileUploader() {
  const { progress, status, fileId, handleUpload } = useUpload();
  const { isOverFileLimit, filesLoading } = useSubsription();
  const router = useRouter();
  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Do something with the files
      console.log(acceptedFiles);
      const file = acceptedFiles[0];

      if (file) {
        if (!isOverFileLimit && !filesLoading) {
          await handleUpload(file);
        } else {
          toast({
            variant: "destructive",
            title: "Free Plan File Limit Reached",
            description:
              "You have reached max number of document uploads .Upgrade your plan to add more docs",
          });
        }
      } else {
        // do something
      }
    },
    [handleUpload, isOverFileLimit, filesLoading]
  );
  const statusIcons: {
    // eslint-disable-next-line no-unused-vars
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.UPLOADING]: <RocketIcon className="size-20 text-indigo-600" />,
    [StatusText.UPLOADED]: (
      <CheckCheckIcon className="size-20 text-indigo-600" />
    ),
    [StatusText.SAVING]: <SaveIcon className="size-20 text-indigo-600" />,
    [StatusText.GENERATING]: (
      <HammerIcon className="size-20 animate-bounce text-indigo-600" />
    ),
  };
  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-4">
      {uploadInProgress && (
        <div className="mt-32 flex flex-col items-center justify-center gap-5">
          <div
            className={`radial-progress border-4 border-indigo-600 bg-indigo-300 text-white ${
              progress === 100 && "hidden"
            }`}
            role="progressbar"
            style={{
              // @ts-expect-error ERROR EXPECTED
              "--value": progress,
              "--size": "12rem",
              "--thickness": "1.3rem",
            }}
          >
            {progress}%
          </div>

          {
            // @ts-expect-error ERROR EXPECTED
            statusIcons[status!]
          }
          <p className="animate-pulse text-indigo-600">
            {String(status) ?? ""}
          </p>
        </div>
      )}
      {!uploadInProgress && (
        <div
          {...getRootProps()}
          className={`mt-10 flex h-96 w-[90%] items-center justify-center rounded-lg border-2 border-dashed border-indigo-600 p-10 text-indigo-600 ${
            isFocused || isDragActive ? "bg-indigo-300" : "bg-indigo-100"
          }`}
        >
          <input {...getInputProps()} />
          <div className=" flex flex-col items-center justify-center">
            {isDragActive ? (
              <>
                <RocketIcon className="size-20 animate-ping" />
                <p>Drop the files here ...</p>
              </>
            ) : (
              <>
                <CircleArrowDown className="size-20 animate-bounce" />
                <p>
                  Drag &apos;n&apos; drop some files here, or click to select
                  files
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
