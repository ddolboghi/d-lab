import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginButton from "@/components/auth/LoginButton";
import Image from "next/image";
import DLabLogo from "@/components/icons/DLabLogo";

export default async function Login() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-col justify-center items-center text-center h-screen bg-[#323232]">
      <DLabLogo />
      <section className="flex flex-col justify-center gap-[90px] items-center text-center">
        <h1 className="font-extrabold text-[48px] text-white">D-Lab</h1>
        <div className="flex flex-col gap-2">
          <LoginButton redirectRoute="dashboard" />
        </div>
      </section>
    </main>
  );
}
