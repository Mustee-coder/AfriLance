export interface ResumeExperienceItem {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

interface ResumeExperienceProps {
  experience: ResumeExperienceItem[];
  onAddExperience: () => void;
  onUpdateExperience: (
    index: number,
    field: keyof ResumeExperienceItem,
    value: string | boolean,
  ) => void;
  onRemoveExperience: (index: number) => void;
}

const ResumeExperience = ({
  experience,
  onAddExperience,
  onUpdateExperience,
  onRemoveExperience,
}: ResumeExperienceProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Step 4
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Experience
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add your professional work experience.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddExperience}
          className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          + Add
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center">
          <p className="text-sm text-slate-400">
            No experience added yet.
          </p>

          <button
            type="button"
            onClick={onAddExperience}
            className="mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Add your first experience
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {experience.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">
                  Experience {index + 1}
                </p>

                <button
                  type="button"
                  onClick={() => onRemoveExperience(index)}
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>

              {/* Company */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company
                </label>

                <input
                  type="text"
                  value={item.company}
                  onChange={(event) =>
                    onUpdateExperience(
                      index,
                      "company",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Mustee Digital Labs"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              {/* Position */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Position
                </label>

                <input
                  type="text"
                  value={item.position}
                  onChange={(event) =>
                    onUpdateExperience(
                      index,
                      "position",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Full-Stack Developer"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              {/* Dates */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={item.startDate}
                    onChange={(event) =>
                      onUpdateExperience(
                        index,
                        "startDate",
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>

                {!item.current && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      End Date
                    </label>

                    <input
                      type="date"
                      value={item.endDate ?? ""}
                      onChange={(event) =>
                        onUpdateExperience(
                          index,
                          "endDate",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                )}
              </div>

              {/* Current job */}
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={item.current}
                  onChange={(event) =>
                    onUpdateExperience(
                      index,
                      "current",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />

                I currently work here
              </label>

              {/* Description */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={item.description ?? ""}
                  onChange={(event) =>
                    onUpdateExperience(
                      index,
                      "description",
                      event.target.value,
                    )
                  }
                  placeholder="Describe your responsibilities, achievements, and impact..."
                  rows={5}
                  maxLength={2000}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {(item.description ?? "").length}/2000
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeExperience;
