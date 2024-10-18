"use client";

import {
  deleteExperimentById,
  updateExperimentById,
} from "@/actions/experiment";
import { ExperimentForUpdate } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ExperimentEditProps = {
  serviceId: string;
  editContent: ExperimentForUpdate;
  isEnd: boolean;
};

export default function ExperimentEdit({
  serviceId,
  editContent,
  isEnd,
}: ExperimentEditProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleShowEdit = () => {
    setShowEdit(!showEdit);
  };

  const handleEdit = async (formData: FormData) => {
    if (isEnd) {
      return;
    }
    const response = await updateExperimentById(editContent.id, formData);
    setIsError(!response);
    if (response) {
      handleShowEdit();
    }
  };

  const handleDelete = async () => {
    const result = confirm("정말 삭제하시겠어요?");
    if (result) {
      const response = await deleteExperimentById(editContent.id);
      setIsError(!response);
      if (response) {
        router.replace(`/dashboard/${serviceId}`);
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleShowEdit}
        className="bg-blue-400 text-white p-2"
        disabled={isEnd}
      >
        편집하기
      </button>
      <button onClick={handleDelete} className="bg-red-400 text-white p-2">
        삭제하기
      </button>
      {showEdit && (
        <form action={handleEdit}>
          <section>
            <label htmlFor="title">실험 제목</label>
            <input
              name="title"
              defaultValue={editContent.title}
              className="border border-gray-300 rounded p-1 w-1/4 mr-2"
            />
          </section>
          <section>
            <label htmlFor="overview">실험 개요</label>
            <textarea
              name="overview"
              defaultValue={editContent.overview}
              className="border border-gray-300 rounded p-1 w-1/4 mr-2"
            />
          </section>
          <section>
            <label htmlFor="goal">목표 수치</label>
            <input
              name="goal"
              defaultValue={editContent.goal}
              className="border border-gray-300 rounded p-1 w-1/4 mr-2"
            />
          </section>
          <section>
            <label htmlFor="conclusion">결론</label>
            <textarea
              name="conclusion"
              defaultValue={editContent.conclusion}
              className="border border-gray-300 rounded p-1 w-1/4 mr-2"
            />
          </section>
          <button type="submit" className="bg-green-400 text-white p-2">
            저장하기
          </button>
          {isError && <p>수정에 실패했습니다.</p>}
        </form>
      )}
    </div>
  );
}
