import {
  selectByServiceIdAndExperimentIdInLogData,
  selectConclusionById,
} from "@/actions/experiment";
import ExperimentEdit from "@/components/experiment/ExperimentEdit";
import { ExperimentForUpdate } from "@/utils/types";
import { formatDateUTC, stringToUTC, toKst } from "@/lib/dateTranslator";
import { selectDataInfoById } from "@/actions/serviceData";
import DataView from "@/components/data/DataView";
import ExperimentConclusion from "@/components/experiment/ExperimentConclusion";

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
    <main>
      <nav>
        <ul>
          <li>실험 시작 시간: {createdAt}</li>
          <li>
            <ExperimentEdit
              serviceId={serviceId}
              editContent={editContent}
              isEnd={endTime ? new Date() >= endTime : false}
            />
          </li>
        </ul>
      </nav>
      <hr />
      <div className="flex flex-col gap-2">
        <section className="border border-black p-2">
          <h1>실험 제목</h1>
          <div>{experiment.title}</div>
        </section>
        <section className="border border-black p-2">
          <h1>실험 개요</h1>
          <div>{experiment.overview}</div>
        </section>
        <section className="border border-black p-2">
          <h1>실험종료 시간</h1>
          <div>{formattedEndTime}</div>
        </section>
        <section className="border border-black p-2">
          <h1>실험군</h1>
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
        </section>
        <section className="border border-black p-2">
          <h1>대조군</h1>
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
        </section>
        <section className="border border-black p-2">
          <h1>결론</h1>
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
      </div>
    </main>
  );
}
