import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Globe,
  Loader2,
  MapPin,
  Pencil,
  Save,
  X,
} from "lucide-react";

import {
  useClientProfile,
  useUpdateClientProfile,
} from "@/hooks/useClientProfile";

import {
  clientProfileSchema,
  type ClientProfileFormData,
} from "@/types/clientProfile";

const ClientProfile = () => {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useClientProfile();

  const updateMutation = useUpdateClientProfile();

  const [editing, setEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const profile = data?.profile;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientProfileFormData>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      companyName: "",
      companyDescription: "",
      industry: "",
      website: "",
      country: "",
      city: "",
    },
  });

  useEffect(() => {
    if (!profile) return;

    reset({
      companyName: profile.companyName ?? "",
      companyDescription: profile.companyDescription ?? "",
      industry: profile.industry ?? "",
      website: profile.website ?? "",
      country: profile.country ?? "",
      city: profile.city ?? "",
    });
  }, [profile, reset]);

  const onSubmit = async (values: ClientProfileFormData) => {
    try {
      setSuccessMessage("");

      await updateMutation.mutateAsync(values);

      setEditing(false);
      setSuccessMessage(
        "Your company profile has been updated successfully.",
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch {
      // Mutation error is displayed below.
    }
  };

  const handleCancel = () => {
    if (profile) {
      reset({
        companyName: profile.companyName ?? "",
        companyDescription: profile.companyDescription ?? "",
        industry: profile.industry ?? "",
        website: profile.website ?? "",
        country: profile.country ?? "",
        city: profile.city ?? "",
      });
    }

    setEditing(false);
    setSuccessMessage("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-5 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />

          <div className="mt-6 h-52 animate-pulse rounded-3xl bg-white" />

          <div className="mt-6 h-96 animate-pulse rounded-3xl bg-white" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Building2 size={25} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Unable to load profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            We couldn't load your company profile right now.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Building2
            size={32}
            className="mx-auto text-slate-400"
          />

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Complete your company profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Add your company information so developers can learn more
            about you.
          </p>

          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  const inputClass = (hasError: boolean) =>
    `mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
      hasError
        ? "border-red-300 focus:border-red-500"
        : "border-slate-200 focus:border-emerald-500"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 p-5 sm:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/client/dashboard")}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </button>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Company Profile
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage the information developers see about your company.
            </p>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(true);
                setSuccessMessage("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Success */}
        {successMessage && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 size={19} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error */}
        {updateMutation.isError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to update your profile. Please check your information
            and try again.
          </div>
        )}

        {/* Profile Hero */}
        <section className="mt-6 overflow-hidden rounded-3xl bg-slate-950 p-6 shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <Building2 size={30} />
            </div>

            <div>
              <p className="text-sm font-medium text-emerald-400">
                Client Profile
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                {profile.companyName || "Your Company"}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {profile.industry || "Technology Company"}
              </p>
            </div>
          </div>
        </section>

        {/* Company Information */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Company Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep your company information accurate and professional.
              </p>
            </div>

            {editing && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Editing
              </span>
            )}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Company Name */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Company Name
              </label>

              <input
                {...register("companyName")}
                disabled={!editing}
                placeholder="e.g. AfriLance Technologies"
                className={`${inputClass(
                  Boolean(errors.companyName),
                )} disabled:bg-slate-50 disabled:text-slate-500`}
              />

              {errors.companyName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Industry */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Industry
              </label>

              <input
                {...register("industry")}
                disabled={!editing}
                placeholder="e.g. Software & Technology"
                className={`${inputClass(
                  Boolean(errors.industry),
                )} disabled:bg-slate-50 disabled:text-slate-500`}
              />

              {errors.industry && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Globe size={15} />
                Website
              </label>

              <input
                {...register("website")}
                disabled={!editing}
                placeholder="https://example.com"
                className={`${inputClass(
                  Boolean(errors.website),
                )} disabled:bg-slate-50 disabled:text-slate-500`}
              />

              {errors.website && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.website.message}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <MapPin size={15} />
                Country
              </label>

              <input
                {...register("country")}
                disabled={!editing}
                placeholder="e.g. Nigeria"
                className={`${inputClass(
                  Boolean(errors.country),
                )} disabled:bg-slate-50 disabled:text-slate-500`}
              />

              {errors.country && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.country.message}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                City
              </label>

              <input
                {...register("city")}
                disabled={!editing}
                placeholder="e.g. Kano"
                className={`${inputClass(
                  Boolean(errors.city),
                )} disabled:bg-slate-50 disabled:text-slate-500`}
              />

              {errors.city && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.city.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Company Description
              </label>

              <textarea
                {...register("companyDescription")}
                disabled={!editing}
                rows={6}
                placeholder="Tell developers about your company..."
                className={`${inputClass(
                  Boolean(errors.companyDescription),
                )} resize-none disabled:bg-slate-50 disabled:text-slate-500`}
              />

              {errors.companyDescription && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.companyDescription.message}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          {editing && (
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={updateMutation.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>

        {/* Trust Card */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-emerald-500"
            />

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Build trust with developers
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                A complete company profile helps developers understand
                who they will be working with and increases confidence
                when applying to your jobs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
