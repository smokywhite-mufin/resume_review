import AnalysisRecords from "@/components/landing/AnalysisRecords";
import FileUpload from "@/components/landing/FileUpload";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";

export default function Home() {
  return (
    <div className="max-w-container mx-auto">
      <div className="px-5 pt-12 pb-8">
        <FileUpload />
      </div>
      <AnalysisRecords />
      <ScrollToTopButton />
    </div>
  );
}
