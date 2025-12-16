import { AiOutlineClose, AiOutlineFile } from "react-icons/ai";

export default function AnalysisRecordCard() {
  return (
    <div className="flex justify-between p-4 bg-surface rounded-2xl shadow-drop">
      <section>
        <div className="flex">
          <div className="flex items-center justify-center p-2 border border-border rounded-lg mr-4 my-2">
            <AiOutlineFile className="size-4 stroke-1" />
          </div>
          <div className="flex flex-col">
            <p className="text-base font-bold">파일이름</p>
            <div className="flex items-center">
              <p className="text-ink-subtle text-sm font-bold mr-2">
                이름 | 업데이트 날짜
              </p>
              <div className="text-xs text-brand font-bold py-1 px-2 bg-brand-soft border border-brand-2 rounded-2xl">
                총 90점
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
