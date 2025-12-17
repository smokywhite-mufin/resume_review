interface SkillComponentProps {
  skill: string;
}

export default function SkillComponent({ skill }: SkillComponentProps) {
  return (
    <div className="px-5 py-2.5 bg-surface-2 border border-border rounded-3xl text-sm font-medium grow text-center">
      {skill}
    </div>
  );
}
