export interface ResumeEducationItem {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface ResumeEducationProps {
  education: ResumeEducationItem[];
  onAddEducation: () => void;
  onUpdateEducation: (
    index: number,
    field: keyof ResumeEducationItem,
    value: string,
  ) => void;
  onRemoveEducation: (index: number) => void;
}

const ResumeEducation = ({
  education,
  onAddEducation,
  onUpdateEducation,
  onRemoveEducation,
}: ResumeEducationProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Step 5
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Education
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add your educational background.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddEducation}
          className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          + Add
        </button>
      </div>

      {education.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center">
          <p className="text-sm text-slate-400">
            No education added yet.
          </p>

          <button
            type="button"
            onClick={onAddEducation}
            className="mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Add your first education
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {education.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">
                  Education {index + 1}
                </p>

                <button
                  type="button"
                  onClick={() => onRemoveEducation(index)}
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>

              {/* Institution */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Institution
                </label>

                <input
                  type="text"
                  value={item.institution}
                  onChange={(event) =>
                    onUpdateEducation(
                      index,
                      "institution",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Bayero University Kano"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              {/* Degree */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Degree
                </label>

                <input
                  type="text"
                  value={item.degree}
                  onChange={(event) =>
                    onUpdateEducation(
                      index,
                      "degree",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. B.Sc. Computer Science"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              {/* Field of study */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Field of Study
                </label>

                <input
                  type="text"
                  value={item.fieldOfStudy ?? ""}
                  onChange={(event) =>
                    onUpdateEducation(
                      index,
                      "fieldOfStudy",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Computer Science"
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
                    value={item.startDate ?? ""}
                    onChange={(event) =>
                      onUpdateEducation(
                        index,
                        "startDate",
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={item.endDate ?? ""}
                    onChange={(event) =>
                      onUpdateEducation(
                        index,
                        "endDate",
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={item.description ?? ""}
                  onChange={(event) =>
                    onUpdateEducation(
                      index,
                      "description",
                      event.target.value,
                    )
                  }
                  placeholder="Add relevant achievements, coursework, honors, or activities..."
                  rows={4}
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

export default ResumeEducation;
