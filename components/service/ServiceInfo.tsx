"use client";

import { deleteServiceById, updateServiceById } from "@/actions/service";
import { ServiceWithCreatedAt } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ServiceInfoProps = {
  serviceInfo: ServiceWithCreatedAt | null;
};

export default function ServiceInfo({ serviceInfo }: ServiceInfoProps) {
  const [showEdit, setShowEdit] = useState(false);
  const router = useRouter();

  if (!serviceInfo) {
    return <div>서비스가 존재하지 않습니다.</div>;
  }

  const handleShowEdit = () => {
    setShowEdit(!showEdit);
  };

  const handleEdit = async (formData: FormData) => {
    const response = await updateServiceById(serviceInfo.id, formData);
    if (response) {
      handleShowEdit();
    }
  };

  const handleDelete = async () => {
    const result = confirm("정말 삭제하시겠어요?");
    if (result) {
      const response = await deleteServiceById(serviceInfo.id);
      if (response) {
        router.replace("/dashboard");
      }
    }
  };

  return (
    <div>
      <h1>{serviceInfo.name}</h1>
      <button onClick={handleShowEdit} className="bg-blue-400 text-white p-2">
        서비스 편집
      </button>
      {showEdit && (
        <form action={handleEdit}>
          <label htmlFor="name">서비스 명</label>
          <input
            name="name"
            defaultValue={serviceInfo.name}
            className="border border-gray-300 rounded p-1 mr-2"
          />
          <button type="submit" className="bg-green-400 text-white p-2">
            저장
          </button>
        </form>
      )}
      <button onClick={handleDelete} className="bg-red-400 text-white p-2">
        서비스 삭제
      </button>
    </div>
  );
}
