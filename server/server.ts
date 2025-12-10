import { Request, Response } from "express";
import { PDFParse, TextResult } from "pdf-parse";
import { RunResult } from "sqlite3";
import express from "express";
import cors from "cors";
import multer from "Multer";
import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs/promises";
import dotenv from "dotenv";
import { Messages, Resume } from "./types";

dotenv.config();

const app = express();
const PORT = 8000;

console.log("Server starting...");
app.use(cors());

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "uploads/");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const db = new sqlite3.Database("database.db");

const dbRun = (sql: string, params: any[] = []): Promise<RunResult> => {
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

const dbGet = <T>(sql: string, params: any[] = []): Promise<T> => {
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

const dbGetAll = <T>(sql: string, params: any[] = []): Promise<T[]> => {
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

(async () => {
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
            analyze_result TEXT,
            question_list TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (applicant_id) REFERENCES applicants (applicant_id)
        )`);
  } catch (err) {
    console.error("Error initializing database tables:", err);
  }
})();

app.post(
  "/api/resume/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pdfPath = req.file.path;

    try {
      const data = await fs.readFile(pdfPath);
      const pdfParser = new PDFParse({ data: data });
      pdfParser.getText().then(async (pdfData: TextResult) => {
        const fullText = pdfData.text;

        const nameRegex = /(?:이름|성명|Name|name)\s*[:：]\s*(.+?)(?:\n|$)/;
        const nameMatches = fullText.match(nameRegex);
        const name = nameMatches ? nameMatches[1].trim() : "unknown";

        const phoneNumberRegex =
          /(?:전화번호|연락처|휴대폰|휴대전화|Phone|Mobile|phone|mobile|Tel|tel)\s*[:：]\s*(.+?)(?:\n|$)/;
        const phoneNumberMatches = fullText.match(phoneNumberRegex);
        const phoneNumber = phoneNumberMatches
          ? phoneNumberMatches[1].trim()
          : "unknown";

        const now = new Date().toISOString();

        const applicantResult = await dbRun(
          `INSERT INTO applicants (name, phoneNumber, created_at) VALUES (?, ?, ?)`,
          [name, phoneNumber, now]
        );
        const applicantId = applicantResult.lastID;

        const resumeResult = await dbRun(
          `INSERT INTO resumes (applicant_id, file_path, created_at, updated_at) VALUES (?, ?, ?, ?)`,
          [applicantId, pdfPath, now, now]
        );
        const resumeId = resumeResult.lastID;

        res.status(200).json({
          message: "File uploaded successfully",
          name: name,
          resume_id: resumeId,
          applicant_id: applicantId,
          created_at: now,
        });
      });
    } catch (error: unknown) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

app.post(
  "/api/resumes/:resumeId/analyze",
  async (req: Request, res: Response) => {
    const resumeId = req.params.resumeId;

    try {
      const resume = await dbGet<Resume>(
        `SELECT * FROM resumes WHERE resume_id = ?`,
        [resumeId]
      );

      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      const filePath: string = resume.file_path;

      const data = await fs.readFile(filePath);
      const pdfParser = new PDFParse({ data: data });
      pdfParser.getText().then(async (pdfData: TextResult) => {
        const fullText = pdfData.text;
        const analyzeResult = await callGroq([
          {
            role: "system",
            content:
              "너는 채용 담당자야. 이력서를 분석해서 강점, 기술스택, 총점(0~100)을 JSON 형식으로 제공해줘.",
          },
          {
            role: "user",
            content: `이력서 내용:\n${fullText}`,
          },
        ]);
        const analyzeResultJson = JSON.parse(analyzeResult);

        const questionList = await callGroq([
          {
            role: "system",
            content:
              "너는 시니어 개발자이자 기술 면접관이야. 아래 이력서 분석 내용과 회사 요구사항을 참고하여 해당 지원자가 우리 회사에 적합한지 확인하는 기술 질문(총점 관련 질문 제외)만 30개 만들어서 JSON 형식으로 제공해줘.",
          },
          {
            role: "user",
            content: `지원자 이력서 분석 내용: ${JSON.stringify(
              analyzeResultJson,
              null,
              2
            )}
            
            회사 요구사항: ${"JavaScript, Node.js의 기본적 이해, HTML/CSS로 간단한 웹 페이지 구현 가능, HTTP통신과 웹이 어떻게 동작하는지에 대한 기본적인 이해"}
            `,
          },
        ]);
        const questionListJson = JSON.parse(questionList);

        const now = new Date().toISOString();

        await dbRun(
          `UPDATE resumes SET analyze_result = ?, question_list = ?, updated_at = ? WHERE resume_id = ?`,
          [
            JSON.stringify(analyzeResultJson),
            JSON.stringify(questionListJson),
            now,
            resumeId,
          ]
        );

        res.status(200).json({
          message: "Resume analyzed successfully",
          data: {
            analyzeResultJson,
            questionListJson,
            updated_at: now,
          },
        });
      });
    } catch (error: unknown) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

const callGroq = async (messages: Messages[]) => {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: 0,
        response_format: { type: "json_object" },
      }),
    }
  );

  const result = await response.json();
  return result.choices[0].message.content;
};

app.get("/api/resumes", async (req: Request, res: Response) => {
  try {
    const resumes = await dbGetAll<Resume>(
      `SELECT * FROM resumes ORDER BY updated_at DESC`
    );
    res.status(200).json(resumes);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
