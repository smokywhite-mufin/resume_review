import defaultInstance from "@/libs/axios";
import { GetAllResumesResponse, UploadResponse } from "@/types";

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

// 분석 기록 가져오는 api
export const getAllResumes = async (
  cursor: { updatedAt: string; resumeId: number } | null
): Promise<GetAllResumesResponse> => {
  const params = cursor
    ? { updatedAt: cursor.updatedAt, resumeId: cursor.resumeId }
    : {};

  const response = await defaultInstance.get<GetAllResumesResponse>(
    "/resumes",
    {
      params,
    }
  );
  return response.data;
};
