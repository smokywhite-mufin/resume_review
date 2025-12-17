import DetailContent from "@/components/detail/DetailContent";
import { BiArrowBack } from "react-icons/bi";

export default function ResultPage() {
  return (
    <div className="max-w-container px-5 py-12 mx-auto">
      <header className="max-w-content flex justify-between px-0.5 py-1 mb-4">
        <div className="flex items-center">
          <button type="button" className="mr-5 cursor-pointer">
            <BiArrowBack className="size-6 text-ink-subtle" />
          </button>
          <h1 className="text-2xl font-bold">Resume Review</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-4.5 py-3 text-xs font-bold bg-brand text-surface rounded-xl cursor-pointer hover:bg-brand/90 transition-colors">
            다운로드
          </button>
          <button className="px-4.5 py-3 text-xs font-bold bg-danger text-surface rounded-xl cursor-pointer hover:bg-danger/90 transition-colors">
            삭제
          </button>
        </div>
      </header>
      <DetailContent />
    </div>
  );
}
