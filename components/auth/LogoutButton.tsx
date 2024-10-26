import { signOut } from "@/auth";

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button
        type="submit"
        className="bg-white border-2 border-gray-200 w-[280px] h-[60px] rounded-full text-lg"
      >
        로그아웃
      </button>
    </form>
  );
}
