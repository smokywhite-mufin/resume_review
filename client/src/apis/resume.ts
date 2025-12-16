import defaultInstance from "@/libs/axios";
import {
  AnalyzeResponse,
  GetAllResumesResponse,
  SuccessResponse,
  UploadResponse,
} from "@/types";

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

// 이력서 분석 api
export const analyzeResume = async (
  resumeId: number
): Promise<AnalyzeResponse> => {
  const response = await defaultInstance.post<AnalyzeResponse>(
    `/resumes/${resumeId}/analyze`
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

// 이력서 삭제 api
export const deleteResume = async (
  resumeId: number
): Promise<SuccessResponse> => {
  const response = await defaultInstance.delete<SuccessResponse>(
    `/resumes/${resumeId}`
  );
  return response.data;
};

// 이력서 전체 삭제 api
export const deleteAllResumes = async (): Promise<SuccessResponse> => {
  const response = await defaultInstance.delete<SuccessResponse>("/resumes");
  return response.data;
};
