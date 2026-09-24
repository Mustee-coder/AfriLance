import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Code2,
  FolderOpen,
  Loader2,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";
import { useJob, useJobMatches } from "@/hooks/useJobs";

const JobMatches = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: job,
    isLoading: isJobLoading,
    isError: isJobError,
  } = useJob(id ?? "");

  const {
    data: matchesData,
    isLoading: isMatchesLoading,
    isError: isMatchesError,
  } = useJobMatches(id ?? "");

  if (isJobLoading || isMatchesLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-center py-24">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Finding matching developers...</span>
          </div>
        </div>
      </main>
    );
  }

  if (isJobError || isMatchesError || !job || !matchesData) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={() => navigate("/client/jobs")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Jobs
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            Unable to load job matches.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/client/jobs")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Jobs
        </button>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <BriefcaseBusiness className="h-4 w-4" />
                Developer Matches
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                {job.title}
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                Developers matching the skills and requirements of this job.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3">
              <Users className="h-5 w-5 text-slate-600" />

              <div>
                <p className="text-lg font-bold text-slate-900">
                  {matchesData.meta.returned}
                </p>
                <p className="text-xs text-slate-500">
                  matching developers
                </p>
              </div>
            </div>
          </div>
        </section>

        {matchesData.matches.length === 0 ? (
  <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
      <Users className="h-7 w-7 text-slate-500" />
    </div>

    <h2 className="mt-4 text-lg font-semibold text-slate-900">
      No matching developers yet
    </h2>

    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
      No available or busy developers currently match at least one
      of this job&apos;s required skills.
    </p>
  </section>
) : (
  <section className="space-y-5">
    {matchesData.matches.map((match) => (
      <article
        key={match.developerProfileId}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
      >
        {/* Developer header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100">
              <UserRound className="h-6 w-6 text-slate-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {match.developer.firstName}{" "}
                {match.developer.lastName}
              </h2>

              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <BriefcaseBusiness className="h-4 w-4" />
                Developer
              </div>
            </div>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
              match.availability === "available"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                match.availability === "available"
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }`}
            />

            {match.availability === "available"
              ? "Available"
              : "Currently Busy"}
          </span>
        </div>

        {/* Skill match summary */}
        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-slate-600" />

              <h3 className="font-semibold text-slate-900">
                Skill Match
              </h3>
            </div>

            <span className="text-sm font-medium text-slate-600">
              {match.skills.matchedCount} of{" "}
              {match.skills.requiredCount} skills matched
            </span>
          </div>

          {/* Matched skills */}
          {match.skills.matched.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Matched Skills
              </p>

              <div className="flex flex-wrap gap-2">
                {match.skills.matched.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing skills */}
          {match.skills.missing.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Skills Not Found
              </p>

              <div className="flex flex-wrap gap-2">
                {match.skills.missing.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Experience */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock3 className="h-4 w-4" />
              Experience
            </div>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              {match.experience.years}{" "}
              {match.experience.years === 1 ? "year" : "years"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">
              Job Requirement
            </div>

            <p className="mt-2 text-lg font-semibold capitalize text-slate-900">
              {match.experience.requirement}
            </p>

            <p
              className={`mt-1 text-xs font-medium ${
                match.experience.meetsRequirement
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            >
              {match.experience.meetsRequirement
                ? "Meets experience requirement"
                : "Below experience requirement"}
            </p>
          </div>
        </div>

        {/* Portfolio evidence */}
        {match.portfolioEvidence.length > 0 && (
          <div className="mt-5 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-slate-600" />

              <h3 className="font-semibold text-slate-900">
                Portfolio Evidence
              </h3>
            </div>

            <div className="mt-4 space-y-3">
              {match.portfolioEvidence.map((project) => (
                <div
                  key={project.projectId}
                  className="rounded-lg bg-slate-50 p-3"
                >
                  <p className="font-medium text-slate-900">
                    {project.title}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-600 ring-1 ring-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reasons */}
        {match.reasons.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Why this developer matches
            </h3>

            <ul className="mt-3 space-y-2">
              {match.reasons.map((reason) => (
                <li
                  key={reason}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    ))}
  </section>
)}

{/* Excluded developers summary */}
<div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
  <p className="text-sm text-slate-500">
    Matching engine excluded{" "}
    <span className="font-semibold text-slate-700">
      {matchesData.meta.excluded.unavailable}
    </span>{" "}
    unavailable developer
    {matchesData.meta.excluded.unavailable === 1 ? "" : "s"}
    {" "}and{" "}
    <span className="font-semibold text-slate-700">
      {matchesData.meta.excluded.noSkillMatch}
    </span>{" "}
    developer
    {matchesData.meta.excluded.noSkillMatch === 1 ? "" : "s"}{" "}
    with no matching skills.
  </p>
</div>
      </div>
    </main>
  );
};

export default JobMatches;