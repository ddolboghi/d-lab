import { selectAllService } from "@/actions/service";
import AddService from "@/components/service/AddService";
import Link from "next/link";

export default async function DashboardPage() {
  const services = await selectAllService();
  return (
    <main>
      <div>대시보드</div>
      <ul className="list-none">
        {services ? (
          services.map((service) => (
            <li
              key={service.id}
              className="relative border border-gray-400 rounded w-[200px] h-[70px] text-center"
            >
              <Link
                href={`/dashboard/${service.id}`}
                className="absolute h-full w-full text-center left-0 flex justify-center items-center"
              >
                {service.name}
              </Link>
            </li>
          ))
        ) : (
          <p>등록된 서비스가 없어요.</p>
        )}
      </ul>
      <AddService />
    </main>
  );
}
