import ProjectComponent from "./ProjectComponent";
import SkillComponent from "./SkillComponent";

export default function DetailContent() {
  return (
    <div className="max-w-content">
      <div className="flex justify-between items-center bg-surface p-4 rounded-2xl shadow-drop">
        <div className="flex flex-col">
          <p className="text-base font-bold mb-1">fileName.pdf</p>
          <p className="text-sm font-bold text-ink-subtle">
            업데이트 : 2025-12-17
          </p>
        </div>
        <div className="px-4 py-3 text-brand font-bold rounded-3xl bg-brand-soft border border-brand-2">
          총 90점
        </div>
      </div>
      <section>
        <p className="text-base font-bold my-4">기본정보</p>
        <div className="bg-surface p-4 rounded-2xl shadow-drop">
          <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 items-center text-sm font-medium">
            <div className="text-ink-muted">이름</div>
            <div>최성령</div>
            <div className="text-ink-muted">생년월일</div>
            <div>2001.07.28</div>
            <div className="text-ink-muted">이메일</div>
            <div>oaoa0728@gmail.com</div>
            <div className="text-ink-muted">연락처</div>
            <div>010-7148-0374</div>
            <div className="text-ink-muted">Github</div>
            <div>
              <a
                href="https://github.com/ryeong9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                https://github.com/ryeong9
              </a>
            </div>
            <div className="text-ink-muted">기타 링크</div>
            <div>-</div>
          </div>
        </div>
      </section>
      <section>
        <p className="text-base font-bold my-4">강점 • 약점</p>
        <div className="grid grid-cols-2 gap-5 mt-4 bg-surface p-4 rounded-2xl shadow-drop">
          <div className="bg-green-50 border border-[#E0F3EA] p-4 rounded-2xl">
            <h2 className="font-bold text-sm mb-4 text-ink">강점</h2>
            <ul className="list-disc list-outside pl-5 space-y-2 text-sm">
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="bg-danger-bg border border-danger-border p-4 rounded-2xl">
            <h2 className="font-bold text-sm mb-4 text-ink">약점</h2>
            <ul className="list-disc list-outside pl-5 space-y-2 text-sm">
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <p className="text-base font-bold my-4">기술 스택</p>
        <div className="bg-surface p-4 rounded-2xl shadow-drop">
          <div className="flex flex-wrap gap-2">
            {[
              "React",
              "Next.js",
              "TypeScript",
              "Tailwind CSS",
              "Tanstack Query",
              "Node.js",
              "Zustand",
              "Spring",
              "JavaScript",
              "HTML/CSS",
            ].map((skill, index) => (
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
          {[
            {
              "프로젝트 이름": "Resume Review",
              "담당 역할": ["Frontend Developer", "UI/UX Design"],
            },
            {
              "프로젝트 이름": "Portfolio Website",
              "담당 역할": ["Fullstack Developer", "Deployment"],
            },
          ].map((project, index) => (
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
        <div className="bg-surface p-4 rounded-2xl shadow-drop">
          <ul className="list-disc list-outside pl-5 space-y-2 text-sm font-medium">
            {[
              "react에 대해 설명해주세요",
              "상태관리 도구에 대해 설명해주세요",
            ].map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
