import AnalysisRecords from "@/components/AnalysisRecords";
import FileUpload from "@/components/FileUpload";

export default function Home() {
  return (
    <div className="max-w-container mx-auto">
      <div className="px-5 pt-12 pb-8">
        <FileUpload />
      </div>
      <AnalysisRecords />
    </div>
  );
}
