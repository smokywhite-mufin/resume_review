import { dbRun, dbGet, dbGetAll } from "../config/database";
import { Resume } from "../models/Resume";

export const createResume = async (
  applicantId: number,
  filePath: string,
  now: string
): Promise<number> => {
  const result = await dbRun(
    `INSERT INTO resumes (applicant_id, file_path, created_at, updated_at) VALUES (?, ?, ?, ?)`,
    [applicantId, filePath, now, now]
  );
  return result.lastID;
};

export const findResumeById = async (resumeId: string): Promise<Resume> => {
  return dbGet<Resume>(`SELECT * FROM resumes WHERE resume_id = ?`, [resumeId]);
};

export const findAllResumes = async (): Promise<Resume[]> => {
  return dbGetAll<Resume>(`SELECT * FROM resumes ORDER BY updated_at DESC`);
};

export const updateResumeAnalysis = async (
  resumeId: string,
  analyzeResultJson: object,
  questionListJson: object,
  now: string
): Promise<void> => {
  await dbRun(
    `UPDATE resumes SET analyze_result = ?, question_list = ?, updated_at = ? WHERE resume_id = ?`,
    [
      JSON.stringify(analyzeResultJson),
      JSON.stringify(questionListJson),
      now,
      resumeId,
    ]
  );
};

export const removeResume = async (resumeId: string): Promise<void> => {
  await dbRun(`DELETE FROM resumes WHERE resume_id = ?`, [resumeId]);
};

export const removeAllResumes = async (): Promise<void> => {
  await dbRun(`DELETE FROM resumes`);
  await dbRun(`Update sqlite_sequence SET seq = 0 WHERE name = 'resumes'`)
};
