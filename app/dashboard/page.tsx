import { selectAllService } from "@/actions/service";
import AddService from "@/components/service/AddService";
import Link from "next/link";

export default async function DashboardPage() {
  const services = await selectAllService();

  return (
    <div className="w-full h-screen mx-2">
      <h1 className="font-bold text-[32px] pl-[50px] pt-[20px]">Projects</h1>
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
    </div>
  );
}
