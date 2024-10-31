import {
  selectByServiceIdAndExperimentIdInLogData,
  selectConclusionById,
} from "@/actions/experiment";
import ExperimentEdit from "@/components/experiment/ExperimentEdit";
import { ExperimentForUpdate } from "@/utils/types";
import { formatDateUTC, toKst } from "@/lib/dateTranslator";
import { selectDataInfoById } from "@/actions/serviceData";
import DataView from "@/components/data/DataView";
import ExperimentConclusion from "@/components/experiment/ExperimentConclusion";
import Tag from "@/components/icons/Tag";
import Calendar from "@/components/icons/Calendar";
import ProgressDot from "@/components/icons/ProgressDot";

export default async function page({
  params,
}: {
  params: { serviceId: string; experimentId: string };
}) {
  const serviceId = params.serviceId;
  const experimentId = params.experimentId;
  const experiment = await selectByServiceIdAndExperimentIdInLogData(
    serviceId,
    experimentId
  );

  if (!experiment) {
    return <main>실험을 불러올 수 없습니다.</main>;
  }
  const experimentalDataInfo = await selectDataInfoById(
    experiment.experimental_data_id
  );
  const controlDataInfo = await selectDataInfoById(experiment.control_data_id);

  const createdAt = formatDateUTC(toKst(new Date(experiment.created_at)));
  const endTime = experiment.end_time ? new Date(experiment.end_time) : null;
  const formattedEndTime = experiment.end_time
    ? formatDateUTC(new Date(experiment.end_time))
    : "";

  const savedConclusion = await selectConclusionById(experiment.id);
  const editContent: ExperimentForUpdate = {
    id: experiment.id,
    title: experiment.title,
    overview: experiment.overview,
    goal: experiment.goal,
    conclusion: savedConclusion,
  };

  return (
    <main className="pl-[40px] pr-[32px] pt-[26px] pb-[40px] bg-[#FFF] rounded-bl-[30px]">
      <section className="flex flex-row items-center gap-4 mb-[33px]">
        <h1 className="font-semibold text-[22px]">{experiment.title}</h1>
        <ExperimentEdit
          editContent={editContent}
          isEnd={endTime ? new Date() >= endTime : false}
        />
      </section>
      <section className="flex flex-col gap-6 bg-[#F6F8FA] rounded-[10px] px-[25px] pt-[30px] pb-[38px] mb-[29px]">
        <h2 className="font-semibold text-[19.25px]">실험 정보</h2>
        <div className="flex flex-col gap-[39px] items-start">
          <div className="flex flex-row pl-3">
            <div className="shrink-0 flex flex-row items-center gap-3 w-[250px]">
              <Tag />
              <h3 className="text-[17.25px]">설명</h3>
            </div>
            <p className="text-[17.25px] max-w-[900px]">
              {experiment.overview}
            </p>
          </div>
          <div className="flex flex-row pl-3">
            <div className="shrink-0 flex flex-row items-center gap-3 w-[250px]">
              <ProgressDot />
              <h3 className="text-[17.25px]">진행 상태</h3>
            </div>
            {endTime ? (
              endTime <= new Date() ? (
                <span className="bg-green-400 px-2 rounded-full text-center text-white font-medium">
                  종료
                </span>
              ) : (
                <span className="bg-orange-400 px-2 rounded-full text-center text-white font-medium">
                  진행 중
                </span>
              )
            ) : (
              <span className="bg-orange-400 px-2 rounded-full text-center text-white font-medium">
                진행 중
              </span>
            )}
          </div>
          <div className="flex flex-row pl-3">
            <div className="shrink-0 flex flex-row items-center gap-3 w-[250px]">
              <Calendar />
              <h3 className="text-[17.25px]">실험 기간</h3>
            </div>
            <div className="grid grid-cols-5 items-center text-[17.25px] text-start max-w-[500px]">
              <p className="col-span-2">{createdAt}</p>
              <div className="flex justify-center">
                <span className="w-2 text-center">-</span>
              </div>
              <p className="col-span-2">{formattedEndTime}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-6 bg-[#F6F8FA] rounded-[10px] px-[25px] pt-[30px] pb-[38px] mb-[29px]">
        <h2 className="font-semibold text-[19.25px]">데이터</h2>
        <div>
          <h3 className="font-semibold text-[14px]">실험하고 싶은 대상</h3>
          <div>
            {experimentalDataInfo ? (
              <DataView
                endTime={experiment.end_time}
                dataInfo={experimentalDataInfo}
                conditions={experiment.experimental_data_conditions}
              />
            ) : (
              <p>데이터를 불러올 수 없습니다.</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-[14px]">비교하고 싶은 대상</h3>
          <div>
            {controlDataInfo ? (
              <DataView
                endTime={experiment.end_time}
                dataInfo={controlDataInfo}
                conditions={experiment.control_data_conditions}
              />
            ) : (
              <p>데이터를 불러올 수 없습니다.</p>
            )}
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4 bg-[#F6F8FA] rounded-[10px] px-[36px] pt-[24px] pb-[50px]">
        <h2 className="font-semibold text-[19.25px]">결과</h2>
        {experimentalDataInfo === null || controlDataInfo === null ? (
          <p>결론을 계산할 수 없습니다.</p>
        ) : (
          <ExperimentConclusion
            experimentalDataInfo={experimentalDataInfo}
            controlDataInfo={controlDataInfo}
            experiment={experiment}
            endTime={endTime}
          />
        )}
      </section>
    </main>
  );
}
