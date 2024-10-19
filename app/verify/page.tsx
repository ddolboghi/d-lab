import SimpleSignin from "@/components/signin/SimpleSignin";
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
      <h1 className="text-lg">2차 인증</h1>
      <SimpleSignin email={user.email} />
    </main>
  );
}
