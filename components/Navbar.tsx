"use client";

import { signOutAction } from "@/actions/auth";
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

type NavbarProps = {
  userName: string | undefined;
  userEmail: string | undefined;
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

  const handleLogout = async () => {
    await signOutAction();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white w-full h-[50px] border-b-[1px] border-[#A1A1A1] flex flex-row justify-between items-center px-[20px]">
      <div className="flex flex-row items-center">
        <DLabLogoReversed />
        <h1 className="">D-Lab</h1>
      </div>
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
          <DropdownMenuItem onClick={handleLogout}>로그아웃</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
