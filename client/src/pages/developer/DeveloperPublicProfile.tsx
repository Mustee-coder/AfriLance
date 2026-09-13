import { Link, useParams } from "react-router-dom";
import {
BriefcaseBusiness,
DollarSign,
MapPin,
UserRound,
} from "lucide-react";

import { usePublicDeveloperProfile } from "@/hooks/useDeveloperProfile";
import { useUserReviews } from "@/hooks/useReviews";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import ReviewList from "@/components/reviews/ReviewList";

const DeveloperPublicProfile = () => {
const { userId } = useParams<{ userId: string }>();

const {
data,
isLoading,
isError,
refetch,
} = usePublicDeveloperProfile(userId);

const {
data: reviewsData,
isLoading: reviewsLoading,
} = useUserReviews(userId);

if (isLoading) {
return <LoadingSpinner />;
}

if (isError || !data?.profile) {
return (
<div className="min-h-screen bg-slate-50 p-5 sm:p-8">
<div className="mx-auto max-w-5xl">
<ErrorState
title="Developer profile unavailable"
description="We couldn't load this developer's profile."
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
const reviews = reviewsData?.reviews ?? [];

return (
<div className="min-h-screen bg-slate-50">
<main className="p-5 sm:p-8">
<div className="mx-auto max-w-5xl space-y-6">

      {/* Profile Header */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600">
            <UserRound size={34} />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {profile.user.firstName}{" "}
              {profile.user.lastName}
            </h1>

            <p className="mt-1 text-sm font-medium capitalize text-emerald-600">
              Developer
            </p>

            {profile.bio && (
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                {profile.bio}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <BriefcaseBusiness size={16} />
                {profile.experience}{" "}
                {profile.experience === 1
                  ? "year"
                  : "years"}{" "}
                experience
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <DollarSign size={16} />
                ${profile.hourlyRate}/hr
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm capitalize text-slate-600">
                <MapPin size={16} />
                {profile.availability}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-bold text-slate-900">
          Skills
        </h2>

        {profile.skills.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="No skills added"
              description="This developer hasn't added any skills yet."
            />
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Portfolio */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-bold text-slate-900">
          Portfolio
        </h2>

        {profile.portfolio.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="No portfolio projects"
              description="This developer hasn't added any portfolio projects yet."
            />
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {profile.portfolio.map((project) => (
              <article
                key={project._id ?? project.title}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <h3 className="font-semibold text-slate-900">
                  {project.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {project.description}
                </p>

                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    View Project →
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {reviewsLoading ? (
          <LoadingSpinner />
        ) : (
          <ReviewList
            reviews={reviews}
            averageRating={reviewsData?.averageRating ?? 0}
            count={reviewsData?.count ?? 0}
          />
        )}
      </section>

      <div>
        <Link
          to="/jobs"
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Jobs
        </Link>
      </div>
    </div>
  </main>
</div>

);
};

export default DeveloperPublicProfile;
