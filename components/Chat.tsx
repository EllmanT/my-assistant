"use client";

import { useUser } from "@clerk/nextjs";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { askQuestion } from "@/action/askQuestion";
import ChatMessage from "./ChatMessage";
import { useToast } from "@/hooks/use-toast";
import { summaryPrompt } from "@/constants/constants";

export type Message = {
  id?: string;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
};

function Chat({ id }: { id: string }) {
  const { user } = useUser();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  // const [hasRequestedSummary, setHasRequestedSummary] = useState(false); // New state
  const [snapshot, loading] = useCollection(
    user &&
      query(
        collection(db, "users", user?.id, "files", id, "chat"),
        orderBy("createdAt", "asc")
      )
  );

  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!snapshot) return;

    const newMessages = snapshot.docs.map((doc) => {
      const { role, message, createdAt } = doc.data();
      return {
        id: doc.id,
        role,
        message,
        createdAt: createdAt.toDate(),
      };
    });
    setMessages(newMessages);

    // // If chat is empty and summary hasn't been requested, request it
    // if (!hasRequestedSummary && newMessages.length === 0) {
    //   setHasRequestedSummary(true);
    //   startTransition(async () => {
    //     const summaryPrompt = "Hi, there !";

    //     setMessages((prev) => [
    //       ...prev,
    //       { role: "human", message: summaryPrompt, createdAt: new Date() },
    //       { role: "ai", message: summaryPrompt, createdAt: new Date() },
    //     ]);

    //     const { success, message } = await askQuestion(id, summaryPrompt);
    //     if (!success) {
    //       toast({
    //         variant: "destructive",
    //         title: "Error",
    //         description: message,
    //       });
    //       setMessages((prev) =>
    //         prev.slice(0, prev.length - 1).concat([
    //           {
    //             role: "ai",
    //             message: `Ooops... ${message}`,
    //             createdAt: new Date(),
    //           },
    //         ])
    //       );
    //     }
    //   });
    // }
  }, [snapshot]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const question = input;
    setInput("");

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        role: "human",
        message: question,
        createdAt: new Date(),
      },
      {
        role: "ai",
        message: "Thinking...",
        createdAt: new Date(),
      },
    ]);
    startTransition(async () => {
      const { success, message } = await askQuestion(id, question);
      if (!success) {
        // toast...

        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });

        setMessages((prev) =>
          prev.slice(0, prev.length - 1).concat([
            {
              role: "ai",
              message: `Ooops...${message}`,
              createdAt: new Date(),
            },
          ])
        );
      }
    });
  };
  return (
    <div className=" flex h-full flex-col overflow-scroll">
      <div className="w-full flex-1">
        {loading ? (
          <div>
            <Loader2Icon className="mt-20 size-20 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="p-5">
            {messages.length === 0 && (
              <ChatMessage
                key="placeholder"
                message={{
                  role: "ai",
                  message: summaryPrompt,
                  // role: "human",
                  // message: "Give me a summary of the document",
                  createdAt: new Date(),
                }}
              />
            )}
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            <div ref={bottomOfChatRef} />
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 m-2 flex space-x-2 rounded-md bg-gray-100 p-5"
      >
        <Input
          placeholder="Ask a Question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" disabled={!input || isPending}>
          {isPending ? (
            <Loader2Icon className="animate-spin text-indigo-600" />
          ) : (
            "Ask"
          )}
        </Button>
      </form>
    </div>
  );
}

export default Chat;
