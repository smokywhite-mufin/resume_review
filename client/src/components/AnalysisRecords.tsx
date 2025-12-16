import AnalysisRecordCard from "./AnalysisRecordCard";

const data = [
  {
    id: 1,
  },
];

export default function AnalysisRecords() {
  return (
    <div className="max-w-content mx-auto">
      <div className="flex justify-between items-center px-0.5 mb-4">
        <p className="text-xl font-bold">분석 기록</p>
        <button type="button" className="text-sm font-bold text-ink-muted">
          전체 삭제
        </button>
      </div>
      {data.map((resume) => (
        <AnalysisRecordCard key={resume.id} />
      ))}
    </div>
  );
}
