import { BASE_URL } from "@/constants/env";
import usePostAnalysis from "@/hooks/usePostAnalysis";
import { Resume } from "@/types";
import { useState } from "react";
import { AiOutlineClose, AiOutlineFile } from "react-icons/ai";
import DeletePopUp from "../DeletePopUp";
import useDeleteResume from "@/hooks/useDeleteResume";
import { useRouter } from "next/navigation";

interface AnalysisRecordCardProps {
  resume: Resume;
}

export default function AnalysisRecordCard({
  resume,
}: AnalysisRecordCardProps) {
  const router = useRouter();
  const { mutate: postAnalysis } = usePostAnalysis();
  const { mutate: deleteResume } = useDeleteResume();

  const handleReanalyze = (e: React.MouseEvent) => {
    e.stopPropagation();
    postAnalysis(resume.resume_id);
    router.push(`/resume/${resume.resume_id}`);
  };

  const handleDownload = (resumeId: number) => {
    window.open(`${BASE_URL}/resumes/${resumeId}/download`);
  };

  const [open, setOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteResume(resume.resume_id);
    setOpen(false);
  };

  const handleClickGotoDetail = () => {
    router.push(`/resume/${resume.resume_id}`);
  };

  return (
    <div className="relative">
      <div
        onClick={handleClickGotoDetail}
        className="flex justify-between p-4 bg-surface rounded-2xl shadow-drop hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
      >
        <section>
          <div className="flex">
            <div className="flex items-center justify-center px-2 py-2.5 border border-border rounded-lg mr-4 my-2">
              <AiOutlineFile className="size-4 stroke-1 text-ink-subtle" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-base font-bold">{resume.original_filename}</p>
              <div className="flex items-center">
                <p className="text-ink-subtle text-sm font-bold mr-2">
                  {resume.analyze_result?.이름} |{" "}
                  {resume.updated_at.slice(0, 10)} 분석
                </p>
                <div className="text-xs text-brand font-bold py-1 px-2 bg-brand-soft border border-brand-2 rounded-2xl">
                  {resume.analyze_result?.점수}점
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="flex gap-4 items-center">
          <button
            onClick={handleReanalyze}
            className="px-4 py-3 rounded-lg bg-brand text-surface text-base font-bold hover:bg-brand/90 transition-colors cursor-pointer"
          >
            재분석
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(resume.resume_id);
            }}
            className="px-4 py-3 rounded-lg text-brand border border-brand-2 text-base font-bold hover:bg-canvas transition-colors cursor-pointer"
          >
            다운로드
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-ink-subtle hover:bg-danger-bg hover:text-danger transition-colors cursor-pointer"
          >
            <AiOutlineClose className="size-5" />
          </button>
        </section>
      </div>
      {open && (
        <DeletePopUp
          title={`${resume.original_filename}를 삭제할까요?`}
          onConfirm={handleConfirmDelete}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
