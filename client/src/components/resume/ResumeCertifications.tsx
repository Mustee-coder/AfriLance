export interface ResumeCertificationItem {
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
}

interface ResumeCertificationsProps {
  certifications: ResumeCertificationItem[];
  onAddCertification: () => void;
  onUpdateCertification: (
    index: number,
    field: keyof ResumeCertificationItem,
    value: string,
  ) => void;
  onRemoveCertification: (index: number) => void;
}

const ResumeCertifications = ({
  certifications,
  onAddCertification,
  onUpdateCertification,
  onRemoveCertification,
}: ResumeCertificationsProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Step 7
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Certifications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add certifications that strengthen your professional profile.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddCertification}
          className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          + Add
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center">
          <p className="text-sm text-slate-400">
            No certifications added yet.
          </p>

          <button
            type="button"
            onClick={onAddCertification}
            className="mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Add your first certification
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {certifications.map((certification, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">
                  Certification {index + 1}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    onRemoveCertification(index)
                  }
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Certification Name
                </label>

                <input
                  type="text"
                  value={certification.name}
                  onChange={(event) =>
                    onUpdateCertification(
                      index,
                      "name",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Meta Front-End Developer"
                  maxLength={150}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Issuing Organization
                </label>

                <input
                  type="text"
                  value={certification.issuer}
                  onChange={(event) =>
                    onUpdateCertification(
                      index,
                      "issuer",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Meta"
                  maxLength={150}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Issue Date
                </label>

                <input
                  type="date"
                  value={certification.issueDate ?? ""}
                  onChange={(event) =>
                    onUpdateCertification(
                      index,
                      "issueDate",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Credential URL
                </label>

                <input
                  type="url"
                  value={certification.credentialUrl ?? ""}
                  onChange={(event) =>
                    onUpdateCertification(
                      index,
                      "credentialUrl",
                      event.target.value,
                    )
                  }
                  placeholder="https://example.com/certificate"
                  maxLength={500}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Add a link where clients can verify your credential.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeCertifications;