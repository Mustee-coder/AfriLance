import { Link, useParams } from "react-router-dom";
import {
  Building2,
  Globe,
  MapPin,
  BriefcaseBusiness,
} from "lucide-react";

import { useClientProfileByUserId } from "@/hooks/useClientProfile";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";

const ClientPublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useClientProfileByUserId(userId ?? "");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !data?.profile) {
    return (
      <div className="min-h-screen bg-slate-50 p-5 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <ErrorState
            title="Client profile unavailable"
            description="We couldn't load this client's profile."
            action={
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Try Again
              </button>
            }
          />
        </div>
      </div>
    );
  }

  const profile = data.profile;

  const user =
    typeof profile.user === "object"
      ? profile.user
      : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-5 sm:p-8">
        <div className="mx-auto max-w-5xl space-y-6">

          {/* Profile Header */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-blue-100 text-blue-600">
                <Building2 size={34} />
              </div>

              <div className="min-w-0 flex-1">

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {profile.companyName ||
                    (user
                      ? `${user.firstName} ${user.lastName}`
                      : "Client")}
                </h1>

                <p className="mt-1 text-sm font-medium capitalize text-blue-600">
                  Client
                </p>

                {profile.companyDescription && (
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                    {profile.companyDescription}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">

                  {profile.industry && (
                    <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      <BriefcaseBusiness size={16} />
                      {profile.industry}
                    </div>
                  )}

                  {(profile.city || profile.country) && (
                    <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      <MapPin size={16} />
                      {[profile.city, profile.country]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}

                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-blue-600 transition hover:text-blue-700"
                    >
                      <Globe size={16} />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Company Information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-bold text-slate-900">
              About the Client
            </h2>

            {profile.companyDescription ? (
              <p className="mt-5 text-sm leading-7 text-slate-600">
                {profile.companyDescription}
              </p>
            ) : (
              <div className="mt-5">
                <EmptyState
                  title="No company description"
                  description="This client hasn't added a company description yet."
                />
              </div>
            )}
          </section>

          {/* Company Details */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-bold text-slate-900">
              Company Details
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Building2 size={16} />
                  Company
                </div>

                <p className="mt-2 font-semibold text-slate-900">
                  {profile.companyName || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <BriefcaseBusiness size={16} />
                  Industry
                </div>

                <p className="mt-2 font-semibold text-slate-900">
                  {profile.industry || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <MapPin size={16} />
                  Location
                </div>

                <p className="mt-2 font-semibold text-slate-900">
                  {[profile.city, profile.country]
                    .filter(Boolean)
                    .join(", ") || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Globe size={16} />
                  Website
                </div>

                {profile.website ? (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block break-all font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {profile.website}
                  </a>
                ) : (
                  <p className="mt-2 font-semibold text-slate-900">
                    Not provided
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Back */}
          <div>
            <Link
              to="/jobs"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Back to Jobs
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ClientPublicProfile;
