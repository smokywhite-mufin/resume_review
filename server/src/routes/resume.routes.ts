import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import * as resumeController from "../controllers/resume.controller";

const router = Router();

router.post(
  "/resume/upload",
  upload.single("file"),
  resumeController.uploadResume
);
router.post("/resumes/:resumeId/analyze", resumeController.analyzeResume);
router.get("/resumes", resumeController.getAllResumes);

router.delete("/resumes/:resumeId", resumeController.removeResume);
router.delete("/resumes", resumeController.removeAllResumes);

export default router;
