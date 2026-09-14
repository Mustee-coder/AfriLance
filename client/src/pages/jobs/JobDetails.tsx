import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  MapPin,
  Send,
  Settings2,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useJob, useCompleteJob } from "@/hooks/useJobs";

import {
  useJobApplications,
  useMyApplications,
} from "@/hooks/useApplications";

import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";

import { useJobReviews } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";

const JobDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const {
    data: job,
    isLoading,
    isError,
  } = useJob(id ?? "");

  const completeJobMutation = useCompleteJob();

  const { data: applicationsData } = useMyApplications();

  const { data: jobApplicationsData } =
    useJobApplications(
      user?.role === "client" ? id ?? "" : "",
    );

  const { data: jobReviewsData } = useJobReviews(
    job?._id,
  );

  const acceptedApplication =
    user?.role === "client"
      ? jobApplicationsData?.applications.find(
          (application) =>
            application.status === "accepted",
        )
      : applicationsData?.applications.find(
          (application) => {
            const applicationJobId =
              typeof application.job === "string"
                ? application.job
                : application.job._id;

            return (
              applicationJobId === job?._id &&
              application.status === "accepted"
            );
          },
        );

  const acceptedDeveloperId =
    acceptedApplication &&
    (typeof acceptedApplication.developer === "string"
      ? acceptedApplication.developer
      : acceptedApplication.developer._id);

  const clientId =
    typeof job?.client === "string"
      ? job.client
      : job?.client._id;

  const isAcceptedDeveloper =
    user?.role === "developer" &&
    acceptedDeveloperId === user.id;

  const hasApplied =
    user?.role === "developer" &&
    applicationsData?.applications.some(
      (application) => {
        const applicationJobId =
          typeof application.job === "string"
            ? application.job
            : application.job._id;

        return (
          applicationJobId === job?._id &&
          application.status !== "withdrawn"
        );
      },
    );

  const handleCompleteJob = () => {
    if (!job) return;

    completeJobMutation.mutate(job._id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-5 sm:p-8">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-5 w-28 rounded bg-slate-200" />

          <div className="mt-6 h-10 w-2/3 rounded bg-slate-200" />

          <div className="mt-4 h-5 w-1/3 rounded bg-slate-200" />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="h-96 rounded-3xl bg-white" />
            <div className="h-72 rounded-3xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen bg-slate-50 p-5 sm:p-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <BriefcaseBusiness size={28} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Job not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This job may have been removed or is no longer
            available.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                user?.role === "client"
                  ? "/client/jobs"
                  : "/jobs",
              )
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={17} />
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-5 sm:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Back */}
          <button
            type="button"
            onClick={() =>
              navigate(
                user?.role === "client"
                  ? "/client/jobs"
                  : "/jobs",
              )
            }
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
          >
            <ArrowLeft size={17} />
            Back to Jobs
          </button>

          {/* Header */}
          <section className="mt-6 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                  <BriefcaseBusiness size={26} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold capitalize text-emerald-300">
                      {job.status.replace("_", " ")}
                    </span>

                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium capitalize text-slate-300">
                      {job.budgetType}
                    </span>
                  </div>

                  <h1 className="mt-4 max-w-3xl text-2xl font-bold tracking-tight sm:text-4xl">
                    {job.title}
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={16} />

                      Posted{" "}
                      {new Date(
                        job.createdAt,
                      ).toLocaleDateString()}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <MapPin size={16} />
                      AfriLance Marketplace
                    </span>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-5 lg:min-w-44">
                <p className="text-xs font-medium text-slate-400">
                  Budget
                </p>

                <div className="mt-2 flex items-center gap-1">
                  <DollarSign
                    size={20}
                    className="text-emerald-400"
                  />

                  <span className="text-2xl font-bold">
                    {job.budget}
                  </span>
                </div>

                <p className="mt-1 text-xs capitalize text-slate-500">
                  {job.budgetType}
                </p>
              </div>
            </div>
          </section>

          {/* Content */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Main */}
            <section className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-slate-900">
                  Job Description
                </h2>

                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {job.description}
                </p>

                {/* Skills */}
                {job.skills.length > 0 && (
                  <div className="mt-8 border-t border-slate-100 pt-7">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Required Skills
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Sidebar */}
            <aside>
              <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {/* Developer Actions */}
                {user?.role === "developer" && (
                  <>
                    <h2 className="text-lg font-bold text-slate-900">
                      Interested in this job?
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Submit a proposal and show the client why
                      you're the right developer for this project.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/jobs/${job._id}/apply`,
                        )
                      }
                      disabled={
                        job.status !== "open" ||
                        Boolean(hasApplied)
                      }
                      className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition ${
                        hasApplied
                          ? "cursor-not-allowed bg-emerald-50 text-emerald-700"
                          : "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                      }`}
                    >
                      {hasApplied ? (
                        <CheckCircle2 size={17} />
                      ) : (
                        <Send size={17} />
                      )}

                      {hasApplied
                        ? "Applied"
                        : job.status === "open"
                          ? "Apply Now"
                          : "Job Closed"}
                    </button>
                  </>
                )}

                {/* Client Actions */}
                {user?.role === "client" && (
                  <>
                    <h2 className="text-lg font-bold text-slate-900">
                      Manage this job
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Manage your job posting and review
                      developers who have submitted proposals.
                    </p>

                    <div className="mt-6 space-y-3">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/client/jobs/${job._id}/edit`,
                          )
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Settings2 size={17} />
                        Edit Job
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/client/jobs/${job._id}/applications`,
                          )
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                      >
                        <Users size={17} />
                        View Applications
                      </button>

                      {job.status === "in_progress" && (
                        <button
                          type="button"
                          onClick={handleCompleteJob}
                          disabled={
                            completeJobMutation.isPending
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <CheckCircle2 size={17} />

                          {completeJobMutation.isPending
                            ? "Completing..."
                            : "Mark as Completed"}
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* Job Information */}
                <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <DollarSign size={17} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Budget
                      </p>

                      <p className="text-sm font-semibold capitalize text-slate-800">
                        ${job.budget} / {job.budgetType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <Clock3 size={17} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Status
                      </p>

                      <p className="text-sm font-semibold capitalize text-slate-800">
                        {job.status.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <MapPin size={17} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Location
                      </p>

                      <p className="text-sm font-semibold text-slate-800">
                        {job.city}, {job.country}
                      </p>
                    </div>
                  </div>

                  {job.deadline && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <CalendarDays size={17} />
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Deadline
                        </p>

                        <p className="text-sm font-semibold text-slate-800">
                          {new Date(
                            job.deadline,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <CheckCircle2 size={17} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Marketplace
                      </p>

                      <p className="text-sm font-semibold text-slate-800">
                        AfriLance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Reviews */}
          {job.status === "completed" && (
            <div className="mt-8 space-y-6">
              {user?.role === "client" &&
                acceptedDeveloperId && (
                  <ReviewForm
                    revieweeId={acceptedDeveloperId}
                    jobId={job._id}
                  />
                )}

              {isAcceptedDeveloper && clientId && (
                <ReviewForm
                  revieweeId={clientId}
                  jobId={job._id}
                />
              )}

              <ReviewList
                reviews={jobReviewsData?.reviews ?? []}
                averageRating={
                  jobReviewsData?.averageRating ?? 0
                }
                count={jobReviewsData?.count ?? 0}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobDetails;