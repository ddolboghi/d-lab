import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import KakaoLoginButton from "@/components/login/KakaoLoginButton";
import Link from "next/link";

export default async function Login() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (user) {
    redirect("/main");
  }

  return (
    <main className="flex flex-col justify-center gap-2 items-center text-center h-screen">
      <h1 className="font-semibold text-[40px]">환영합니다!</h1>
      <div className="flex flex-col gap-2">
        <KakaoLoginButton />
      </div>
      <Link href="/error">에러페이지로 이동</Link>
    </main>
  );
}
