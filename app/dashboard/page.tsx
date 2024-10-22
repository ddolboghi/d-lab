import { selectAllService } from "@/actions/service";
import ExperimentList from "@/components/experiment/ExperimentList";
import ExperimentRegister from "@/components/experiment/ExperimentRegister";
import AddService from "@/components/service/AddService";
import ServiceInfo from "@/components/service/ServiceInfo";

export default async function DashboardPage() {
  const services = await selectAllService();

  return (
    <div className="">
      <h1 className="font-bold text-[22px] pl-8 pt-[20px]">Projects</h1>
      <AddService />
      <ul className="list-none grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 items-start justify-center gap-[50px] px-8 pb-8 w-full">
        {services ? (
          services.map((service) => (
            <li
              key={service.id}
              className="relative rounded-[6px] bg-white w-[300px] text-center px-4 flex flex-col min-h-[100px]"
            >
              <ServiceInfo service={service} />
              <ExperimentRegister serviceId={service.id} />
              <ExperimentList serviceId={service.id} />
            </li>
          ))
        ) : (
          <p>등록된 서비스가 없어요.</p>
        )}
      </ul>
    </div>
  );
}
