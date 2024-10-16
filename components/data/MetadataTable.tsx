import { Metadata } from "@/utils/types";

type MetadataTableProps = {
  dataInfoId: number;
  metadatas: Metadata[];
};

export default function MetadataTable({
  dataInfoId,
  metadatas,
}: MetadataTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>컬럼명</th>
          <th>설명</th>
          <th>데이터 타입</th>
          <th>예시</th>
        </tr>
      </thead>
      <tbody>
        {metadatas.map((metadata, idx) => (
          <tr key={`${dataInfoId}-${idx}`}>
            <td>{metadata.columnName}</td>
            <td>{metadata.description}</td>
            <td>{metadata.type}</td>
            <td>{metadata.example}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
