import { dbRun } from "../config/database";

export const createApplicant = async (
  name: string,
  phoneNumber: string,
  now: string
): Promise<number> => {
  const result = await dbRun(
    `INSERT INTO applicants (name, phoneNumber, created_at) VALUES (?, ?, ?)`,
    [name, phoneNumber, now]
  );
  return result.lastID;
};

export const removeApplicant = async (applicantId:number): Promise<void> => {
  await dbRun(`DELETE FROM applicants WHERE applicant_id = ?`, [applicantId]);
}

export const removeAllApplicants = async (): Promise<void> => {
  await dbRun(`DELETE FROM applicants`);
  await dbRun(`Update sqlite_sequence SET seq = 0 WHERE name = 'applicants'`);
}

