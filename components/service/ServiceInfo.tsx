"use client";

import { deleteServiceById, updateServiceById } from "@/actions/service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { ServiceWithId } from "@/utils/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { MAX_SERVICE_NAME } from "@/utils/constant";

type ServiceInfoProps = {
  service: ServiceWithId;
};

export default function ServiceInfo({ service }: ServiceInfoProps) {
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async (formData: FormData) => {
    const inputName = formData.get("name") as string;
    if (inputName.length >= MAX_SERVICE_NAME) {
      setError("128자를 넘을 수 없습니다.");
      return;
    }
    const response = await updateServiceById(service.id, formData);
    if (!response) {
      setError("수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    const result = confirm("정말 삭제하시겠어요?");
    if (result) {
      const response = await deleteServiceById(service.id);
      if (!response) {
        setError("삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center pt-4">
        <h1 className="flex-grow text-left">{service.name}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-row gap-2 items-center">
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border-none rounded-[6px]">
            <Dialog>
              <DialogTrigger className="text-[14px] p-2 w-full text-left">
                편집
              </DialogTrigger>
              <DialogContent className="bg-white rounded-full sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>프로젝트 수정하기</DialogTitle>
                </DialogHeader>
                <form
                  action={handleEdit}
                  className="flex flex-col items-end gap-3"
                >
                  <div className="w-full">
                    <label className="font-medium text-[12px]">
                      프로젝트 이름
                    </label>
                    <input
                      type="text"
                      name="name"
                      minLength={1}
                      defaultValue={service.name}
                      placeholder={service.name}
                      maxLength={128}
                      className="border border-gray-300 rounded py-1 px-2 w-full placeholder:text-[12px]"
                    />
                    {error && (
                      <p className="text-red-400 text-[12px]">{error}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-[#D9D9D9] text-[#494949] text-[9px] p-1 w-[60px] rounded-full hover:bg-[#6C6C6C] hover:text-white"
                  >
                    수정하기
                  </button>
                </form>
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete}>삭제</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
