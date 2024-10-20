import LogoutButton from "@/components/auth/LogoutButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function page() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <p>등록되지 않은 유저입니다.</p>
      <p className="pb-3">
        이미 등록한 유저라면 로그아웃하고 다시 시도해주세요.
      </p>
      <LogoutButton />
    </main>
  );
}
