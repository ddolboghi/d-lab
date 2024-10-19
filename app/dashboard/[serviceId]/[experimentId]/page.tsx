import {
  selectByServiceIdAndExperimentIdInLogData,
  updateConclusion,
} from "@/actions/experiment";
import ExperimentEdit from "@/components/experiment/ExperimentEdit";
import { ExperimentForUpdate } from "@/utils/types";
import { formatDateUTC, toKst } from "@/lib/dateTranslator";
import { selectDataInfoById } from "@/actions/serviceData";
import DataView from "@/components/data/DataView";
import { fetchFilteredLogData } from "@/actions/connectData";

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
  const experimentDataInfo = await selectDataInfoById(
    experiment.experimental_data_id
  );
  const controlDataInfo = await selectDataInfoById(experiment.control_data_id);

  const createdAt = formatDateUTC(toKst(new Date(experiment.created_at)));
  const endTime = experiment.end_time
    ? formatDateUTC(new Date(experiment.end_time))
    : "";

  let experimentFilteredData: any[] | null = null;
  if (experimentDataInfo) {
    experimentFilteredData = await fetchFilteredLogData(
      experimentDataInfo.url,
      experimentDataInfo.headers,
      experimentDataInfo.metadata,
      experiment.experimental_data_conditions
    );
  }

  let controlFilteredData: any[] | null = null;
  if (controlDataInfo) {
    controlFilteredData = await fetchFilteredLogData(
      controlDataInfo.url,
      controlDataInfo.headers,
      controlDataInfo.metadata,
      experiment.control_data_conditions
    );
  }

  const controlValue = controlFilteredData ? controlFilteredData.length : null;
  const experimentalValue = experimentFilteredData
    ? experimentFilteredData.length
    : null;

  let actual: number | null = null;
  let conclusionContent: string | null = experiment.conclusion;
  if (experiment.end_time) {
    const isEnd = new Date() >= new Date(experiment.end_time);
    if (isEnd) {
      if (experimentalValue && controlValue) {
        actual = (experimentalValue / controlValue) * 100;
      }
      if (conclusionContent && actual) {
        conclusionContent = await updateConclusion(
          experiment.id,
          actual,
          experiment.goal
        );
      }
    }
  }

  const editContent: ExperimentForUpdate = {
    id: experiment.id,
    title: experiment.title,
    overview: experiment.overview,
    goal: experiment.goal,
    conclusion: conclusionContent,
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
              isEnd={new Date() > new Date(endTime)}
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
          <div>{endTime}</div>
        </section>
        <section className="border border-black p-2">
          <h1>실험군</h1>
          <div>
            {experimentDataInfo ? (
              <DataView
                endTime={experiment.end_time}
                dataInfo={experimentDataInfo}
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
          <p>목표 수치: {experiment.goal}%</p>
          {actual && <p>실제 수치: {actual}%</p>}
          {conclusionContent && <p>{conclusionContent}</p>}
        </section>
      </div>
    </main>
  );
}
