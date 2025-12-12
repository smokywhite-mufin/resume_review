import { Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

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

export const upload = multer({ storage: storage });

export const deleteFile = (filePath: string) => {
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error(`Failed to delete file: ${filePath}`, err);
        }
    }
};