"use client";

import { insertService } from "@/actions/service";
import { FormEvent, useState } from "react";

export default function AddService() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const response = await insertService(formData);
    if (!response) {
      setError("저장에 실패했습니다.");
    } else {
      setError(null);
    }
    setIsLoading(false);
  };

  return (
    <div>
      {error && <p className="text-red-400">{error}</p>}
      <form onSubmit={onSubmit}>
        <label>서비스명</label>
        <input
          type="text"
          name="name"
          minLength={1}
          className="border border-gray-300 rounded p-1 w-1/4 mx-2"
        />
        <button
          type="submit"
          className="bg-green-400 text-white p-2"
          disabled={isLoading}
        >
          {isLoading ? "저장 중.." : "추가"}
        </button>
      </form>
    </div>
  );
}
