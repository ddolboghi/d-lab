import AddService from "@/components/AddService";
import Link from "next/link";

export default async function MainPage() {
  return (
    <main>
      <div>대시보드</div>
      <AddService />
      <Link href="/main/lab">실험실</Link>
      <br />
      <Link href="/add">데이터 등록하기</Link>
    </main>
  );
}
