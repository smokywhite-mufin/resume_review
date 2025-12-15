import { RunResult } from "sqlite3";
import { Resume } from "../models/Resume";

export interface Messages {
  role: "system" | "user";
  content: string | string[];
}

export interface UploadResponse {
  message: string;
  name: string;
  resume_id: number;
  applicant_id: number;
  created_at: string;
}

export interface QuestionListJson {
  questions: string[];
}

export interface AnalyzeResponse {
  message: string;
  data: {
    analyzeResultJson: object;
    questionListJson: object;
    updated_at: string;
  };
}

export interface CursorParams {
  updatedAt: string;
  resumeId: number;
}

export interface NextCursor {
  updatedAt: string;
  resumeId: number;
}

export interface GetAllResumesResponse {
  data: Resume[];
  nextCursor: NextCursor | null;
}

export interface ServerError {
  error: string;
}

export interface SuccessResponse {
  message: string;
}
export { RunResult };
