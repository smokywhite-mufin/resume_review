export type UploadResponse = {
  message: string;
  name: string;
  resume_id: number;
  applicant_id: number;
  created_at: string;
};

export type AnalyzeResult = {
  이름: string;
  생년월일: string;
  이메일: string;
  연락처: string;
  "깃허브 주소": string | null;
  "그 이외의 주소": string | null;
  기술스택: string[];
  경력: {
    "프로젝트 이름": string;
    "담당 역할": string[];
  }[];
  점수: number;
  강점: string[];
  취약점: string[];
};

export type QuestionList = {
  "기술 질문": string[];
};

// 서버에서 오는 원본 Resume 타입 (string으로 저장)
export type ResumeRaw = {
  resume_id: number;
  applicant_id: number;
  file_path: string;
  analyze_result: string;
  question_list: string;
  created_at: string;
  updated_at: string;
};

export type Resume = {
  resume_id: number;
  applicant_id: number;
  file_path: string;
  analyze_result: AnalyzeResult | null;
  question_list: QuestionList | null;
  created_at: string;
  updated_at: string;
};

export type NextCursor = {
  updatedAt: string;
  resumeId: number;
};

export type GetAllResumesResponse = {
  data: ResumeRaw[];
  nextCursor: NextCursor | null;
};
