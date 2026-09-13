import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  DollarSign,
  ExternalLink,
  Loader2,
  Send,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import {
  useJobApplications,
  useUpdateApplicationStatus,
} from "@/hooks/useApplications";

const JobApplications = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const jobId = id ?? "";

  const [selectedApplication, setSelectedApplication] =
    useState<{
      id: string;
      status: "accepted" | "rejected";
    } | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useJobApplications(jobId);

  const updateStatusMutation =
    useUpdateApplicationStatus();

  const applications = data?.applications ?? [];

  const handleStatusUpdate = async () => {
    if (!selectedApplication) return;

    try {
      await updateStatusMutation.mutateAsync({
        applicationId: selectedApplication.id,
        status: selectedApplication.status,
      });

      setSelectedApplication(null);
    } catch {
      // Error is displayed inside the confirmation modal.
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-50 text-emerald-700";

      case "rejected":
        return "bg-red-50 text-red-700";

      case "withdrawn":
        return "bg-slate-100 text-slate-500";

      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";

      default:
        return (
          status.charAt(0).toUpperCase() +
          status.slice(1)
        );
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-5 w-32 rounded bg-slate-200" />

          <div className="mt-8 h-10 w-72 rounded bg-slate-200" />

          <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200" />

          <div className="mt-8 space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 rounded-3xl bg-white"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <ErrorState
            title="Unable to load applications"
            description="Something went wrong while fetching applications for this job."
            action={
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Try Again
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/client/jobs")
                  }
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back to My Jobs
                </button>
              </div>
            }
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <button
          type="button"
          onClick={() =>
            navigate(`/jobs/${jobId}`)
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          Back to Job
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Send size={23} />
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Job Applications
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Review developers who applied to your job
            and choose the right person for your
            project.
          </p>

          <div className="mt-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
            {data?.count ?? applications.length}{" "}
            {applications.length === 1
              ? "Application"
              : "Applications"}
          </div>
        </motion.div>

        {/* Empty */}
        {applications.length === 0 && (
          <div className="mt-8">
            <EmptyState
              title="No applications yet"
              description="Developers haven't submitted any proposals for this job yet. Check back later."
              action={
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/jobs/${jobId}`)
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <ArrowLeft size={17} />
                  Back to Job
                </button>
              }
            />
          </div>
        )}

        {/* Applications */}
        {applications.length > 0 && (
          <div className="space-y-5">
            {applications.map((application, index) => {
              const developer =
                typeof application.developer ===
                "string"
                  ? null
                  : application.developer;

              return (
                <motion.article
                  key={application._id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
                >
                  {/* Top */}
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <User size={21} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-lg font-bold text-slate-950">
                          {developer
                            ? `${developer.firstName} ${developer.lastName}`
                            : "Developer"}
                        </h2>

                        {developer && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/developers/${developer._id}`,
                              )
                            }
                            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
                          >
                            View Developer Profile
                            <ExternalLink size={15} />
                          </button>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <User size={14} />
                            Developer
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={14} />
                            Applied{" "}
                            {new Date(
                              application.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`self-start rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyles(
                        application.status,
                      )}`}
                    >
                      {getStatusLabel(
                        application.status,
                      )}
                    </span>
                  </div>

                  {/* Proposal Info */}
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <DollarSign size={15} />
                        Developer Bid
                      </div>

                      <p className="mt-2 text-lg font-bold text-slate-900">
                        ${application.bidAmount}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <Clock3 size={15} />
                        Estimated Delivery
                      </div>

                      <p className="mt-2 text-lg font-bold text-slate-900">
                        {application.estimatedDays}{" "}
                        {application.estimatedDays === 1
                          ? "day"
                          : "days"}
                      </p>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                    <h3 className="text-sm font-bold text-slate-900">
                      Cover Letter
                    </h3>

                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {application.coverLetter}
                    </p>
                  </div>

                  {/* Actions */}
                  {application.status === "pending" && (
                    <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedApplication({
                            id: application._id,
                            status: "rejected",
                          })
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-100"
                      >
                        <X size={17} />
                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedApplication({
                            id: application._id,
                            status: "accepted",
                          })
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                      >
                        <CheckCircle2 size={17} />
                        Accept Developer
                      </button>
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  selectedApplication.status ===
                  "accepted"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {selectedApplication.status ===
                "accepted" ? (
                  <CheckCircle2 size={22} />
                ) : (
                  <XCircle size={22} />
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(null)
                }
                disabled={
                  updateStatusMutation.isPending
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close confirmation"
              >
                <X size={19} />
              </button>
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              {selectedApplication.status ===
              "accepted"
                ? "Accept this developer?"
                : "Reject this application?"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {selectedApplication.status ===
              "accepted"
                ? "Accepting this developer will start the job and automatically reject the other pending applications."
                : "Are you sure you want to reject this application? This action cannot be undone."}
            </p>

            {updateStatusMutation.isError && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {updateStatusMutation.error instanceof
                Error
                  ? updateStatusMutation.error.message
                  : "Something went wrong. Please try again."}
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(null)
                }
                disabled={
                  updateStatusMutation.isPending
                }
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={
                  updateStatusMutation.isPending
                }
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                  selectedApplication.status ===
                  "accepted"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Processing...
                  </>
                ) : selectedApplication.status ===
                  "accepted" ? (
                  <>
                    <CheckCircle2 size={17} />
                    Accept Developer
                  </>
                ) : (
                  <>
                    <X size={17} />
                    Reject Application
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

export default JobApplications;