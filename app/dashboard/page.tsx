import { selectAllService } from "@/actions/service";
import ExperimentList from "@/components/experiment/ExperimentList";
import ExperimentRegister from "@/components/experiment/ExperimentRegister";
import AddService from "@/components/service/AddService";
import ServiceInfo from "@/components/service/ServiceInfo";

export default async function DashboardPage() {
  const services = await selectAllService();

  return (
    <div className="translate-y-[50px] rounded-bl-[30px] bg-[#FFF] pb-8 pl-8 overflow-y-auto h-screen">
      <h1 className="font-bold text-[22px] pt-[20px]">Projects</h1>
      <AddService />
      <ul className="list-none grid grid-rows-1 grid-flow-col auto-cols-max gap-[50px] w-full overflow-x-auto">
        {services ? (
          services.map((service) => (
            <li
              key={service.id}
              className="relative rounded-[25px] bg-[#F0F2F5] w-[300px] text-center px-4 min-h-[100px]"
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
