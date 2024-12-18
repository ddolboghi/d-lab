"use client";

import {
  deleteExperimentById,
  updateExperimentById,
} from "@/actions/experiment";
import { ExperimentForUpdate } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import EditPencil from "../icons/EditPencil";
import { Trash2Icon } from "lucide-react";
import {
  MAX_EXPERIMENT_OVERVIEW,
  MAX_EXPERIMENT_TITLE,
} from "@/utils/constant";

type ExperimentEditProps = {
  editContent: ExperimentForUpdate;
  isEnd: boolean;
};

export default function ExperimentEdit({
  editContent,
  isEnd,
}: ExperimentEditProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(editContent.title);
  const [overview, setOverview] = useState(editContent.overview);
  const router = useRouter();

  const handleShowEdit = () => {
    setShowEdit(!showEdit);
    setError(null);
  };

  const handleEdit = async (formData: FormData) => {
    if (isEnd) {
      setError("실험이 종료되어 수정할 수 없습니다.");
      return;
    }

    const updatedTitle = formData.get("title");
    const updatedOverview = formData.get("overview");

    if (String(updatedTitle).length > MAX_EXPERIMENT_TITLE) {
      setError("제목은 128자를 넘을 수 없습니다.");
    }

    if (String(updatedOverview).length > MAX_EXPERIMENT_OVERVIEW) {
      setError("설명은 500자를 넘을 수 없습니다.");
    }

    const response = await updateExperimentById(editContent.id, formData);
    if (response) {
      setError(null);
      handleShowEdit();
    } else {
      setError("수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    const result = confirm("정말 삭제하시겠어요?");
    if (result) {
      const response = await deleteExperimentById(editContent.id);
      if (response) {
        router.replace("/dashboard");
      } else {
        setError("삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div className="flex flex-row items-center gap-1">
      {!isEnd && (
        <Dialog open={showEdit} onOpenChange={setShowEdit}>
          <DialogTrigger
            className="bg-[#d9d9d9] text-[#5c5c5c] font-normal text-[12px] rounded-full flex flex-row items-center justify-center gap-2 w-[70px] py-1 px-2 hover:bg-[#6C6C6C] hover:text-white group"
            disabled={isEnd}
          >
            편집
            <EditPencil className="fill-[#5c5c5c] group-hover:fill-white" />
          </DialogTrigger>
          <DialogContent className="bg-white border-none rounded-full sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>실험 수정</DialogTitle>
            </DialogHeader>
            <form action={handleEdit} className="flex flex-col items-end gap-3">
              <section className="w-full">
                <label className="font-medium text-[12px]" htmlFor="title">
                  실험 제목
                </label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  maxLength={MAX_EXPERIMENT_TITLE}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-[12px] border border-gray-300 rounded py-1 px-2 w-full placeholder:text-[12px]"
                />
                <p className="text-[#B6B6B6] text-[10px] w-full text-right">
                  {title.length}/{MAX_EXPERIMENT_TITLE}
                </p>
              </section>
              <section className="w-full">
                <label className="font-medium text-[12px]" htmlFor="overview">
                  실험 설명
                </label>
                <textarea
                  typeof="text"
                  name="overview"
                  value={overview}
                  maxLength={MAX_EXPERIMENT_OVERVIEW}
                  onChange={(e) => setOverview(e.target.value)}
                  className="text-[12px] border border-gray-300 rounded py-1 px-2 w-full placeholder:text-[12px]"
                />
                <p className="text-[#B6B6B6] text-[10px] w-full text-right">
                  {overview.length}/{MAX_EXPERIMENT_OVERVIEW}
                </p>
              </section>
              <section className="w-full">
                <label className="font-medium text-[12px]" htmlFor="goal">
                  목표 수치
                </label>
                <input
                  name="goal"
                  type="text"
                  defaultValue={editContent.goal}
                  className="text-[12px] border border-gray-300 rounded py-1 px-2 w-full placeholder:text-[12px]"
                />
              </section>
              {error && <p className="text-red-400 text-[12px]">{error}</p>}
              <button
                type="submit"
                className="bg-[#D9D9D9] text-[#494949] text-[9px] p-1 w-[60px] rounded-full hover:bg-[#6C6C6C] hover:text-white"
              >
                수정하기
              </button>
            </form>
          </DialogContent>
        </Dialog>
      )}
      <button
        onClick={handleDelete}
        className="bg-red-400 text-white hover:bg-red-200 hover:text-black rounded-full text-[12px] w-[70px] py-1 pl-2 flex flex-row items-center justify-center gap-1"
      >
        삭제
        <Trash2Icon className="h-[15px]" />
      </button>
    </div>
  );
}
