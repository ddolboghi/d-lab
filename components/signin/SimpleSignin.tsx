"use client";

import { varifyByEmail } from "@/actions/signin";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

type SimpleSigninProps = {
  email: string | undefined | null;
};

export default function SimpleSignin({ email }: SimpleSigninProps) {
  const [error, setError] = useState("");

  const verify = async (formData: FormData) => {
    const response = await varifyByEmail(email, formData);
    if (response) {
      redirect("/dashboard");
    } else {
      setError("비밀번호가 일치하지 않습니다.");
    }
  };
  return (
    <form
      action={verify}
      className="flex flex-col gap-2 items-center text-center"
    >
      <label>비밀번호를 입력해주세요.</label>
      <input
        name="password"
        type="password"
        className="border border-gray-500 p-2 rounded"
      />
      <button
        type="submit"
        className="bg-sky-400 text-white w-full rounded p-1"
      >
        로그인
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
