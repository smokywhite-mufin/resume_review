import AnalysisRecords from "@/components/landing/AnalysisRecords";
import FileUpload from "@/components/landing/FileUpload";

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
