import { selectExperimentsByServiceId } from "@/actions/experiment";
import { selectServiceById } from "@/actions/service";
import { selectDataByServiceId } from "@/actions/serviceData";
import ExperimentRegister from "@/components/experiment/ExperimentRegister";
import ServiceInfo from "@/components/service/ServiceInfo";
import Link from "next/link";

export default async function page({
  params,
}: {
  params: { serviceId: string };
}) {
  const serviceId = params.serviceId;
  const serviceInfo = await selectServiceById(serviceId);
  const serviceDatas = await selectDataByServiceId(serviceId);
  const experiments = await selectExperimentsByServiceId(serviceId);

  return (
    <main>
      <ServiceInfo serviceInfo={serviceInfo} />
      <Link href={`/dashboard/${serviceId}/data`}>데이터 보기</Link>
      <hr />
      {experiments ? (
        <ul>
          {experiments.map((experiment) => (
            <li
              key={experiment.id}
              className="relative border border-gray-400 rounded w-[200px] h-[70px] text-center"
            >
              <Link
                href={`/dashboard/${serviceId}/${experiment.id}`}
                className="absolute h-full w-full text-center left-0 flex justify-center items-center"
              >
                {experiment.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>실험을 해보세요.</div>
      )}
      <hr />
      <ExperimentRegister serviceId={serviceId} serviceDatas={serviceDatas} />
    </main>
  );
}
