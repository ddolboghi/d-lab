"use client";

import { signOut } from "next-auth/react";
import DLabLogoReversed from "./icons/DLabLogoReversed";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import Link from "next/link";

type NavbarProps = {
  userName: string | undefined | null;
  userEmail: string | undefined | null;
};

export default function Navbar({ userEmail, userName }: NavbarProps) {
  let userInfo = "";
  if (userName && userEmail) {
    userInfo = userEmail + "\n" + userName;
  } else if (!userName && userEmail) {
    userInfo = userEmail;
  } else if (!userEmail && userName) {
    userInfo = userName;
  }

  return (
    <nav className="sticky top-0 left-0 z-50 bg-white w-full h-[50px] border-b-[1px] border-[#A1A1A1] flex flex-row justify-between items-center">
      <SidebarTrigger className="bg-white" />
      <Link href="/dashboard" className="flex flex-row items-center">
        <DLabLogoReversed />
        <h1 className="">D-Lab</h1>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-row gap-2 items-center">
          <div className="flex flex-row items-center text-[12px] text-left">
            {userEmail ?? ""}
            <br />
            {userName ?? ""}
          </div>
          <ChevronDown className="w-[13px] h-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border-none rounded-[6px]">
          <DropdownMenuLabel className="text-[#878787] text-[12px]">
            계정
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
