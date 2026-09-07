import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useJob,
  useUpdateJob,
} from "@/hooks/useJobs";

import {
  postJobSchema,
  type PostJobFormData,
} from "@/types/job.validation";

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const jobId = id ?? "";

  const {
    data: job,
    isLoading: isJobLoading,
    isError: isJobError,
  } = useJob(jobId);

  const updateJobMutation = useUpdateJob();

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostJobFormData>({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      budgetType: "fixed",
      experienceLevel: "intermediate",
      locationType: "remote",
      deadline: "",
    },
  });

  useEffect(() => {
    if (!job) return;

    reset({
      title: job.title,
      description: job.description,
      budget: job.budget,
      budgetType: job.budgetType,
      experienceLevel: job.experienceLevel,
      deadline: job.deadline
        ? new Date(job.deadline)
            .toISOString()
            .slice(0, 16)
        : "",
      locationType: job.locationType,
      country: job.country,
      city: job.city,
    });

    setSkills(job.skills);
  }, [job, reset]);

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (
      skills.some(
        (item) =>
          item.toLowerCase() ===
          skill.toLowerCase(),
      )
    ) {
      setSkillInput("");
      return;
    }

    setSkills((current) => [
      ...current,
      skill,
    ]);

    setSkillInput("");
  };

  const removeSkill = (
    skillToRemove: string,
  ) => {
    setSkills((current) =>
      current.filter(
        (skill) =>
          skill !== skillToRemove,
      ),
    );
  };

  const onSubmit = async (
    data: PostJobFormData,
  ) => {
    if (!jobId || skills.length === 0) {
      return;
    }

    try {
      await updateJobMutation.mutateAsync({
        jobId,
        data: {
          ...data,
          skills,
          deadline:
            data.deadline || undefined,
        },
      });

      navigate(`/jobs/${jobId}`);
    } catch {
      // Error displayed below
    }
  };

  if (isJobLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-5 w-32 rounded bg-slate-200" />

          <div className="mt-8 h-10 w-72 rounded bg-slate-200" />

          <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200" />

          <div className="mt-8 h-[700px] rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  if (isJobError || !job) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <BriefcaseBusiness size={28} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Job not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This job may have been removed or you may not have permission to edit it.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/client/jobs")
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={17} />
            Back to My Jobs
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <button
          type="button"
          onClick={() =>
            navigate("/client/jobs")
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          Back to My Jobs
        </button>

        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <BriefcaseBusiness size={24} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Edit Job
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Update your job details and keep your posting accurate for developers.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.05,
          }}
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >

          {/* Job Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Job title
            </label>

            <input
              id="title"
              {...register("title")}
              placeholder="e.g. Build a modern React dashboard"
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                errors.title
                  ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              }`}
            />

            {errors.title && (
              <p className="mt-2 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Project description
            </label>

            <textarea
              id="description"
              rows={7}
              {...register("description")}
              placeholder="Describe the project, requirements, deliverables, and expectations..."
              className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
                errors.description
                  ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              }`}
            />

            {errors.description && (
              <p className="mt-2 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Budget */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="budget"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Budget
              </label>

              <input
                id="budget"
                type="number"
                min="1"
                step="0.01"
                {...register("budget", {
                  valueAsNumber: true,
                })}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  errors.budget
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                }`}
              />

              {errors.budget && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.budget.message}
                </p>
              )}
            </div>

            {/* Budget Type */}
            <div>
              <label
                htmlFor="budgetType"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Budget type
              </label>

              <select
                id="budgetType"
                {...register("budgetType")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="fixed">
                  Fixed price
                </option>

                <option value="hourly">
                  Hourly rate
                </option>
              </select>
            </div>
          </div>

          {/* Experience + Location */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="experienceLevel"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Experience level
              </label>

              <select
                id="experienceLevel"
                {...register(
                  "experienceLevel",
                )}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="entry">
                  Entry level
                </option>

                <option value="intermediate">
                  Intermediate
                </option>

                <option value="expert">
                  Expert
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="locationType"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Work location
              </label>

              <select
                id="locationType"
                {...register(
                  "locationType",
                )}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="remote">
                  Remote
                </option>

                <option value="onsite">
                  On-site
                </option>

                <option value="hybrid">
                  Hybrid
                </option>
              </select>
            </div>
          </div>

          {/* Country + City */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="country"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Country
              </label>

              <input
                id="country"
                {...register("country")}
                placeholder="e.g. Nigeria"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  errors.country
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                }`}
              />

              {errors.country && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                City
              </label>

              <input
                id="city"
                {...register("city")}
                placeholder="e.g. Kano"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  errors.city
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                }`}
              />

              {errors.city && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          {/* Deadline */}
          <div className="mt-6">
            <label
              htmlFor="deadline"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Deadline
              <span className="ml-2 text-xs font-normal text-slate-400">
                Optional
              </span>
            </label>

            <input
              id="deadline"
              type="datetime-local"
              {...register("deadline")}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />

            {errors.deadline && (
              <p className="mt-2 text-sm text-red-600">
                {errors.deadline.message}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="mt-6">
            <label
              htmlFor="skill"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Required skills
            </label>

            <div className="flex gap-2">
              <input
                id="skill"
                value={skillInput}
                onChange={(event) =>
                  setSkillInput(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="e.g. React"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />

              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus size={17} />

                <span className="hidden sm:inline">
                  Add
                </span>
              </button>
            </div>

            {skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700"
                  >
                    {skill}

                    <button
                      type="button"
                      onClick={() =>
                        removeSkill(skill)
                      }
                      className="rounded-full p-0.5 transition hover:bg-emerald-100"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {skills.length === 0 && (
              <p className="mt-2 text-xs text-red-500">
                Add at least one skill required for this project.
              </p>
            )}
          </div>

          {/* Server Error */}
          {updateJobMutation.isError && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {updateJobMutation.error instanceof Error
                ? updateJobMutation.error.message
                : "Failed to update job. Please try again."}
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/jobs/${jobId}`,
                )
              }
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                updateJobMutation.isPending ||
                skills.length === 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateJobMutation.isPending ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} />
                  Update Job
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
};

export default EditJob;
