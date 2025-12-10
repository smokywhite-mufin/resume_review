export interface Resume {
  resume_id: number;
  applicant_id: number;
  file_path: string;
  analyze_result?: string;
  question_list?: string;
  created_at: string;
  updated_at: string;
}

export interface Messages {
  role: "system" | "user";
  content: string | string[];
}
