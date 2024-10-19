"use client";

import { insertDataInfo } from "@/actions/serviceData";
import { columnDataTypes } from "@/lib/columnDataTypes";
import { headerPair, Metadata } from "@/utils/types";
import { useState } from "react";

type DataInfoRegisterProps = {
  serviceId: string;
};

export default function DataInfoRegister({ serviceId }: DataInfoRegisterProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [headerPairs, setHeaderPairs] = useState<headerPair[]>([
    { id: Date.now(), key: "", value: "" },
  ]);
  const [metadatas, setMetadatas] = useState<Metadata[]>([
    {
      columnName: "데이터 생성 시간은 필수 값입니다.",
      description: "created_at",
      type: "string",
      example: "2024-09-30 01:46:43.775468+00",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleRegister = async () => {
    if (serviceId === "0") {
      return;
    }
    setIsLoading(true);
    const response = await insertDataInfo(
      serviceId,
      title,
      url,
      headerPairs,
      metadatas
    );

    if (!response) {
      setError("저장에 실패했습니다.");
    } else {
      setError(null);
      setTitle("");
      setUrl("");
      setHeaderPairs([{ id: Date.now(), key: "", value: "" }]);
      setMetadatas([]);
    }
    setIsLoading(false);
  };

  return (
    <tr>
      <td className="border border-black p-2 truncate w-[120px]">
        <input
          type="text"
          name="title"
          value={title}
          className="border border-gray-300 rounded p-1 w-full"
          onChange={(e) => setTitle(e.target.value)}
        />
      </td>
      <td className="border border-black p-2 w-[120px] truncate ">
        <input
          type="text"
          name="apiEndpoint"
          value={url}
          placeholder="https://..."
          className="border border-gray-300 rounded p-1 w-full"
          onChange={(e) => handleUrlChange(e.target.value)}
        />
      </td>
      <td className="border border-black p-2 w-[120px] truncate ">
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
      <td className="border border-black p-2 w-[120px] truncate ">
        {metadatas.map((metadata, idx) => (
          <div key={idx} className="flex flex-row items-center">
            <div className="flex flex-col mb-2">
              <div className="flex flex-row">
                <label>컬럼명</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded"
                  value={metadata.columnName}
                  placeholder=""
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
                  value={metadata.description}
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
                  value={metadata.type}
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
                  value={metadata.example}
                  placeholder=""
                  onChange={(e) =>
                    handleMetadataChange(idx, "example", e.target.value)
                  }
                />
              </div>
            </div>
            <button
              className={`${metadata.description === "created_at" ? "bg-slate-400" : "bg-red-500"} text-white rounded p-1 w-1/4 h-1/4 ml-2`}
              onClick={() => deleteMetadata(idx)}
              disabled={metadata.description === "created_at" ? true : false}
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
      <td className="border border-black p-2 w-[120px]">-</td>
      <td>
        <button
          className="bg-green-400 text-white p-2"
          onClick={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? "저장 중.." : "저장"}
        </button>
        {error && <p>{error}</p>}
      </td>
    </tr>
  );
}
