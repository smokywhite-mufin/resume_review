import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./config/database";
import resumeRoutes from "./routes/resume.routes";

dotenv.config();

const app = express();
const PORT = 8000;

console.log("Server starting...");
app.use(cors());

app.use("/api", resumeRoutes);

(async () => {
  await initializeDatabase();
})();

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});

