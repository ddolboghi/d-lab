"use server";

import { getIsOngoing } from "@/lib/dateTranslator";
import { ExperimentForRead } from "@/utils/types";
import Link from "next/link";
import OngoingDot from "../icons/OngoingDot";
import EndDot from "../icons/EndDot";

type ExperimentBoxProps = {
  serviceId: number;
  experiment: ExperimentForRead;
};

export default async function ExperimentBox({
  serviceId,
  experiment,
}: ExperimentBoxProps) {
  const isOngoing = getIsOngoing(true, experiment.end_time);

  return (
    <Link
      href={`/dashboard/${serviceId}/${experiment.id}`}
      className="absolute h-full w-full text-center left-0 flex items-start bg-[#F4F4F4] rounded-[5px] p-2"
    >
      <p className="font-medium text-[12px]">{experiment.title}</p>
      <span className="absolute bottom-0 right-0 text-[8px] font-medium p-2 flex items-center justify-center gap-1">
        {isOngoing ? <OngoingDot /> : <EndDot />}
        {isOngoing ? "진행 중" : "종료"}
      </span>
    </Link>
  );
}
