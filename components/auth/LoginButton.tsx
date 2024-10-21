"use client";

import { googleLogin } from "@/lib/googleLogin";
import googleLogo from "@/public/assets/google-logo.png";
import Image from "next/image";

type LoginButtonProps = {
  redirectRoute: string;
};

const LoginButton = ({ redirectRoute }: LoginButtonProps) => {
  return (
    <div className="bg-white border-2 border-[#CACACA] w-[280px] h-[50px] rounded-full flex items-center">
      <button
        className="w-full h-full rounded-full flex text-center items-center justify-center gap-5"
        onClick={() => googleLogin(redirectRoute)}
      >
        <Image src={googleLogo} width={25} alt="구글 로고" />
        <p className="font-medium text-[18px] text-black">구글로 로그인하기</p>
      </button>
    </div>
  );
};

export default LoginButton;
