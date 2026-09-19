export interface ResumeProjectItem {
  title: string;
  description: string;
  projectUrl?: string;
}

interface ResumeProjectsProps {
  projects: ResumeProjectItem[];
  onAddProject: () => void;
  onUpdateProject: (
    index: number,
    field: keyof ResumeProjectItem,
    value: string,
  ) => void;
  onRemoveProject: (index: number) => void;
}

const ResumeProjects = ({
  projects,
  onAddProject,
  onUpdateProject,
  onRemoveProject,
}: ResumeProjectsProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Step 6
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Projects
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Showcase projects that demonstrate your skills and experience.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddProject}
          className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          + Add
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center">
          <p className="text-sm text-slate-400">
            No projects added yet.
          </p>

          <button
            type="button"
            onClick={onAddProject}
            className="mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Add your first project
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {projects.map((project, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">
                  Project {index + 1}
                </p>

                <button
                  type="button"
                  onClick={() => onRemoveProject(index)}
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Project Title
                </label>

                <input
                  type="text"
                  value={project.title}
                  onChange={(event) =>
                    onUpdateProject(
                      index,
                      "title",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. AfriLance"
                  maxLength={150}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={project.description}
                  onChange={(event) =>
                    onUpdateProject(
                      index,
                      "description",
                      event.target.value,
                    )
                  }
                  placeholder="Describe what you built, the technologies you used, and the impact of the project..."
                  rows={5}
                  maxLength={2000}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {project.description.length}/2000
                </p>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Project URL
                </label>

                <input
                  type="url"
                  value={project.projectUrl ?? ""}
                  onChange={(event) =>
                    onUpdateProject(
                      index,
                      "projectUrl",
                      event.target.value,
                    )
                  }
                  placeholder="https://example.com"
                  maxLength={500}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Add a live demo, GitHub repository, or portfolio link.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeProjects;