"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import useGetAllResumes from "@/hooks/useGetAllResumes";
import AnalysisRecordCard from "./AnalysisRecordCard";
import { Resume } from "@/types";

export default function AnalysisRecords() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetAllResumes();

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // srting으로 오는 analyze_result와 question_list를 파싱
  const allResumes: Resume[] =
    data?.pages.flatMap((page) =>
      page.data.map((raw) => ({
        ...raw,
        analyze_result: raw.analyze_result
          ? JSON.parse(raw.analyze_result)
          : null,
        question_list: raw.question_list ? JSON.parse(raw.question_list) : null,
      }))
    ) ?? [];

  if (isLoading || allResumes.length === 0) {
    return null;
  }

  return (
    <div className="max-w-content mx-auto">
      <div className="flex justify-between items-center px-0.5 mb-4">
        <p className="text-xl font-bold">분석 기록</p>
        <button type="button" className="text-sm font-bold text-ink-muted">
          전체 삭제
        </button>
      </div>

      <div className="space-y-4">
        {allResumes.map((resume) => (
          <AnalysisRecordCard key={resume.resume_id} resume={resume} />
        ))}
      </div>
      <div ref={ref} className="py-4 text-center">
        {isFetchingNextPage && (
          <p className="text-ink-muted">더 불러오는 중...</p>
        )}
      </div>
    </div>
  );
}
