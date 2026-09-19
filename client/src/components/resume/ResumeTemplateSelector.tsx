interface ResumeTemplateSelectorProps {
  template: "classic" | "modern" | "minimal";
  onChange: (template: "classic" | "modern" | "minimal") => void;
}

const templates = [
  {
    id: "classic" as const,
    name: "Classic",
    description: "Traditional and professional",
  },
  {
    id: "modern" as const,
    name: "Modern",
    description: "Clean and contemporary",
  },
  {
    id: "minimal" as const,
    name: "Minimal",
    description: "Simple and focused",
  },
];

const ResumeTemplateSelector = ({
  template,
  onChange,
}: ResumeTemplateSelectorProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Step 8
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900">
          Choose a Template
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Select a professional style for your resume.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {templates.map((item) => {
          const isSelected = template === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`rounded-xl border-2 p-4 text-left transition ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-emerald-300"
              }`}
            >
              <div
                className={`mb-3 flex h-28 items-center justify-center rounded-lg border ${
                  isSelected
                    ? "border-emerald-200 bg-white"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="w-20 space-y-2">
                  <div className="h-2 w-12 rounded bg-slate-800" />
                  <div className="h-1.5 w-full rounded bg-slate-300" />
                  <div className="h-1.5 w-16 rounded bg-slate-300" />
                  <div className="mt-3 h-1.5 w-full rounded bg-slate-200" />
                  <div className="h-1.5 w-14 rounded bg-slate-200" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>

                {isSelected && (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    ✓
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ResumeTemplateSelector;