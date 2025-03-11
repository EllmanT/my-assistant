"use client";

import { useUser } from "@clerk/nextjs";
import { Message } from "./Chat";
import Image from "next/image";
import { BotIcon, Loader2Icon } from "lucide-react";
import Markdown from "react-markdown";

function ChatMessage({ message }: { message: Message }) {
  const isHuman = message.role === "human";
  const { user } = useUser();
  return (
    <div className={`chat ${isHuman ? "chat-end" : "chat-start"}`}>
      <div className="avatar chat-image">
        <div>
          {isHuman ? (
            user?.imageUrl && (
              <Image
                src={user?.imageUrl}
                alt="Profile Picture"
                width={20}
                height={20}
                className="rounded-full"
              />
            )
          ) : (
            <div className="flex size-5 items-center justify-center rounded-full bg-indigo-600">
              <BotIcon className="size-5 text-white" />
            </div>
          )}
        </div>
      </div>
      <div
        className={`chat-bubble prose ${isHuman && "bg-indigo-600 text-white"}`}
      >
        {message.message === "Thinking..." ? (
          <div className="flex items-center justify-center">
            <Loader2Icon className="size-5 animate-spin text-white" />
          </div>
        ) : (
          <Markdown>{message.message}</Markdown>
        )}
      </div>
    </div>
  );
}
export default ChatMessage;
