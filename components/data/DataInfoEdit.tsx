"use client";

import { deleteDataInfoById, updateDataInfoById } from "@/actions/serviceData";
import { columnDataTypes } from "@/lib/columnDataTypes";
import { DataInfo, headerPair, Metadata } from "@/utils/types";
import { useState } from "react";

type DataInfoEditProps = {
  dataInfo: DataInfo;
};

export default function DataInfoEdit({ dataInfo }: DataInfoEditProps) {
  const [title, setTitle] = useState(dataInfo.title);
  const [url, setUrl] = useState(dataInfo.url);
  const [headerPairs, setHeaderPairs] = useState<headerPair[]>(
    dataInfo.headers
  );
  const [metadatas, setMetadatas] = useState<Metadata[]>(dataInfo.metadata);
  const [isLoading, setIsLoading] = useState({
    create: false,
    update: false,
    delete: false,
  });
  const [isError, setIsError] = useState({
    create: false,
    update: false,
    delete: false,
  });

  const addMetadata = () => {
    const newMetadatas = [
      ...metadatas,
      {
        columnName: "",
        description: "",
        type: "",
        example: "",
      },
    ];
    setMetadatas(newMetadatas);
  };

  const handleMetadataChange = (idx: number, key: string, value: string) => {
    const newMetadatas = [...metadatas];
    const newMetadata = newMetadatas[idx];
    if (key === "columnName") {
      newMetadata.columnName = value;
      setMetadatas(newMetadatas);
    } else if (key === "description") {
      newMetadata.description = value;
      setMetadatas(newMetadatas);
    } else if (key === "type") {
      newMetadata.type = value;
      setMetadatas(newMetadatas);
    } else if (key === "example") {
      newMetadata.example = value;
      setMetadatas(newMetadatas);
    }
  };

  const deleteMetadata = (idx: number) => {
    const newMetadatas = [...metadatas];
    if (idx > -1 && idx < metadatas.length) {
      newMetadatas.splice(idx, 1);
      setMetadatas(newMetadatas);
    }
  };

  const handleUrlChange = (value: string) => {
    if (value.startsWith("https")) {
      setUrl(value);
    }
  };

  const addPair = () => {
    setHeaderPairs([...headerPairs, { id: Date.now(), key: "", value: "" }]);
  };

  const removePair = (id: number) => {
    setHeaderPairs(headerPairs.filter((headerPair) => headerPair.id !== id));
  };

  const updatePair = (id: number, field: string, value: string) => {
    setHeaderPairs(
      headerPairs.map((headerPair) =>
        headerPair.id === id ? { ...headerPair, [field]: value } : headerPair
      )
    );
  };

  const handleEdit = async () => {
    setIsLoading({ ...isLoading, update: true });
    const response = await updateDataInfoById(
      dataInfo.id,
      title,
      url,
      headerPairs,
      metadatas
    );
    setIsError({ ...isError, update: !response });
    setIsLoading({ ...isLoading, update: false });
  };

  const handleDelete = async () => {
    const result = confirm("정말 삭제하시겠어요?");
    if (result) {
      setIsLoading({ ...isLoading, delete: true });
      const response = await deleteDataInfoById(dataInfo.id);
      setIsError({ ...isError, delete: !response });
      setIsLoading({ ...isLoading, delete: false });
    }
  };

  return (
    <tr>
      <td className="border border-black p-2 truncate w-[120px]">
        <input
          name="title"
          defaultValue={dataInfo.title}
          className="border border-gray-300 rounded truncate"
          onChange={(e) => setTitle(e.target.value)}
        />
      </td>
      <td className="border border-black p-2 w-[120px] truncate ">
        <input
          name="url"
          defaultValue={dataInfo.url}
          className="border border-gray-300 rounded truncate"
          onChange={(e) => handleUrlChange(e.target.value)}
        />
      </td>
      <td className="border border-black p-2 w-[120px] truncate">
        {headerPairs.map((headerPair) => (
          <div key={headerPair.id} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              value={headerPair.key}
              className="border border-gray-300 rounded truncate"
              onChange={(e) => updatePair(headerPair.id, "key", e.target.value)}
              placeholder="Key"
            />
            <input
              type="text"
              value={headerPair.value}
              className="border border-gray-300 rounded truncate"
              onChange={(e) =>
                updatePair(headerPair.id, "value", e.target.value)
              }
              placeholder="Value"
            />
            <button
              onClick={() => removePair(headerPair.id)}
              className="bg-red-500 text-white rounded p-1 ml-2"
            >
              X
            </button>
          </div>
        ))}
        <button
          onClick={addPair}
          className="bg-blue-500 rounded text-white p-2"
        >
          +
        </button>
      </td>
      <td className="border border-black p-2 w-[600px]">
        {metadatas.map((metadata, idx) => (
          <div key={idx} className="flex flex-row items-center">
            <div className="flex flex-col mb-2">
              <div className="flex flex-row">
                <label>컬럼명</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded"
                  defaultValue={metadata.columnName}
                  onChange={(e) =>
                    handleMetadataChange(idx, "columnName", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-row">
                <label>설명</label>
                <input
                  type="text"
                  className={`${metadata.description === "created_at" && "bg-gray-200"} border border-gray-300 rounded`}
                  defaultValue={metadata.description}
                  readOnly={
                    metadata.description === "created_at" ? true : false
                  }
                  onChange={(e) =>
                    handleMetadataChange(idx, "description", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-row">
                <label>데이터 타입</label>
                <select
                  name="type"
                  defaultValue={metadata.type}
                  disabled={
                    metadata.description === "created_at" ? true : false
                  }
                  onChange={(e) =>
                    handleMetadataChange(idx, "type", e.target.value)
                  }
                >
                  <option value="" disabled>
                    선택 안함
                  </option>
                  {columnDataTypes.map((type, idx) => (
                    <option key={`type-${idx}`} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-row">
                <label>예시</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded"
                  defaultValue={metadata.example}
                  placeholder=""
                  onChange={(e) =>
                    handleMetadataChange(idx, "example", e.target.value)
                  }
                />
              </div>
            </div>
            <button
              className="bg-red-500 text-white rounded p-1 ml-2"
              onClick={() => deleteMetadata(idx)}
            >
              X
            </button>
          </div>
        ))}
        <button
          className="bg-blue-500 rounded text-white p-2"
          onClick={addMetadata}
        >
          +
        </button>
      </td>
      <td className="border border-black p-2 w-[120px]">
        {new Date(dataInfo.created_at).toLocaleString()}
      </td>
      <td className="border border-black p-2 w-[120px]">
        <button
          onClick={handleEdit}
          className="bg-blue-500 text-white rounded p-2"
          disabled={isLoading.update}
        >
          {isLoading.update ? "수정 중.." : "수정"}
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white rounded p-2"
          disabled={isLoading.delete}
        >
          {isLoading.delete ? "삭제 중.." : "삭제"}
        </button>
        {isError.update && "수정에 실패했습니다."}
        {isError.delete && "삭제에 실패했습니다."}
      </td>
    </tr>
  );
}
