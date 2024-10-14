"use client";

import { insertDataInfo } from "@/actions/registerData";
import { columnDataTypes } from "@/lib/ColumnDataTypes";
import { Metadata, ServiceWithId } from "@/utils/types";
import { useState } from "react";

type DataInfoRegisterProps = {
  services: ServiceWithId[] | null;
};

export default function DataInfoRegister({ services }: DataInfoRegisterProps) {
  const [title, setTitle] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [url, setUrl] = useState("");
  const [apikey, setApikey] = useState("");
  const [metadatas, setMetadatas] = useState<Metadata[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addMetadata = () => {
    const newMetadatas = [
      ...metadatas,
      {
        name: "",
        type: "",
        example: "",
      },
    ];
    setMetadatas(newMetadatas);
  };

  const handleMetadataChange = (idx: number, key: string, value: string) => {
    const newMetadatas = [...metadatas];
    const newMetadata = newMetadatas[idx];
    if (key === "name") {
      newMetadata.name = value;
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
    if (selectedServiceId.length < 1) {
      return;
    }
    setIsLoading(true);
    const response = await insertDataInfo(
      selectedServiceId,
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
    <div>
      <label htmlFor="services">서비스</label>
      <select
        name="services"
        value={selectedServiceId}
        onChange={(e) => setSelectedServiceId(e.target.value)}
      >
        <option value="" disabled>
          서비스를 선택하세요
        </option>
        {services &&
          services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
      </select>
      <label htmlFor="title">데이터 명</label>
      <input
        type="text"
        name="title"
        value={title}
        className="border border-gray-300 rounded p-1 w-1/4 mx-2"
        onChange={(e) => setTitle(e.target.value)}
      />
      <label htmlFor="apiEndpoint" className="w-1/4">
        API Endpoint
      </label>
      <input
        type="text"
        name="apiEndpoint"
        placeholder="https://..."
        className="border border-gray-300 rounded p-1 w-1/4 mx-2"
        onChange={(e) => handleUrlChange(e.target.value)}
      />
      <label className="w-1/4">api key</label>
      <input
        type="password"
        placeholder=""
        minLength={1}
        className="border border-gray-300 rounded p-1 w-1/4 mx-2"
        onChange={(e) => setApikey(e.target.value)}
      />
      <div className="flex flex-col mb-2">
        <div className="flex flex-row mb-1">
          <label className="w-1/4">컬럼 명</label>
          <label className="w-1/4">데이터 타입</label>
          <label className="w-1/4">예시</label>
        </div>
        {metadatas.map((metadata, idx) => (
          <div key={idx} className="flex flex-row mb-2">
            <input
              type="text"
              className="border border-gray-300 rounded p-1 w-1/4 mr-2"
              value={metadata.name}
              placeholder=""
              onChange={(e) =>
                handleMetadataChange(idx, "name", e.target.value)
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
                -
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
        <button className="bg-blue-500 text-white p-2" onClick={addMetadata}>
          추가하기
        </button>
      </div>
      <button
        className="bg-green-400 text-white p-2"
        onClick={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? "저장 중.." : "데이터 등록하기"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
