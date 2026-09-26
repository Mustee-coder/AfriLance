import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useJobRecommendations } from "@/hooks/useJobs";

const formatDate = (date?: string) => {
  if (!date) return "No deadline";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const JobRecommendations = () => {
  const { data, isLoading, isError } = useJobRecommendations();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-64 rounded-lg bg-slate-200" />
            <div className="h-48 rounded-2xl bg-white shadow-sm" />
            <div className="h-48 rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-semibold text-red-900">
              Unable to load recommendations
            </h2>

            <p className="mt-2 text-sm text-red-700">
              Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
              <Sparkles size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Recommended Jobs
              </h1>

              <p className="mt-1 text-sm text-slate-600">
                Jobs matched to your skills and experience.
              </p>
            </div>
          </div>
        </div>

        {data.recommendations.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <BriefcaseBusiness
              className="mx-auto text-slate-400"
              size={42}
            />

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              No recommendations yet
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
              Add more skills and experience to your developer profile, or
              check back when new jobs are posted.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.recommendations.map((job) => (
              <article
                key={job.jobId}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-5">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          {job.title}
                        </h2>

                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={16} />
                            {job.city}, {job.country}
                          </span>

                          <span className="capitalize">
                            {job.locationType}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={16} />
                            {formatDate(job.deadline)}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-emerald-50 px-4 py-3 text-right">
                        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                          Budget
                        </p>

                        <p className="mt-1 text-lg font-bold text-emerald-700">
                          ${job.budget.toLocaleString()}
                        </p>

                        <p className="text-xs capitalize text-emerald-600">
                          {job.budgetType}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-slate-600">
                      {job.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Skills
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.skills.map((skill) => {
                        const normalizedSkill = skill.trim().toLowerCase();

                        const isMatched =
                          job.matching.matched.includes(normalizedSkill);

                        return (
                          <span
                            key={skill}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              isMatched
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-emerald-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                        Matched Skills
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {job.matching.matched.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl bg-amber-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                        Skills to Develop
                      </p>

                      {job.matching.missing.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {job.matching.missing.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-amber-700">
                          You match all listed skills.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Experience
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {job.experience.years} years
                      </p>

                      <p className="mt-1 text-sm text-slate-600 capitalize">
                        {job.experience.requirement} level
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Match Details
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {job.matching.matchedCount} of{" "}
                        {job.matching.requiredCount} skills matched
                      </p>

                      <p className="mt-1 text-sm text-emerald-600">
                        Experience requirement met
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-indigo-50 p-4">
                    <h3 className="text-sm font-semibold text-indigo-900">
                      Why this job is recommended
                    </h3>

                    <ul className="mt-2 space-y-1">
                      {job.reasons.map((reason) => (
                        <li
                          key={reason}
                          className="text-sm text-indigo-700"
                        >
                          • {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                    <Link
                      to={`/jobs/${job.jobId}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      View Job
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;