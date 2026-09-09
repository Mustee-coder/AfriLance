import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  Loader2,
  X,
  XCircle,
} from "lucide-react";

import {
  useMyApplications,
  useWithdrawApplication,
} from "@/hooks/useApplications";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 ring-amber-600/10",
    accent: "before:bg-amber-400",
    icon: Clock3,
  },
  accepted: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    accent: "before:bg-emerald-500",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 ring-red-600/10",
    accent: "before:bg-red-400",
    icon: XCircle,
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-slate-100 text-slate-600 ring-slate-500/10",
    accent: "before:bg-slate-300",
    icon: XCircle,
  },
} as const;

const Applications = () => {
  const withdrawMutation = useWithdrawApplication();
  const { data, isLoading, isError, refetch } = useMyApplications();

  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);

  const handleConfirmWithdraw = async () => {
    if (!confirmTarget) return;

    const applicationId = confirmTarget;
    setConfirmTarget(null);
    setWithdrawingId(applicationId);

    try {
      await withdrawMutation.mutateAsync(applicationId);
    } catch {
      setErrorToast("Failed to withdraw application. Please try again.");
    } finally {
      setWithdrawingId(null);
    }
  };

  const [errorToast, setErrorToast] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-5 sm:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="h-8 w-52 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-5 w-80 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-8 grid gap-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
  return (
    <div className="min-h-screen bg-slate-50 p-5 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <ErrorState
          title="Failed to load applications"
          description="Something went wrong while loading your applications."
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Try Again
            </button>
          }
        />
      </div>
    </div>
  );
}
  const applications = data?.applications ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-5 sm:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <FileText size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                My Applications
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Track all the jobs you've applied for.
              </p>
            </div>
          </div>

          {/* Empty */}
{applications.length === 0 ? (
  <div className="mt-8">
    <EmptyState
      title="No applications yet"
      description="You haven't applied to any jobs yet. Browse available jobs and submit your first proposal."
    />
  </div>
) : (
            <div className="mt-8 space-y-5">
              {applications.map((application, index) => {
                const job =
                  typeof application.job === "string"
                    ? null
                    : application.job;

                const status = statusConfig[application.status];
                const StatusIcon = status.icon;
                const isWithdrawingThis = withdrawingId === application._id;

                return (
                  <motion.article
                    key={application._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 ${status.accent} sm:p-7`}
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      {/* Job */}
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                          <BriefcaseBusiness size={21} />
                        </div>

                        <div>
                          <h2 className="text-lg font-bold text-slate-900">
                            {job?.title ?? "Job unavailable"}
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            Applied on{" "}
                            {new Date(
                              application.createdAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <span
                        className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${status.className}`}
                      >
                        <StatusIcon size={14} />
                        {status.label}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <DollarSign size={17} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Your Bid</p>
                          <p className="text-sm font-semibold text-slate-800">
                            ${application.bidAmount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <CalendarDays size={17} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">
                            Estimated Time
                          </p>
                          <p className="text-sm font-semibold text-slate-800">
                            {application.estimatedDays} days
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <FileText size={17} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Proposal</p>
                          <p className="text-sm font-semibold text-slate-800">
                            Submitted
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Cover Letter
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {application.coverLetter}
                      </p>
                    </div>

                    {application.status === "pending" && (
                      <div className="mt-5 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setConfirmTarget(application._id)}
                          disabled={isWithdrawingThis}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isWithdrawingThis ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Withdrawing...
                            </>
                          ) : (
                            "Withdraw Application"
                          )}
                        </button>
                      </div>
                    )}
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Confirm Withdraw Modal */}
      <AnimatePresence>
        {confirmTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
            onClick={() => setConfirmTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle size={22} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Withdraw application?
              </h3>
              <p className="mt-1.5 text-sm text-slate-500">
                This action can't be undone. You'll need to apply again if you
                change your mind.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmTarget(null)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmWithdraw}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Withdraw
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-slate-950 px-4 py-3 text-sm text-white shadow-2xl"
          >
            <XCircle size={16} className="text-red-400" />
            {errorToast}
            <button
              type="button"
              onClick={() => setErrorToast(null)}
              className="text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Applications;