import { selectExperimentByServiceIdAndExperimentId } from "@/actions/experiment";
import ExperimentEdit from "@/components/experiment/ExperimentEdit";
import { ExperimentForUpdate } from "@/utils/types";
import experimentStyle from "./experiment-style.module.css";

export default async function page({
  params,
}: {
  params: { serviceId: string; experimentId: string };
}) {
  const serviceId = params.serviceId;
  const experimentId = params.experimentId;
  const experiment = await selectExperimentByServiceIdAndExperimentId(
    serviceId,
    experimentId
  );

  if (!experiment) {
    return <main>실험을 불러올 수 없습니다.</main>;
  }

  const endTime = new Date(experiment.end_time).toLocaleString();
  const createdAt = new Date(experiment.created_at).toLocaleString();

  const editContent: ExperimentForUpdate = {
    id: experiment.id,
    title: experiment.title,
    overview: experiment.overview,
    goal: experiment.goal,
    conclusion: experiment.conclusion,
  };
  return (
    <main>
      <nav>
        <ul>
          <li>실험 시작 시간: {createdAt}</li>
          <li>
            <ExperimentEdit serviceId={serviceId} editContent={editContent} />
          </li>
        </ul>
      </nav>
      <hr />
      <table className={experimentStyle.table}>
        <thead>
          <tr>
            <th className={experimentStyle.th}>실험 제목</th>
            <th className={experimentStyle.th}>실험 개요</th>
            <th className={experimentStyle.th}>실험종료 시간</th>
            <th className={experimentStyle.th}>실험군</th>
            <th className={experimentStyle.th}>대조군</th>
            <th className={experimentStyle.th}>목표 수치</th>
          </tr>
        </thead>
        <tbody className={experimentStyle.tbody}>
          <tr>
            <td className={experimentStyle.td}>{experiment.title}</td>
            <td className={experimentStyle.td}>{experiment.overview}</td>
            <td className={experimentStyle.td}>{endTime}</td>
            <td className={experimentStyle.td}>실험군 데이터</td>
            <td className={experimentStyle.td}>대조군 데이터</td>
            <td className={experimentStyle.td}>{experiment.goal}</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
