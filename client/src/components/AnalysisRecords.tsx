"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useGetAllResumes from "@/hooks/useGetAllResumes";
import AnalysisRecordCard from "./AnalysisRecordCard";
import { Resume } from "@/types";
import DeletePopUp from "./DeletePopUp";
import useDeleteAllResume from "@/hooks/useDeleteAllResume";

export default function AnalysisRecords() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetAllResumes();

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const [open, setOpen] = useState(false);

  const { mutate: deleteAllResume } = useDeleteAllResume();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // string으로 오는 analyze_result와 question_list를 파싱
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

  const handleDelete = () => {
    setOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteAllResume();
    setOpen(false);
  };

  return (
    <div className="relative max-w-content mx-auto">
      <div className="flex justify-between items-center px-0.5 mb-4">
        <p className="text-xl font-bold">분석 기록</p>
        <button
          type="button"
          onClick={handleDelete}
          className="text-sm font-bold text-ink-muted"
        >
          전체 삭제
        </button>
      </div>
      {open && (
        <DeletePopUp
          title="분석 기록을 모두 삭제할까요?"
          onConfirm={handleDeleteConfirm}
          onClose={() => setOpen(false)}
        />
      )}
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
