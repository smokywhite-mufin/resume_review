import { Resume } from "@/types";
import { AiOutlineClose, AiOutlineFile } from "react-icons/ai";

interface AnalysisRecordCardProps {
  resume: Resume;
}

export default function AnalysisRecordCard({
  resume,
}: AnalysisRecordCardProps) {
  return (
    <div className="flex justify-between p-4 bg-surface rounded-2xl shadow-drop">
      <section>
        <div className="flex">
          <div className="flex items-center justify-center p-2 border border-border rounded-lg mr-4 my-2">
            <AiOutlineFile className="size-4 stroke-1" />
          </div>
          <div className="flex flex-col">
            <p className="text-base font-bold">{resume.file_path}</p>
            <div className="flex items-center">
              <p className="text-ink-subtle text-sm font-bold mr-2">
                {resume.analyze_result?.이름} | {resume.updated_at}
              </p>
              <div className="text-xs text-brand font-bold py-1 px-2 bg-brand-soft border border-brand-2 rounded-2xl">
                {resume.analyze_result?.점수}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex gap-4">
        <button className="px-4 py-3 rounded-lg bg-brand text-surface text-base font-bold">
          재분석
        </button>
        <button className="px-4 py-3 rounded-lg text-brand border border-brand-2 text-base font-bold">
          다운로드
        </button>
        <button>
          <AiOutlineClose className="size-5 text-ink-subtle" />
        </button>
      </section>
    </div>
  );
}
