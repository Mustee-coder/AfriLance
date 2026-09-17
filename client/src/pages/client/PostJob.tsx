import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { useCreateJob } from "@/hooks/useJobs";
import {
  useExtractJobRequirements,
  useGenerateJobDraft,
} from "@/hooks/useAI";
import {
  postJobSchema,
  type PostJobFormData,
} from "@/types/job.validation";

const PostJob = () => {
  const navigate = useNavigate();
  const createJobMutation = useCreateJob();

  const [skills, setSkills] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
const [skillInput, setSkillInput] = useState("");
const [jobIdea, setJobIdea] = useState("");
const generateAI = useGenerateJobDraft();
const extractRequirementsAI = useExtractJobRequirements();

  const {
  register,
  handleSubmit,
  setValue,
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

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (
      skills.some(
        (item) => item.toLowerCase() === skill.toLowerCase(),
      )
    ) {
      setSkillInput("");
      return;
    }

    setSkills((current) => [...current, skill]);
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((current) =>
      current.filter((skill) => skill !== skillToRemove),
    );
  };

  const onSubmit = async (data: PostJobFormData) => {
    if (skills.length === 0) {
      return;
    }

    try {
      await createJobMutation.mutateAsync({
        ...data,
        skills,
        deadline: data.deadline || undefined,
      });

      navigate("/client/jobs");
    } catch {
      // Error displayed below
    }
  };
  const handleGenerateAI = async () => {
  if (!jobIdea.trim()) return;

  try {
    const response = await generateAI.mutateAsync(jobIdea);

    setValue("title", response.draft.title);
    setValue("description", response.draft.description);
    setValue(
      "experienceLevel",
      response.draft.experienceLevel,
    );

    setSkills(response.draft.skills);
  } catch {
    // Error handled by mutation state
  }
  
};


const handleExtractRequirements = async () => {
  if (!jobIdea.trim()) return;

  try {
    const response = await extractRequirementsAI.mutateAsync(
      jobIdea,
    );

    setSkills(response.result.skills);
    setRequirements(response.result.requirements);
  } catch {
    // Error handled by mutation state
  }
};

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/client/dashboard")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <BriefcaseBusiness size={24} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Post a New Job
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Tell talented developers what you need and attract the right
            person for your project.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
        {/* AI Job Generator */}
<div className="mb-8 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
  <div className="mb-4">
    <h2 className="text-lg font-bold text-slate-900">
      Generate with AI
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Describe what you need and AI will create a professional
      job draft for you.
    </p>
  </div>

  <textarea
    value={jobIdea}
    onChange={(event) => setJobIdea(event.target.value)}
    rows={4}
    placeholder="e.g. I need someone to build an ecommerce website with React and Node.js..."
    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
  />

  <div className="flex flex-wrap gap-3">
    <button
      type="button"
      onClick={handleGenerateAI}
      disabled={
        generateAI.isPending || !jobIdea.trim()
      }
      className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {generateAI.isPending ? (
        <>
          <Loader2 size={17} className="animate-spin" />
          Generating...
        </>
      ) : (
        "✨ Generate Job with AI"
      )}
    </button>

    <button
      type="button"
      onClick={handleExtractRequirements}
      disabled={
        extractRequirementsAI.isPending ||
        !jobIdea.trim()
      }
      className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {extractRequirementsAI.isPending ? (
        <>
          <Loader2 size={17} className="animate-spin" />
          Analyzing...
        </>
      ) : (
        "🔍 Analyze Skills & Requirements"
      )}
    </button>
  </div>

  {generateAI.isError && (
    <p className="mt-3 text-sm text-red-600">
      Failed to generate job draft. Please try again.
    </p>
  )}

  {extractRequirementsAI.isError && (
    <p className="mt-3 text-sm text-red-600">
      Failed to analyze job requirements. Please try again.
    </p>
  )}
</div>
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
                placeholder="500"
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
                <option value="fixed">Fixed price</option>
                <option value="hourly">Hourly rate</option>
              </select>
            </div>
          </div>

          {/* Experience + Location Type */}
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
                {...register("experienceLevel")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="entry">Entry level</option>
                <option value="intermediate">
                  Intermediate
                </option>
                <option value="expert">Expert</option>
              </select>

              {errors.experienceLevel && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.experienceLevel.message}
                </p>
              )}
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
                {...register("locationType")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>

              {errors.locationType && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.locationType.message}
                </p>
              )}
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
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                errors.deadline
                  ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              }`}
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
        setSkillInput(event.target.value)
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
            onClick={() => removeSkill(skill)}
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
    <p className="mt-2 text-xs text-slate-400">
      Add at least one skill required for this project.
    </p>
  )}

  {/* AI-generated Requirements */}
  {requirements.length > 0 && (
    <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
      <h3 className="mb-3 text-sm font-bold text-slate-900">
        AI-generated requirements
      </h3>

      <ul className="space-y-2">
        {requirements.map((requirement, index) => (
          <li
            key={`${requirement}-${index}`}
            className="flex items-start gap-2 text-sm text-slate-600"
          >
            <span className="mt-0.5 text-emerald-600">
              ✓
            </span>

            <span>{requirement}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

{/* Server Error */}
{createJobMutation.isError && (
  <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
    {createJobMutation.error instanceof Error
      ? createJobMutation.error.message
      : "Failed to create job. Please try again."}
  </div>
)}
          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                navigate("/client/dashboard")
              }
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                createJobMutation.isPending ||
                skills.length === 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createJobMutation.isPending ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} />
                  Publish Job
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
};

export default PostJob;
