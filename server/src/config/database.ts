import sqlite3 from "sqlite3";
import fs from "fs/promises";
import { RunResult } from "../types";

export const db = new sqlite3.Database("database.db");

export const dbRun = (sql: string, params: any[] = []): Promise<RunResult> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (this: RunResult, err: Error | null) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};

export const dbGet = <T>(sql: string, params: any[] = []): Promise<T> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err: Error | null, row: T) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

export const dbGetAll = <T>(sql: string, params: any[] = []): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err: Error | null, rows: T[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export const initializeDatabase = async (): Promise<void> => {
  try {
    await fs.mkdir("uploads", { recursive: true });

    await dbRun(`CREATE TABLE IF NOT EXISTS applicants (
            applicant_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phoneNumber TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS resumes (
            resume_id INTEGER PRIMARY KEY AUTOINCREMENT,
            applicant_id INTEGER NOT NULL,
            file_path TEXT NOT NULL,
            original_filename TEXT NOT NULL,
            analyze_result TEXT,
            question_list TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (applicant_id) REFERENCES applicants (applicant_id)
        )`);
  } catch (err) {
    console.error("Error initializing database tables:", err);
  }
};
