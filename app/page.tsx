"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import {
  Globe,
  MessageSquare,
  FileText,
  Search,
  BarChart,
  LucideRockingChair,
} from "lucide-react";
import { useEffect, useState } from "react";

const features = [
  {
    name: "📂 Store PDFs",
    description: "Securely store and access your PDFs anytime, anywhere.",
    icon: Globe,
  },
  {
    name: "🤖 AI Chat",
    description: "Chat with AI to get insights and answers from your PDFs.",
    icon: MessageSquare,
  },
  {
    name: "⚡ Instant Analysis",
    description: "Upload PDFs for auto-analysis and key info extraction.",
    icon: FileText,
  },
  {
    name: "📝 Summarize Docs",
    description: "Get quick, concise summaries of long PDFs.",
    icon: Search,
  },
  {
    name: "🔍 Search PDFs",
    description: "Search and find exactly what you need in seconds.",
    icon: Search,
  },
  {
    name: "📊 Contextual Insights",
    description: "Get deeper context, tone, and meaning of specific sections.",
    icon: BarChart,
  },
];

export default function Home() {
  const text = "Talk to your PDFs!"; // Define your text here

  // Explicitly define the type of letters as string[]
  const [letters, setLetters] = useState<string[]>([]);

  useEffect(() => {
    // Split the text into an array of letters, including spaces
    const splitText = text.split("");
    setLetters(splitText);
  }, []); // Only run once on component mount, since the text is static
  return (
    <main className="flex-1 overflow-scroll bg-gradient-to-bl from-white to-sky-950 p-2 lg:p-5">
      <div className="rounded-md bg-white py-24  drop-shadow-xl sm:py-32">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-xl bg-gradient-to-r from-blue-100 via-blue-200 to-blue-400 p-8 shadow-xl sm:text-center">
            {/* Heading Section */}
            <div className="mb-6 flex flex-col items-center justify-center">
              <LucideRockingChair className="mr-2 size-14  text-white" />{" "}
              {/* Icon */}
              {/* <h2 className="text-base font-semibold leading-7 text-white">
                The Future of Document Interaction!
              </h2> */}
            </div>

            {/* Animated Letter Text */}
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-6xl">
              {letters.map((letter, index) => (
                <span
                  key={index}
                  className={`inline-block ${
                    letter === " " ? "w-4" : ""
                  } animate-letterPop opacity-0`}
                  style={{ animationDelay: `${index * 0.1}s` }} // Delay each letter by 0.1s
                >
                  {letter}
                </span>
              ))}
            </p>

            {/* Description */}
            <p className="mt-4 text-lg text-gray-50">
              with <span className="font-bold text-black">Maita</span> 🚀
              <br />
              <br />
              Simply upload your documents and let our intelligent Docs AI
              chatbot <span className="font-bold text-black">Maita </span> bring
              them to life, turning boring files into{" "}
              <span className="font-bold text-black">
                dynamic, engaging conversations !
              </span>
              💬
            </p>

            {/* Call-to-Action Button */}
            <Button asChild className="mt-10">
              <Link
                href="/dashboard"
                className="rounded-md bg-indigo-600 px-6 py-3 text-white transition duration-300 hover:bg-gray-700"
              >
                Start Now - Free !
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Image
              alt="App screenshot"
              src="https://i.imgur.com/VciRSTI.jpeg"
              width={2432}
              height={1442}
              className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            />
            <div aria-hidden="true" className="relative">
              <div className="absolute -inset-x-32 bottom-0 bg-gradient-to-t from-white/95 pt-[5%]" />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative rounded-lg bg-white p-6 pl-9 shadow-md transition-shadow duration-300 hover:scale-105 hover:shadow-xl"
              >
                <dt className="inline text-lg font-semibold text-gray-900">
                  {/* <feature.icon
                    aria-hidden="true"
                    className="absolute left-1 top-1 size-6 text-indigo-600 transition-all duration-300 hover:scale-110"
                  /> */}
                  <span className="ml-10 text-xl font-extrabold text-gray-800">
                    {feature.name}
                  </span>
                </dt>
                <dd className="mt-2 text-lg leading-relaxed text-gray-700">
                  {feature.description}
                  {/* <span className="mt-3 block cursor-pointer font-medium text-indigo-600 transition-colors duration-300 hover:text-indigo-800">
                    Learn More
                  </span> */}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
