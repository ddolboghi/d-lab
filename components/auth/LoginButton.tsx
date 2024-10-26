import { signIn } from "@/auth";
import googleLogo from "@/public/assets/google-logo.png";
import Image from "next/image";

type LoginButtonProps = {
  redirectRoute: string;
};

const LoginButton = ({ redirectRoute }: LoginButtonProps) => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: redirectRoute });
      }}
      className="bg-white border-2 border-[#CACACA] w-[280px] h-[50px] rounded-full flex items-center"
    >
      <button
        className="w-full h-full rounded-full flex text-center items-center justify-center gap-5"
        type="submit"
      >
        <Image src={googleLogo} width={25} alt="구글 로고" />
        <p className="font-medium text-[18px] text-black">구글로 로그인하기</p>
      </button>
    </form>
  );
};

export default LoginButton;
