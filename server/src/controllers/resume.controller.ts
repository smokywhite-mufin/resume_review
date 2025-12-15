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
import {
  AnalyzeResponse,
  ServerError,
  SuccessResponse,
  UploadResponse,
} from "../types";
import { Resume } from "../models/Resume";
import { deleteFile } from "../middleware/upload.middleware";

export const uploadResume = async (
  req: Request,
  res: Response<UploadResponse | ServerError>
) => {
  /*
    #swagger.tags = ['Resume']
    #swagger.summary = '이력서 업로드'
    #swagger.description = 'PDF 이력서 파일을 업로드합니다.'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['file'] = {
      in: 'formData',
      type: 'file',
      required: true,
      description: '업로드할 PDF 이력서 파일'
    }
    #swagger.responses[200] = {
      description: '업로드 성공',
      schema: {
        message: 'File uploaded successfully',
        name: '홍길동',
        resume_id: 1,
        applicant_id: 1,
        created_at: '2024-01-01T00:00:00.000Z'
      }
    }
    #swagger.responses[400] = {
      description: '파일 없음',
      schema: { error: 'No file uploaded' }
    }
    #swagger.responses[500] = {
      description: '서버 에러',
      schema: { error: '에러 메시지' }
    }
  */
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

export const analyzeResume = async (
  req: Request,
  res: Response<AnalyzeResponse | ServerError>
) => {
  /*
    #swagger.tags = ['Resume']
    #swagger.summary = '이력서 분석'
    #swagger.description = 'AI를 사용하여 이력서를 분석하고 면접 질문을 생성합니다.'
    #swagger.parameters['resumeId'] = {
      in: 'path',
      type: 'string',
      required: true,
      description: '분석할 이력서 ID'
    }
    #swagger.responses[200] = {
      description: '분석 성공',
      schema: {
        message: 'Resume analyzed successfully',
        data: {
          analyzeResultJson: {
            '이름': '홍길동',
            '생년월일': '1990.01.01',
            '이메일': 'example@email.com',
            '연락처': '010-1234-5678',
            '깃허브 주소': 'https://github.com/username',
            '그 이외의 주소': 'https://blog.example.com',
            '기술스택': ['JavaScript', 'TypeScript', 'React', 'Node.js'],
            '프로젝트': ['프로젝트 1', '프로젝트 2'],
            '강점': ['문제해결능력', '협업과 소통'],
            '총점': 85
          },
          questionListJson: {
            '기술 질문': [ 'JavaScript의 클로저에 대해 설명해주세요.', 'React Hooks에 대해 설명해주세요.']
          },
          updated_at: '2024-01-01T00:00:00.000Z'
        }
      }
    }
    #swagger.responses[404] = {
      description: '이력서를 찾을 수 없음',
      schema: { error: 'Resume not found' }
    }
    #swagger.responses[500] = {
      description: '서버 에러',
      schema: { error: '에러 메시지' }
    }
  */
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
        content: `이력서 내용:\n${fullText}
                  회사 요구사항: ${JOB_REQUIREMENTS}
                  `,
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

export const getAllResumes = async (
  req: Request,
  res: Response<Resume[] | ServerError>
) => {
  /*
    #swagger.tags = ['Resume']
    #swagger.summary = '모든 이력서 조회'
    #swagger.description = '저장된 모든 이력서 목록을 조회합니다. analyze_result와 question_list는 JSON 문자열 형태입니다.'
    #swagger.responses[200] = {
      description: '조회 성공',
      schema: [{
        resume_id: 1,
        applicant_id: 1,
        file_path: 'uploads/1234567890.pdf',
        analyze_result: '{"이름":"홍길동","생년월일":"1990.01.01","연락처":"010-1234-5678","이메일":"example@email.com","Github":"https://github.com/username","강점":["문제해결능력"],"기술스택":["JavaScript","React"],"총점":85}',
        question_list: '{"질문":[{"질문":"JavaScript의 클로저에 대해 설명해주세요.","분류":"JavaScript"}]}',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      }]
    }
    #swagger.responses[500] = {
      description: '서버 에러',
      schema: { error: '에러 메시지' }
    }
  */
  try {
    const resumes = await resumeRepository.findAllResumes();
    res.status(200).json(resumes);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getResume = async (
  req: Request,
  res: Response<Resume | ServerError>
) => {
  /*
    #swagger.tags = ['Resume']
    #swagger.summary = '이력서 조회'
    #swagger.description = '이력서를 조회합니다.'
    #swagger.parameters['resumeId'] = {
      in: 'path',
      type: 'string',
      required: true,
      description: '조회할 이력서 ID'
    }
    #swagger.responses[200] = {
      description: '조회 성공',
      schema: {
        resume_id: 1,
        applicant_id: 1,
        file_path: 'uploads/1234567890.pdf',
        analyze_result: '{"이름":"홍길동","생년월일":"1990.01.01","연락처":"010-1234-5678","이메일":"example@email.com","Github":"https://github.com/username","강점":["문제해결능력"],"기술스택":["JavaScript","React"],"총점":85}',
        question_list: '{"질문":[{"질문":"JavaScript의 클로저에 대해 설명해주세요.","분류":"JavaScript"}]}'
      }
    }
    #swagger.responses[404] = {
      description: '이력서를 찾을 수 없음',
      schema: { error: 'Resume not found' }
    }
    #swagger.responses[500] = {
      description: '서버 에러',
      schema: { error: '에러 메시지' }
    }
  */
  const resumeId = req.params.resumeId;

  try {
    const resume = await resumeRepository.findResumeById(resumeId);

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.status(200).json(resume);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};  

export const removeResume = async (
  req: Request,
  res: Response<SuccessResponse | ServerError>
) => {
  /*
    #swagger.tags = ['Resume']
    #swagger.summary = '이력서 삭제'
    #swagger.description = '이력서를 삭제합니다.'
    #swagger.parameters['resumeId'] = {
      in: 'path',
      type: 'string',
      required: true,
      description: '삭제할 이력서 ID'
    }
    #swagger.responses[200] = {
      description: '삭제 성공',
      schema: {
        message: 'Resume deleted successfully'
      }
    }
    #swagger.responses[404] = {
      description: '이력서를 찾을 수 없음',
      schema: { error: 'Resume not found' }
    }
    #swagger.responses[500] = {
      description: '서버 에러',
      schema: { error: '에러 메시지' }
    }
  */
  const resumeId = req.params.resumeId;

  try {
    const resume = await resumeRepository.findResumeById(resumeId);

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    deleteFile(resume.file_path);
    await resumeRepository.removeResume(resumeId);
    await applicantRepository.removeApplicant(resume.applicant_id);

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const removeAllResumes = async (
  req: Request,
  res: Response<SuccessResponse | ServerError>
) => {
  /*
    #swagger.tags = ['Resume']
    #swagger.summary = '이력서 전체 삭제'
    #swagger.description = '이력서를 전체 삭제합니다.'
    #swagger.responses[200] = {
      description: '삭제 성공',
      schema: {
        message: 'All resumes deleted successfully'
      }
    }
    #swagger.responses[500] = {
      description: '서버 에러',
      schema: { error: '에러 메시지' }
    }
  */
  try {
    const resumes = await resumeRepository.findAllResumes();
    resumes.map((resume) => deleteFile(resume.file_path));
    await resumeRepository.removeAllResumes();
    await applicantRepository.removeAllApplicants();
    res.status(200).json({ message: "All resumes deleted successfully" });
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};