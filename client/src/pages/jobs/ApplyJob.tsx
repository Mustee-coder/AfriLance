import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Clock, DollarSign, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import { useCreateApplication } from "@/hooks/useApplications";
import { useJob } from "@/hooks/useJobs";

const applySchema = z.object({
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters")
    .max(5000, "Cover letter must not exceed 5000 characters"),

  bidAmount: z
    .number({ error: "Bid amount is required" })
    .min(1, "Bid amount must be greater than 0"),

  estimatedDays: z
    .number({ error: "Estimated days is required" })
    .int("Estimated days must be a whole number")
    .min(1, "Estimated days must be at least 1"),
});

type ApplyFormData = z.infer<typeof applySchema>;

const ApplyJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: job, isLoading, isError } = useJob(id ?? "");
  const createApplication = useCreateApplication();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
  });

  const onSubmit = async (data: ApplyFormData) => {
    if (!id) return;

    try {
      await createApplication.mutateAsync({
  jobId: id,
  coverLetter: data.coverLetter,
  bidAmount: data.bidAmount,
  estimatedDays: data.estimatedDays,

        
      });

      navigate(`/jobs/${id}`);
    } catch {
      // Error is displayed through createApplication.error
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-afri-background px-4 py-10">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="mt-8 h-64 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-afri-background px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-afri-text">
            Job not found
          </h1>

          <button
            type="button"
            onClick={() => navigate("/jobs")}
            className="mt-5 rounded-xl bg-afri-primary px-5 py-3 font-semibold text-white"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-afri-border bg-white px-4 py-3 text-afri-text outline-none transition focus:border-afri-primary focus:ring-2 focus:ring-afri-primary/20";

  return (
    <div className="min-h-screen bg-afri-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate(`/jobs/${id}`)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-afri-primary"
        >
          <ArrowLeft size={18} />
          Back to Job
        </button>

        <div className="overflow-hidden rounded-3xl border border-afri-border bg-white shadow-sm">
          <div className="bg-slate-950 px-6 py-8 text-white sm:px-10">
            <p className="text-sm font-medium text-emerald-400">
              Submit Proposal
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Apply for: {job.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-300">
              <span className="inline-flex items-center gap-2">
                <DollarSign size={16} />
                {job.budget} {job.budgetType}
              </span>

              <span className="inline-flex items-center gap-2">
                <Clock size={16} />
                Tell the client your delivery time
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-7 p-6 sm:p-10"
          >
            <div>
              <label
                htmlFor="coverLetter"
                className="text-sm font-semibold text-afri-text"
              >
                Cover Letter
              </label>

              <textarea
                id="coverLetter"
                rows={8}
                placeholder="Introduce yourself, explain your experience, and tell the client how you will approach this project..."
                {...register("coverLetter")}
                className={`${inputClass} resize-none`}
              />

              {errors.coverLetter && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.coverLetter.message}
                </p>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="bidAmount"
                  className="text-sm font-semibold text-afri-text"
                >
                  Your Bid Amount
                </label>

                <div className="relative">
                  <DollarSign
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="bidAmount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="500"
                    {...register("bidAmount", {
                      valueAsNumber: true,
                    })}
                    className={`${inputClass} pl-11`}
                  />
                </div>

                {errors.bidAmount && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.bidAmount.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="estimatedDays"
                  className="text-sm font-semibold text-afri-text"
                >
                  Estimated Delivery (Days)
                </label>

                <div className="relative">
                  <Clock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="estimatedDays"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="7"
                    {...register("estimatedDays", {
                      valueAsNumber: true,
                    })}
                    className={`${inputClass} pl-11`}
                  />
                </div>

                {errors.estimatedDays && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.estimatedDays.message}
                  </p>
                )}
              </div>
            </div>

            {createApplication.isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {createApplication.error instanceof Error
                  ? createApplication.error.message
                  : "Failed to submit application. Please try again."}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate(`/jobs/${id}`)}
                className="rounded-xl border border-afri-border px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={createApplication.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-afri-primary px-7 py-3 font-semibold text-white transition hover:bg-afri-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} />

                {createApplication.isPending
                  ? "Submitting..."
                  : "Submit Proposal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
