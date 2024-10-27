import { selectDataInfoByServiceId } from "@/actions/serviceData";
import DataInfoEdit from "@/components/data/DataInfoEdit";
import DataInfoRegister from "@/components/data/DataInfoRegister";

export default async function page({
  params,
}: {
  params: { serviceId: string };
}) {
  const serviceId = params.serviceId;
  const registeredDatas = await selectDataInfoByServiceId(Number(serviceId));
  return (
    <main>
      <table className="border border-black">
        <thead>
          <tr>
            <th className="border border-black p-2 w-[120px]">데이터 명</th>
            <th className="border border-black p-2 w-[120px]">API Endpoint</th>
            <th className="border border-black p-2 w-[120px]">headers</th>
            <th className="border border-black p-2">
              <h1>metadata</h1>
              <hr />
              <ul className="flex flex-col justify-around w-full">
                <li>컬럼명</li>
                <li>설명</li>
                <li>데이터 타입</li>
                <li>예시</li>
              </ul>
            </th>
            <th className="border border-black p-2 w-[120px]">등록 시간</th>
            <th className="border border-black p-2 w-[120px]">편집</th>
          </tr>
        </thead>
        <tbody>
          <DataInfoRegister serviceId={serviceId} />
          {registeredDatas &&
            registeredDatas.map((data) => (
              <DataInfoEdit key={data.id} dataInfo={data} />
            ))}
        </tbody>
      </table>
    </main>
  );
}
