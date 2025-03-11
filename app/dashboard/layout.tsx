import { ClerkLoaded } from "@clerk/nextjs";
import React from "react";
import Header from "@/components/Header";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkLoaded>
      <div className="flex h-screen flex-1 flex-col">
        <Header />
        {children}
        <main className="flex-1 overflow-y-auto"></main>
      </div>
    </ClerkLoaded>
  );
}

export default DashboardLayout;
