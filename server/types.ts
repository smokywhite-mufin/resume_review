export interface Resume {
  resume_id: number;
  applicant_id: number;
  file_path: string;
}

export interface Messages {
  role: "system" | "user";
  content: string | string[];
}
