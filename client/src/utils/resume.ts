import { Resume, ResumeRaw } from "@/types";

// string으로 오는 analyze_result와 question_list를 파싱
export const parseResumeData = (raw: ResumeRaw): Resume => {
  return {
    ...raw,
    analyze_result: raw.analyze_result ? JSON.parse(raw.analyze_result) : null,
    question_list: raw.question_list ? JSON.parse(raw.question_list) : null,
  };
};

export const parseResumesData = (rawResumes: ResumeRaw[]): Resume[] => {
  return rawResumes.map(parseResumeData);
};
