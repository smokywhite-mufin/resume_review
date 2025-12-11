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

