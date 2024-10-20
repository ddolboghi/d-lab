"use client";

import { signOutAction } from "@/actions/auth";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOutAction();
  };
  return (
    <button
      onClick={handleLogout}
      className="bg-white border-2 border-gray-200 w-[280px] h-[60px] rounded-full text-lg"
    >
      로그아웃
    </button>
  );
}
