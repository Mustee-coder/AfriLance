import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  RefreshCw,
  Trash2,
  X,
  Loader2,
  Users,
} from "lucide-react";
import { useMyJobs, useDeleteJob } from "@/hooks/useJobs";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";

const formatBudget = (
  budget: number,
  budgetType: "fixed" | "hourly",
) => {
  return budgetType === "hourly"
    ? `$${budget}/hr`
    : `$${budget}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const statusStyles: Record<string, string> = {
  open: "bg-emerald-50 text-emerald-700",
  in_progress: "bg-blue-50 text-blue-700",
  completed: "bg-purple-50 text-purple-700",
  cancelled: "bg-red-50 text-red-700",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const MyJobs = () => {
  const navigate = useNavigate();

  const deleteJobMutation = useDeleteJob();

  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useMyJobs();

  const jobs = data?.jobs ?? [];

  const jobToDelete = jobs.find(
    (job) => job._id === deleteJobId,
  );

  const handleDelete = async () => {
    if (!deleteJobId) return;

    try {
      await deleteJobMutation.mutateAsync(deleteJobId);
      setDeleteJobId(null);
    } catch {
      // Delete error is displayed inside the modal.
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
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
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <BriefcaseBusiness size={24} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              My Jobs
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage the jobs you have posted and track their progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/client/jobs/new")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            <Plus size={18} />
            Post a Job
          </button>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-5 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="mt-8">
            <ErrorState
              title="Unable to load your jobs"
              description="Something went wrong while fetching your jobs."
              action={
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              }
            />
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && jobs.length === 0 && (
          <div className="mt-8">
            <EmptyState
              title="No jobs yet"
              description="You haven't posted any jobs yet. Create your first job and start finding talented developers."
              action={
                <button
                  type="button"
                  onClick={() => navigate("/client/jobs/new")}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  <Plus size={18} />
                  Post Your First Job
                </button>
              }
            />
          </div>
        )}

        {/* Jobs */}
        {!isLoading && !isError && jobs.length > 0 && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                {data?.count ?? jobs.length}{" "}
                {jobs.length === 1 ? "job" : "jobs"} posted
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {jobs.map((job, index) => (
                <motion.article
                  key={job._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-slate-950">
                        {job.title}
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        Posted {formatDate(job.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        statusStyles[job.status] ??
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {statusLabels[job.status] ?? job.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {job.description}
                  </p>

                  {/* Meta */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <BriefcaseBusiness
                        size={16}
                        className="text-emerald-600"
                      />
                      <span>
                        {formatBudget(
                          job.budget,
                          job.budgetType,
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock3
                        size={16}
                        className="text-emerald-600"
                      />
                      <span className="capitalize">
                        {job.experienceLevel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin
                        size={16}
                        className="text-emerald-600"
                      />
                      <span>
                        {job.city}, {job.country}
                      </span>
                    </div>

                    {job.deadline && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays
                          size={16}
                          className="text-emerald-600"
                        />
                        <span>
                          {formatDate(job.deadline)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {job.skills.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {job.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}

                      {job.skills.length > 5 && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                          +{job.skills.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-between gap-2 border-t border-slate-100 pt-5">
                    <div className="flex min-w-0 items-center gap-2">
                      {/* View Job */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/jobs/${job._id}`)
                        }
                        title="View Job"
                        aria-label="View Job"
                        className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
                      >
                        <span>View Job</span>
                        <ChevronRight
                          size={16}
                          className="transition group-hover:translate-x-0.5"
                        />
                      </button>

                      {/* View Matches */}
                      {job.status === "open" && (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/client/jobs/${job._id}/matches`,
                            )
                          }
                          title="View Matches"
                          aria-label="View Matches"
                          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 sm:px-4"
                        >
                          <Users size={16} />
                          <span className="hidden sm:inline">
                            View Matches
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteJobId(job._id)
                      }
                      title="Delete Job"
                      aria-label="Delete Job"
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-100 sm:px-4"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">
                        Delete
                      </span>
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteJobId && jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            {/* Close */}
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Trash2 size={22} />
              </div>

              <button
                type="button"
                onClick={() => setDeleteJobId(null)}
                disabled={deleteJobMutation.isPending}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close delete confirmation"
              >
                <X size={19} />
              </button>
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              Delete this job?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                "{jobToDelete.title}"
              </span>
              ? This action cannot be undone.
            </p>

            {/* Delete Error */}
            {deleteJobMutation.isError && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {deleteJobMutation.error instanceof Error
                  ? deleteJobMutation.error.message
                  : "Failed to delete job. Please try again."}
              </div>
            )}

            {/* Modal Actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteJobId(null)}
                disabled={deleteJobMutation.isPending}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteJobMutation.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteJobMutation.isPending ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete Job
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
};

export default MyJobs;

