"use client";

import DeletePopUp from "@/components/DeletePopUp";
import ProjectComponent from "@/components/detail/ProjectComponent";
import SkillComponent from "@/components/detail/SkillComponent";
import { BASE_URL } from "@/constants/env";
import useDeleteResume from "@/hooks/useDeleteResume";
import useGetResume from "@/hooks/useGetResume";
import { parseResumeData } from "@/utils/resume";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";

export default function ResultPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { mutate: deleteResume } = useDeleteResume();

  const handleClickBack = () => {
    router.back();
  };

  const handleDownload = (resumeId: number) => {
    window.open(`${BASE_URL}/resumes/${resumeId}/download`);
  };

  const handleClickDelete = () => {
    setOpen(true);
  };

  const resumeId = useParams().id;
  const { data: detail } = useGetResume(Number(resumeId));

  if (!detail) return <div>Loading...</div>;

  const resume = parseResumeData(detail);
  console.log(resume);

  const handleConfirmDelete = () => {
    deleteResume(Number(resumeId));
    router.back();
  };

  return (
    <div className="relative">
      <div className="max-w-container px-5 py-12 mx-auto">
        <header className="max-w-content flex justify-between px-0.5 py-1 mb-4">
          <div className="flex items-center">
            <button
              onClick={handleClickBack}
              type="button"
              className="mr-5 cursor-pointer"
            >
              <BiArrowBack className="size-6 text-ink-subtle hover:text-ink-muted transition-colors" />
            </button>
            <h1 className="text-2xl font-bold">Resume Review</h1>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleDownload(Number(resumeId))}
              className="px-4.5 py-3 text-xs font-bold bg-brand text-surface rounded-xl cursor-pointer hover:bg-brand/90 transition-colors"
            >
              다운로드
            </button>
            <button
              onClick={handleClickDelete}
              type="button"
              className="px-4.5 py-3 text-xs font-bold bg-danger text-surface rounded-xl cursor-pointer hover:bg-danger/90 transition-colors"
            >
              삭제
            </button>
          </div>
        </header>
        <div className="max-w-content">
          <div className="flex justify-between items-center bg-surface p-4 rounded-2xl shadow-drop">
            <div className="flex flex-col">
              <p className="text-base font-bold mb-1">
                {resume.original_filename}
              </p>
              <p className="text-sm font-bold text-ink-subtle">
                업데이트 : {resume.updated_at.slice(0, 10)}
              </p>
            </div>
            <div className="px-4 py-3 text-brand font-bold rounded-3xl bg-brand-soft border border-brand-2">
              총 {resume.analyze_result?.점수}점
            </div>
          </div>
          <section>
            <p className="text-base font-bold my-4">기본정보</p>
            <div className="bg-surface p-4 rounded-2xl shadow-drop">
              <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 items-center text-sm font-medium">
                <div className="text-ink-muted">이름</div>
                <div>{resume.analyze_result?.이름}</div>
                <div className="text-ink-muted">생년월일</div>
                <div>{resume.analyze_result?.생년월일}</div>
                <div className="text-ink-muted">이메일</div>
                <div>{resume.analyze_result?.이메일}</div>
                <div className="text-ink-muted">연락처</div>
                <div>{resume.analyze_result?.연락처}</div>
                <div className="text-ink-muted">Github</div>
                <div>
                  <a
                    href={resume.analyze_result?.["깃허브 주소"] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline"
                  >
                    {resume.analyze_result?.["깃허브 주소"] || "-"}
                  </a>
                </div>
                <div className="text-ink-muted">기타 링크</div>
                <div>{resume.analyze_result?.["그 이외의 주소"] || "-"}</div>
              </div>
            </div>
          </section>
          <section>
            <p className="text-base font-bold my-4">강점 • 약점</p>
            <div className="grid grid-cols-2 gap-5 mt-4 bg-surface p-4 rounded-2xl shadow-drop">
              <div className="bg-green-50 border border-[#E0F3EA] p-4 rounded-2xl">
                <h2 className="font-bold text-sm mb-4">강점</h2>
                <ul className="list-disc list-outside pl-5 space-y-2 text-sm font-medium">
                  {resume.analyze_result?.강점.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-danger-bg border border-danger-border p-4 rounded-2xl">
                <h2 className="font-bold text-sm mb-4">약점</h2>
                <ul className="list-disc list-outside pl-5 space-y-2 text-sm font-medium">
                  {resume.analyze_result?.취약점.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          <section>
            <p className="text-base font-bold my-4">기술 스택</p>
            <div className="bg-surface p-4 rounded-2xl shadow-drop">
              <div className="flex flex-wrap gap-2">
                {resume.analyze_result?.기술스택.map((skill, index) => (
                  <SkillComponent key={`${skill}-${index}`} skill={skill} />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={`spacer-${i}`} className="grow h-0 p-0 m-0" />
                ))}
              </div>
            </div>
          </section>
          <section>
            <p className="text-base font-bold my-4">경력 및 프로젝트</p>
            <div className="flex flex-col gap-5 mt-4 bg-surface p-4 rounded-2xl shadow-drop">
              {resume.analyze_result?.경력.map((project, index) => (
                <ProjectComponent
                  key={index}
                  projectName={project["프로젝트 이름"]}
                  roles={project["담당 역할"]}
                />
              ))}
            </div>
          </section>
          <section>
            <p className="text-base font-bold my-4">질문 리스트</p>
            <div className="bg-surface p-5 rounded-2xl shadow-drop">
              <ul className="list-disc list-outside pl-5 space-y-4 text-sm font-medium">
                {resume.question_list?.질문.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
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
