import { PDFParse, TextResult } from "pdf-parse";
import fs from "fs/promises";
import { NAME_REGEX, PHONE_REGEX } from "../constants/regex";

export const extractTextFromPdf = async (filePath: string): Promise<string> => {
  const data = await fs.readFile(filePath);
  const pdfParser = new PDFParse({ data: data });
  const pdfData: TextResult = await pdfParser.getText();
  return pdfData.text;
};

export const parseApplicantInfo = (
  fullText: string
): { name: string; phoneNumber: string } => {
  const nameMatches = fullText.match(NAME_REGEX);
  const name = nameMatches ? nameMatches[1].trim() : "unknown";

  const phoneNumberMatches = fullText.match(PHONE_REGEX);
  const phoneNumber = phoneNumberMatches
    ? phoneNumberMatches[1].trim()
    : "unknown";

  return { name, phoneNumber };
};

