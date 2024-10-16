"use client";

import { insertDataInfo } from "@/actions/serviceData";
import { columnDataTypes } from "@/lib/columnDataTypes";
import { Metadata } from "@/utils/types";
import { useState } from "react";

type DataInfoRegisterProps = {
  serviceId: string;
};

export default function DataInfoRegister({ serviceId }: DataInfoRegisterProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [apikey, setApikey] = useState("");
  const [metadatas, setMetadatas] = useState<Metadata[]>([]);
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

  const handleRegister = async () => {
    if (serviceId === "0") {
      return;
    }
    setIsLoading(true);
    const response = await insertDataInfo(
      serviceId,
      title,
      url,
      apikey,
      metadatas
    );

    if (!response) {
      setError("저장에 실패했습니다.");
    } else {
      setError(null);
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
          placeholder="https://..."
          className="border border-gray-300 rounded p-1 w-full"
          onChange={(e) => handleUrlChange(e.target.value)}
        />
      </td>
      <td className="border border-black p-2 w-[120px] truncate ">
        <input
          type="password"
          placeholder=""
          minLength={1}
          className="border border-gray-300 rounded p-1 w-full"
          onChange={(e) => setApikey(e.target.value)}
        />
      </td>
      <td className="border border-black p-2 w-[120px] truncate ">
        {metadatas.map((metadata, idx) => (
          <div key={idx} className="flex flex-row mb-2">
            <input
              type="text"
              className="border border-gray-300 rounded p-1 w-1/4 mr-2"
              value={metadata.columnName}
              placeholder=""
              onChange={(e) =>
                handleMetadataChange(idx, "columnName", e.target.value)
              }
            />
            <input
              type="text"
              className="border border-gray-300 rounded p-1 w-1/4 mr-2"
              value={metadata.description}
              placeholder=""
              onChange={(e) =>
                handleMetadataChange(idx, "description", e.target.value)
              }
            />
            <select
              name="type"
              value={metadata.type}
              onChange={(e) =>
                handleMetadataChange(idx, "type", e.target.value)
              }
            >
              <option value="" disabled>
                선택 안함
              </option>
              {columnDataTypes &&
                columnDataTypes.map((type, idx) => (
                  <option key={`type-${idx}`} value={type}>
                    {type}
                  </option>
                ))}
            </select>
            <input
              type="text"
              className="border border-gray-300 rounded p-1 w-1/4 mx-2"
              value={metadata.example}
              placeholder=""
              onChange={(e) =>
                handleMetadataChange(idx, "example", e.target.value)
              }
            />
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
