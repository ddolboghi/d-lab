import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function page() {
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
