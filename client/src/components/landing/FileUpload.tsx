"use client";

import usePostAnalysis from "@/hooks/usePostAnalysis";
import usePostFile from "@/hooks/usePostFile";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { LuFileUp } from "react-icons/lu";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const { mutateAsync: uploadFile, isPending: isUploading } = usePostFile();
  const { mutateAsync: analyzeResume, isPending: isAnalyzing } =
    usePostAnalysis();

  const isPending = isUploading || isAnalyzing;

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const uploadResponse = await uploadFile(file);
    await analyzeResume(uploadResponse.resume_id);
  };

  return (
    <div className="max-w-content mx-auto bg-surface rounded-2xl p-7 shadow-drop">
      <h1 className="text-2xl font-bold mb-4.5">Resume Review</h1>
      <form onSubmit={handleSubmit}>
        <div
          {...getRootProps()}
          className="py-10 bg-surface-2 border border-border border-dashed rounded-2xl"
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex flex-col justify-center items-center">
              <p className="text-xl font-bold mb-1">{file.name}</p>
              <p className="text-xs text-ink-subtle mb-2">업로드 완료</p>
              <p className="text-base font-medium text-ink-muted mb-4">
                다른 파일로 바꾸려면, 파일을 변경하거나 드롭하세요.
              </p>
              <button
                type="button"
                className="py-2 px-2.5 border border-border rounded-lg text-sm font-semibold bg-surface cursor-pointer hover:bg-surface-2 hover:border-ink-subtle transition-colors"
              >
                파일 변경
              </button>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <LuFileUp className="size-11 stroke-1 text-ink-subtle mb-2" />
              <p className="text-base font-medium text-ink-muted mb-4">
                PDF 파일을 이곳에 끌어다 놓거나, 파일을 업로하세요.
              </p>
              <button
                type="button"
                className="py-2 px-2.5 border border-border rounded-lg text-sm font-semibold bg-surface cursor-pointer hover:bg-surface-2 hover:border-ink-subtle transition-colors"
              >
                파일 업로드
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center mt-4.5">
          <button
            type="submit"
            disabled={!file || isPending}
            className="py-2.5 px-16 rounded-lg bg-brand text-surface text-xl font-bold cursor-pointer hover:bg-brand/90 transition-colors disabled:bg-border disabled:text-ink-subtle disabled:cursor-not-allowed"
          >
            분석 시작
          </button>
        </div>
      </form>
    </div>
  );
}
