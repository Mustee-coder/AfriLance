interface ResumeSummaryProps {
  professionalSummary: string;
  onProfessionalSummaryChange: (value: string) => void;
}

const ResumeSummary = ({
  professionalSummary,
  onProfessionalSummaryChange,
}: ResumeSummaryProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Step 2
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900">
          Professional Summary
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Tell clients what you do and what you bring.
        </p>
      </div>

      <textarea
        id="summary"
        value={professionalSummary}
        onChange={(event) =>
          onProfessionalSummaryChange(event.target.value)
        }
        placeholder="Write a concise summary of your experience, strengths, and professional goals..."
        rows={7}
        maxLength={2000}
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
      />

      <p className="mt-1.5 text-right text-xs text-slate-400">
        {professionalSummary.length}/2000
      </p>
    </div>
  );
};

export default ResumeSummary;
