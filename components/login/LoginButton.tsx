"use client";

import { googleLogin } from "@/lib/googleLogin";
import googleLogo from "@/public/assets/google-logo.png";
import Image from "next/image";

const LoginButton = () => {
  return (
    <div className="bg-white border-2 border-gray-200 w-[280px] h-[60px] rounded-full flex items-center">
      <button
        className="w-full h-full rounded-full text-[20px] flex text-center items-center justify-center gap-5"
        onClick={() => googleLogin()}
      >
        <Image src={googleLogo} width={25} alt="구글 로고" />
        <p>구글로 로그인하기</p>
      </button>
    </div>
  );
};

export default LoginButton;
