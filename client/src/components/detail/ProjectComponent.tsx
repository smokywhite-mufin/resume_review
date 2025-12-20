interface ProjectComponentProps {
  projectName: string;
  roles: string[];
  period?: string;
}

export default function ProjectComponent({
  projectName,
  roles,
  period,
}: ProjectComponentProps) {
  return (
    <div className="bg-surface-2 p-4 rounded-2xl border border-border">
      <h2 className="font-semibold text-sm mb-2">
        [{projectName}]{" "}
        <span className="text-xs text-ink-muted">
          {period && `(${period})`}
        </span>
      </h2>
      <ul className="list-disc list-outside pl-5 space-y-2 text-sm font-medium">
        {roles.map((role, index) => (
          <li key={index}>{role}</li>
        ))}
      </ul>
    </div>
  );
}
