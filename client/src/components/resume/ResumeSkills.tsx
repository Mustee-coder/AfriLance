interface ResumeSkillsProps {
  skills: string[];
  skillInput: string;
  onSkillInputChange: (value: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (skill: string) => void;
}

const ResumeSkills = ({
  skills,
  skillInput,
  onSkillInputChange,
  onAddSkill,
  onRemoveSkill,
}: ResumeSkillsProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Step 3
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900">
          Skills
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add skills relevant to your professional work.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={skillInput}
          onChange={(event) =>
            onSkillInputChange(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAddSkill();
            }
          }}
          placeholder="e.g. React"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
        />

        <button
          type="button"
          onClick={onAddSkill}
          className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Add
        </button>
      </div>

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700"
            >
              <span>{skill}</span>

              <button
                type="button"
                onClick={() => onRemoveSkill(skill)}
                className="text-emerald-500 transition hover:text-red-500"
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {skills.length === 0 && (
        <p className="mt-4 rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
          No skills added yet.
        </p>
      )}
    </div>
  );
};

export default ResumeSkills;
