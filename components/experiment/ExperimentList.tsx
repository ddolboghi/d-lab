"use server";

import { selectExperimentsByServiceId } from "@/actions/experiment";
import ExperimentBox from "./ExperimentBox";

type ExperimentListProps = {
  serviceId: number;
};

export default async function ExperimentList({
  serviceId,
}: ExperimentListProps) {
  const experiments = await selectExperimentsByServiceId(serviceId);
  return (
    <div className="max-h-[450px] min-h-0 overflow-auto scrollbar-hidden">
      {experiments ? (
        <ul className="flex flex-col gap-2">
          {experiments.map((experiment) => (
            <li
              key={experiment.id}
              className="relative rounded w-full h-[100px] text-center mb-1"
            >
              <ExperimentBox serviceId={serviceId} experiment={experiment} />
            </li>
          ))}
        </ul>
      ) : (
        <div>실험을 해보세요.</div>
      )}
    </div>
  );
}
