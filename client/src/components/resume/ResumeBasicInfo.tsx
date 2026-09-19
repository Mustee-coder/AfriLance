interface ResumeBasicInfoProps {
  headline: string;
  onHeadlineChange: (value: string) => void;
}

const ResumeBasicInfo = ({
  headline,
  onHeadlineChange,
}: ResumeBasicInfoProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Step 1
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900">
          Basic Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Introduce yourself professionally.
        </p>
      </div>

      <div>
        <label
          htmlFor="headline"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Professional Headline
        </label>

        <input
          id="headline"
          type="text"
          value={headline}
          onChange={(event) =>
            onHeadlineChange(event.target.value)
          }
          placeholder="Full-Stack MERN Developer"
          maxLength={150}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
        />

        <p className="mt-1.5 text-right text-xs text-slate-400">
          {headline.length}/150
        </p>
      </div>
    </div>
  );
};

export default ResumeBasicInfo;
