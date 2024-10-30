"use client";

import {
  deleteDataInfoById,
  insertDataInfo,
  updateDataInfoById,
} from "@/actions/serviceData";
import { columnDataTypes } from "@/lib/columnDataTypes";
import { DataInfo, headerPair, Metadata } from "@/utils/types";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";

type DataInfoAddProps = {
  serviceId?: string;
  dataInfo?: DataInfo;
};

export default function DataInfoAdd({ serviceId, dataInfo }: DataInfoAddProps) {
  const [title, setTitle] = useState(dataInfo ? dataInfo.title : "");
  const [url, setUrl] = useState(dataInfo ? dataInfo.url : "");
  const [headerPairs, setHeaderPairs] = useState<headerPair[]>(
    dataInfo ? dataInfo.headers : [{ id: Date.now(), key: "", value: "" }]
  );
  const [metadatas, setMetadatas] = useState<Metadata[]>(
    dataInfo
      ? dataInfo.metadata
      : [
          {
            columnName: "데이터 생성 시간은 필수 값입니다.",
            description: "created_at",
            type: "string",
            example: "2024-09-30 01:46:43.775468+00",
          },
        ]
  );
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

  const handleRegister = async () => {
    if (!serviceId || serviceId === "0") {
      return;
    }
    setIsLoading({ ...isLoading, create: true });
    const response = await insertDataInfo(
      serviceId,
      title,
      url,
      headerPairs,
      metadatas
    );

    setIsError({ ...isError, create: !response });
    setTitle("");
    setUrl("");
    setHeaderPairs([{ id: Date.now(), key: "", value: "" }]);
    setMetadatas([
      {
        columnName: "데이터 생성 시간은 필수 값입니다.",
        description: "created_at",
        type: "string",
        example: "2024-09-30 01:46:43.775468+00",
      },
    ]);

    setIsLoading({ ...isLoading, create: false });
  };

  const handleEdit = async () => {
    if (!dataInfo) return;
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
    if (!dataInfo) return;
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
          type="text"
          name="title"
          value={title}
          className="text-[12px] pl-1 border border-gray-300 rounded p-1 w-full"
          onChange={(e) => setTitle(e.target.value)}
        />
      </td>
      <td className="border border-black p-2 w-[120px] truncate ">
        <input
          type="text"
          name="apiEndpoint"
          value={url}
          placeholder="https://..."
          className="text-[12px] pl-1 border border-gray-300 rounded p-1 w-full"
          onChange={(e) => handleUrlChange(e.target.value)}
        />
      </td>
      <td className="border border-black p-2 w-[120px] truncate ">
        {headerPairs.map((headerPair) => (
          <div key={headerPair.id} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              value={headerPair.key}
              className="text-[12px] pl-1 border border-gray-300 rounded truncate"
              onChange={(e) => updatePair(headerPair.id, "key", e.target.value)}
              placeholder="Key"
            />
            <input
              type="text"
              value={headerPair.value}
              className="text-[12px] pl-1 border border-gray-300 rounded truncate"
              onChange={(e) =>
                updatePair(headerPair.id, "value", e.target.value)
              }
              placeholder="Value"
            />
            <button
              onClick={() => removePair(headerPair.id)}
              className="bg-red-500 text-white rounded p-1 w-[20px] h-auto ml-2"
            >
              X
            </button>
          </div>
        ))}
        <button
          onClick={addPair}
          className="bg-blue-500 rounded text-white w-[30px] h-[20px] leading-3 p-1"
        >
          +
        </button>
      </td>
      <td className="border border-black p-2 w-[120px] truncate">
        {metadatas.map((metadata, idx) => (
          <div
            key={idx}
            className="flex flex-row items-center border rounded p-2 mb-1 w-[300px]"
          >
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-2">
                <label className="text-[14px]">데이터 이름(컬럼명)</label>
                <input
                  type="text"
                  className="text-[12px] border border-gray-300 rounded pl-1"
                  value={metadata.columnName}
                  placeholder=""
                  onChange={(e) =>
                    handleMetadataChange(idx, "columnName", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2">
                <label className="text-[14px]">설명</label>
                <input
                  type="text"
                  className={`${metadata.description === "created_at" && "bg-gray-200"} border border-gray-300 rounded text-[12px] pl-1`}
                  value={metadata.description}
                  readOnly={
                    metadata.description === "created_at" ? true : false
                  }
                  onChange={(e) =>
                    handleMetadataChange(idx, "description", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2">
                <label className="text-[14px]">데이터 타입</label>
                <select
                  name="type"
                  value={metadata.type}
                  disabled={
                    metadata.description === "created_at" ? true : false
                  }
                  onChange={(e) =>
                    handleMetadataChange(idx, "type", e.target.value)
                  }
                  className="border border-gray-300 rounded text-[12px]"
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
              <div className="grid grid-cols-2">
                <label className="text-[14px]">예시</label>
                <input
                  type="text"
                  className="text-[12px] border border-gray-300 rounded pl-1"
                  value={metadata.example}
                  placeholder=""
                  onChange={(e) =>
                    handleMetadataChange(idx, "example", e.target.value)
                  }
                />
              </div>
            </div>
            {metadata.description !== "created_at" && (
              <button
                className="bg-red-500 text-white rounded p-1 w-[20px] h-auto ml-2"
                onClick={() => deleteMetadata(idx)}
              >
                X
              </button>
            )}
          </div>
        ))}
        <button
          className="bg-blue-500 rounded text-white w-[30px] h-[20px] leading-3 p-1"
          onClick={addMetadata}
        >
          +
        </button>
      </td>
      <td className="border border-black p-2 w-[120px]">
        {dataInfo ? new Date(dataInfo.created_at).toLocaleString() : "-"}
      </td>
      <td className="border border-black">
        {serviceId && (
          <button
            className={`bg-green-400 text-white rounded p-2 ${isLoading.create && "bg-[#CBCBCB]"}`}
            onClick={handleRegister}
            disabled={isLoading.create}
          >
            {isLoading.create ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              "저장"
            )}
          </button>
        )}
        {dataInfo && (
          <>
            <button
              onClick={handleEdit}
              className={`bg-sky-500 text-white rounded p-2 ${isLoading.update && "bg-[#CBCBCB]"}`}
              disabled={isLoading.update}
            >
              {isLoading.update ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "수정"
              )}
            </button>
            <button
              onClick={handleDelete}
              className={`bg-red-500 text-white rounded p-2 ${isLoading.delete && "bg-[#CBCBCB]"}`}
              disabled={isLoading.delete}
            >
              {isLoading.delete ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "삭제"
              )}
            </button>
          </>
        )}
        {isError.create && (
          <p className="text-red-400 text-[11px]">저장에 실패했습니다.</p>
        )}
        {isError.update && (
          <p className="text-red-400 text-[11px]">수정에 실패했습니다.</p>
        )}
        {isError.delete && (
          <p className="text-red-400 text-[11px]">삭제에 실패했습니다.</p>
        )}
      </td>
    </tr>
  );
}
