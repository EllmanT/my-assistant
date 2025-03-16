import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import UpgradeButton from "./UpgradeButton";

function Header() {
  return (
    <div className="flex justify-between bg-white shadow-sm p-5 border-b">
      <Link href="/dashboard" className="text-2xl font-bold">
        Maita <span className="text-blue-800">Docs</span>
      </Link>
      <SignedIn />
      <div className="flex items-cener space-x-2 ">
        <Button asChild variant="outline" className="hidden md:flex ">
          <Link href="/dashboard/upgrade">Pricing</Link>
        </Button>
        <Button asChild variant="outline" className="hidden md:flex">
          <Link href="/dashboard">My Documents</Link>
        </Button>
        <Button asChild variant="outline" className="hidden md:flex">
          <Link href="/dashboard/upload">
            <FilePlus2 className="text-indigo-600" />
          </Link>
        </Button>
        <UserButton />
        <UpgradeButton />
      </div>
    </div>
  );
}

export default Header;
