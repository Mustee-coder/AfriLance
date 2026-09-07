import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  DollarSign,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useJobs } from "@/hooks/useJobs";
import { useNavigate } from "react-router-dom";

const BrowseJobs = () => {
const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useJobs();

  const jobs = data?.jobs ?? [];

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return jobs;
    }

    return jobs.filter((job) => {
      const titleMatch = job.title.toLowerCase().includes(query);

      const descriptionMatch = job.description
        .toLowerCase()
        .includes(query);

      const skillsMatch = job.skills.some((skill) =>
        skill.toLowerCase().includes(query),
      );

      return titleMatch || descriptionMatch || skillsMatch;
    });
  }, [jobs, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-5 sm:p-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              Marketplace
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Browse Jobs
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Discover opportunities that match your skills and experience.
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10">
              <Search
                size={20}
                className="shrink-0 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jobs by title, description or skill..."
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-slate-200" />
                    <div className="h-6 w-20 rounded-full bg-slate-200" />
                  </div>

                  <div className="mt-5 h-5 w-2/3 rounded bg-slate-200" />

                  <div className="mt-4 h-4 w-full rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-4/6 rounded bg-slate-200" />

                  <div className="mt-6 flex gap-2">
                    <div className="h-6 w-16 rounded-lg bg-slate-200" />
                    <div className="h-6 w-20 rounded-lg bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && isError && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <BriefcaseBusiness size={26} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-red-800">
                Failed to load jobs
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-600">
                We couldn't load available jobs right now. Please try again.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Jobs */}
          {!isLoading &&
            !isError &&
            filteredJobs.length > 0 && (
              <>
                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                      Opportunities
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      Available Jobs
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {filteredJobs.length}{" "}
                      {filteredJobs.length === 1 ? "job" : "jobs"} found
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredJobs.map((job) => (
                    <article
                      key={job._id}
                      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                    >
                      {/* Top */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <BriefcaseBusiness size={21} />
                        </div>

                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                          {job.status.replace("_", " ")}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-5 line-clamp-2 text-lg font-bold text-slate-900 transition group-hover:text-emerald-700">
                        {job.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                        {job.description}
                      </p>

                      {/* Budget */}
                      <div className="mt-5 flex items-center gap-2">
                        <DollarSign
                          size={17}
                          className="text-emerald-600"
                        />

                        <span className="font-bold text-slate-900">
                          ${job.budget}
                        </span>

                        <span className="text-sm capitalize text-slate-400">
                          / {job.budgetType}
                        </span>
                      </div>

                      {/* Skills */}
                      {job.skills.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {job.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}

                          {job.skills.length > 4 && (
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                              +{job.skills.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock3 size={15} />

                          <span>
                            {new Date(
                              job.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <button
  type="button"
  onClick={() => navigate(`/jobs/${job._id}`)}
  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
>
  View Job

                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

          {/* Empty */}
          {!isLoading &&
            !isError &&
            filteredJobs.length === 0 && (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <BriefcaseBusiness size={26} />
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-900">
                  {search
                    ? "No matching jobs"
                    : "No jobs available yet"}
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {search
                    ? "Try another search term or search for a different skill."
                    : "New opportunities will appear here when clients post jobs."}
                </p>
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default BrowseJobs;