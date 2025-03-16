import type { Metadata } from "next";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Maita",
  description:
    "Maita is an AI chatbot powered by OpenAI GPT, capable of extracting information from documents and answering questions based on the content. She can also provide responses to general queries. Built using the latest Next.js tech, LangChain, Pinecone, and Firebase, Maita delivers intelligent, real-time answers and enhances user interaction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex h-screen min-h-screen flex-col overflow-hidden">
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
