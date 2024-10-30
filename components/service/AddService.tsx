"use client";

import { insertService } from "@/actions/service";
import { FormEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { MAX_SERVICE_NAME } from "@/utils/constant";

export default function AddService() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    let inputName = formData.get("name") as string;
    if (inputName.length >= MAX_SERVICE_NAME) {
      setError("128자를 넘을 수 없습니다.");
      return;
    }
    const response = await insertService(formData);
    if (!response) {
      setError("저장에 실패했습니다.");
    } else {
      setError(null);
      setShowForm(!response);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={showForm} onOpenChange={setShowForm}>
      <DialogTrigger className="mx-8 my-8 w-[100px] h-[20px] text-white text-[10px] font-medium rounded-full bg-[#5C5C5C]">
        + New Project
      </DialogTrigger>
      <DialogContent
        className="bg-white border-none rounded-full sm:max-w-[425px]"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>프로젝트 만들기</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col items-end gap-3">
          <div className="w-full">
            <label className="font-medium text-[12px]">프로젝트 이름</label>
            <input
              type="text"
              name="name"
              minLength={1}
              placeholder="프로젝트 이름을 입력해주세요."
              maxLength={MAX_SERVICE_NAME}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded py-1 px-2 w-full placeholder:text-[12px]"
            />
            <p className="w-full text-[#B6B6B6] text-[11px] text-right">
              {name.length}/{MAX_SERVICE_NAME}
            </p>
            {error && <p className="text-red-400 text-[12px]">{error}</p>}
          </div>
          <button
            type="submit"
            className="bg-[#D9D9D9] text-[#494949] text-[9px] p-1 w-[60px] rounded-full hover:bg-[#6C6C6C] hover:text-white"
            disabled={isLoading}
          >
            {isLoading ? "생성 중.." : "생성하기"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
