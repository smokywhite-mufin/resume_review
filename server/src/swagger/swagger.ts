import path from "path";
import swaggerAutogen from "swagger-autogen";

const outputFile = path.join(__dirname, "../swagger/swagger.json");
const endpointsFiles = ["./src/routes/resume.routes.ts"];

const doc = {
  info: {
    title: "Resume Analysis API",
    description: "이력서 분석 API - 이력서 업로드, AI 분석, 면접 질문 생성",
    version: "1.0.0",
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http"],
  tags: [
    {
      name: "Resume",
      description: "이력서 관련 API",
    },
  ],
};

swaggerAutogen(outputFile, endpointsFiles, doc);
