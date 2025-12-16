import defaultInstance from "@/libs/axios";
import { UploadResponse } from "@/types";

// 파일 업로드 api
export const uploadResume = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await defaultInstance.post<UploadResponse>(
    "/resume/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
