"use client";

import {
  deleteDataInfoById,
  insertDataInfo,
  updateDataInfoById,
} from "@/actions/serviceData";
import { columnDataTypes } from "@/lib/columnDataTypes";
import { DataInfo, Metadata } from "@/utils/types";
import { useState } from "react";

type DataInfoEditProps = {
  serviceId: string;
  dataInfo: DataInfo;
};

export default function DataInfoEdit({
  serviceId,
  dataInfo,
}: DataInfoEditProps) {
  const [title, setTitle] = useState(dataInfo.title);
  const [url, setUrl] = useState(dataInfo.url);
  const [apikey, setApikey] = useState(dataInfo.apikey);
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

  const handleRegister = async () => {
    setIsLoading({ ...isLoading, create: true });
    const response = await insertDataInfo(
      serviceId,
      title,
      url,
      apikey,
      metadatas
    );

    setIsError({ ...isError, create: !response });
    setIsLoading({ ...isLoading, create: false });
  };

  const handleEdit = async () => {
    setIsLoading({ ...isLoading, update: true });
    const response = await updateDataInfoById(
      dataInfo.id,
      title,
      url,
      apikey,
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
          onChange={(e) => setTitle(e.target.value)}
        />
      </td>
      <td className="border border-black p-2 w-[120px] truncate ">
        <input
          name="url"
          defaultValue={dataInfo.url}
          onChange={(e) => handleUrlChange(e.target.value)}
        />
      </td>
      <td className="border border-black p-2 w-[120px] truncate">
        <input
          name="apikey"
          defaultValue={dataInfo.apikey}
          onChange={(e) => setApikey(e.target.value)}
        />
      </td>
      <td className="border border-black p-2 w-[600px]">
        {metadatas.map((metadata, idx) => (
          <div key={idx} className="flex flex-row mb-2">
            <input
              type="text"
              className="border border-gray-300 rounded p-1 w-1/4 mr-2"
              defaultValue={metadata.columnName}
              onChange={(e) =>
                handleMetadataChange(idx, "columnName", e.target.value)
              }
            />
            <input
              type="text"
              className="border border-gray-300 rounded p-1 w-1/4 mr-2"
              defaultValue={metadata.description}
              onChange={(e) =>
                handleMetadataChange(idx, "description", e.target.value)
              }
            />
            <select
              name="type"
              defaultValue={metadata.type}
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
            <input
              type="text"
              className="border border-gray-300 rounded p-1 w-1/4 mx-2"
              defaultValue={metadata.example}
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
