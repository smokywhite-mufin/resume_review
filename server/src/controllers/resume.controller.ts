import { Request, Response } from "express";
import * as pdfService from "../services/pdf.service";
import * as aiService from "../services/ai.service";
import * as applicantRepository from "../repositories/applicant.repository";
import * as resumeRepository from "../repositories/resume.repository";
import {
  RESUME_ANALYSIS_SYSTEM_PROMPT,
  INTERVIEW_QUESTION_SYSTEM_PROMPT,
  JOB_REQUIREMENTS,
} from "../constants/prompts";

export const uploadResume = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const pdfPath = req.file.path;

  try {
    const fullText = await pdfService.extractTextFromPdf(pdfPath);
    const { name, phoneNumber } = pdfService.parseApplicantInfo(fullText);

    const now = new Date().toISOString();

    const applicantId = await applicantRepository.createApplicant(
      name,
      phoneNumber,
      now
    );

    const resumeId = await resumeRepository.createResume(
      applicantId,
      pdfPath,
      now
    );

    res.status(200).json({
      message: "File uploaded successfully",
      name: name,
      resume_id: resumeId,
      applicant_id: applicantId,
      created_at: now,
    });
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const analyzeResume = async (req: Request, res: Response) => {
  const resumeId = req.params.resumeId;

  try {
    const resume = await resumeRepository.findResumeById(resumeId);

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const fullText = await pdfService.extractTextFromPdf(resume.file_path);

    const analyzeResult = await aiService.callGroq([
      {
        role: "system",
        content: RESUME_ANALYSIS_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `이력서 내용:\n${fullText}`,
      },
    ]);
    const analyzeResultJson = JSON.parse(analyzeResult);

    const questionList = await aiService.callGroq([
      {
        role: "system",
        content: INTERVIEW_QUESTION_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `지원자 이력서 분석 내용: ${JSON.stringify(
          analyzeResultJson,
          null,
          2
        )}
            
            회사 요구사항: ${JOB_REQUIREMENTS}
            `,
      },
    ]);
    const questionListJson = JSON.parse(questionList);

    const now = new Date().toISOString();

    await resumeRepository.updateResumeAnalysis(
      resumeId,
      analyzeResultJson,
      questionListJson,
      now
    );

    res.status(200).json({
      message: "Resume analyzed successfully",
      data: {
        analyzeResultJson,
        questionListJson,
        updated_at: now,
      },
    });
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllResumes = async (req: Request, res: Response) => {
  try {
    const resumes = await resumeRepository.findAllResumes();
    res.status(200).json(resumes);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

