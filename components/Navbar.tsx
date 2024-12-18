"use client";

import { signOut } from "next-auth/react";
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
    <div className="fixed top-0 left-50 z-10 bg-[#101010] w-full">
      <nav className="bg-white w-full h-[50px] border-b-[1.5px] border-[#DFE3EC] rounded-tl-[30px] flex flex-row justify-between items-center pl-2 pr-14">
        <SidebarTrigger />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex flex-row items-center gap-2 text-[12px] text-left">
              <div>
                <p className="text-[#5A5A5A] font-normal">{userEmail ?? ""}</p>
                <p className="text-[#2F2F2F] font-semibold">{userName ?? ""}</p>
              </div>
              <ChevronDown className="w-[13px] h-6 border-[#6C6C6C]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border-none rounded-[6px]">
            <DropdownMenuLabel className="text-[#878787] text-[12px]">
              계정
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button onClick={() => signOut()} className="w-full text-left">
                로그아웃
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );
}
