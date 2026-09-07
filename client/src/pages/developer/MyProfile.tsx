import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  DollarSign,
  Plus,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  useCreateDeveloperProfile,
  useDeveloperProfile,
  useUpdateDeveloperProfile,
} from "@/hooks/useDeveloperProfile";

import type {
  PortfolioProject,
  ProfileFormData,
} from "@/types/profile";

const profileSchema = z.object({
  bio: z
    .string()
    .max(2000, "Bio must not exceed 2000 characters")
    .optional(),

  skills: z
    .string()
    .min(1, "Add at least one skill"),

  experience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years"),

  hourlyRate: z
    .number()
    .min(0, "Hourly rate cannot be negative"),

  availability: z.enum([
    "available",
    "busy",
    "unavailable",
  ]),
});

interface PortfolioFormItem {
  title: string;
  description: string;
  projectUrl: string;
}

const emptyPortfolioItem: PortfolioFormItem = {
  title: "",
  description: "",
  projectUrl: "",
};

const MyProfile = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useDeveloperProfile();

  const createMutation = useCreateDeveloperProfile();
  const updateMutation = useUpdateDeveloperProfile();

  const [portfolio, setPortfolio] = useState<PortfolioFormItem[]>(
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "",
      skills: "",
      experience: 0,
      hourlyRate: 0,
      availability: "available",
    },
  });

  useEffect(() => {
    if (!data?.profile) return;

    const profile = data.profile;

    reset({
      bio: profile.bio ?? "",
      skills: profile.skills.join(", "),
      experience: profile.experience ?? 0,
      hourlyRate: profile.hourlyRate ?? 0,
      availability: profile.availability ?? "available",
    });

    setPortfolio(
      (profile.portfolio ?? []).map(
        (project: PortfolioProject) => ({
          title: project.title,
          description: project.description,
          projectUrl: project.projectUrl ?? "",
        }),
      ),
    );
  }, [data, reset]);

  const onSubmit = async (formData: ProfileFormData) => {
    const payload = {
      bio: formData.bio?.trim() || undefined,

      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),

      experience: formData.experience,
      hourlyRate: formData.hourlyRate,
      availability: formData.availability,

      portfolio: portfolio
        .filter(
          (project) =>
            project.title.trim() &&
            project.description.trim(),
        )
        .map((project) => ({
          title: project.title.trim(),
          description: project.description.trim(),
          ...(project.projectUrl.trim()
            ? {
                projectUrl: project.projectUrl.trim(),
              }
            : {}),
        })),
    };

    try {
      if (data?.profile) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }
   } catch (error) {
  console.error("Profile save error:", error);

  const message =
    error instanceof Error
      ? error.message
      : "Failed to save profile";

  window.alert(message);
}
  };

  const addPortfolio = () => {
    setPortfolio((current) => [
      ...current,
      { ...emptyPortfolioItem },
    ]);
  };

  const removePortfolio = (index: number) => {
    setPortfolio((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const updatePortfolio = (
    index: number,
    field: keyof PortfolioFormItem,
    value: string,
  ) => {
    setPortfolio((current) =>
      current.map((project, itemIndex) =>
        itemIndex === index
          ? {
              ...project,
              [field]: value,
            }
          : project,
      ),
    );
  };

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  const saveError =
    createMutation.isError || updateMutation.isError;

  const saveSuccess =
    createMutation.isSuccess || updateMutation.isSuccess;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-5 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="h-9 w-56 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-3 h-5 w-80 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 space-y-6">
            <div className="h-80 animate-pulse rounded-3xl bg-white" />
            <div className="h-64 animate-pulse rounded-3xl bg-white" />
            <div className="h-72 animate-pulse rounded-3xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-5 sm:p-8">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <UserRound size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                My Profile
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Build a strong profile to attract better clients.
              </p>
            </div>
          </div>

          {/* Missing profile notice */}
          {isError && !data?.profile && (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  You haven't created your developer profile yet.
                </p>

                <p className="mt-1 text-xs text-amber-700">
                  Complete the form below to create your profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => refetch()}
                className="text-sm font-semibold text-amber-800 underline underline-offset-2"
              >
                Refresh
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >

            {/* Professional Information */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <UserRound size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Professional Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Tell clients what you can do.
                  </p>
                </div>
              </div>

              {/* User information */}
              {data?.profile?.user && (
                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {typeof data.profile.user === "string"
                      ? "Developer"
                      : `${data.profile.user.firstName} ${data.profile.user.lastName}`}
                  </p>

                  {typeof data.profile.user !== "string" &&
                    data.profile.user.email && (
                      <p className="mt-1 text-sm text-slate-500">
                        {data.profile.user.email}
                      </p>
                    )}
                </div>
              )}

              {/* Bio */}
              <div className="mt-6">
                <label
                  htmlFor="bio"
                  className="text-sm font-semibold text-slate-700"
                >
                  Bio
                </label>

                <textarea
                  id="bio"
                  {...register("bio")}
                  rows={5}
                  placeholder="Tell clients about yourself, your strengths, and the type of work you enjoy..."
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                {errors.bio && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div className="mt-6">
                <label
                  htmlFor="skills"
                  className="text-sm font-semibold text-slate-700"
                >
                  Skills
                </label>

                <input
                  id="skills"
                  {...register("skills")}
                  placeholder="React, TypeScript, Node.js, MongoDB"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Separate skills with commas.
                </p>

                {errors.skills && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.skills.message}
                  </p>
                )}
              </div>
            </section>

            {/* Experience / Rate / Availability */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-6 md:grid-cols-3">

                {/* Experience */}
                <div>
                  <label
                    htmlFor="experience"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Experience
                  </label>

                  <div className="relative mt-2">
                    <BriefcaseBusiness
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="experience"
                      type="number"
                      min="0"
                      {...register("experience", {
                        valueAsNumber: true,
                      })}
                      className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Years of experience
                  </p>

                  {errors.experience && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.experience.message}
                    </p>
                  )}
                </div>

                {/* Hourly Rate */}
                <div>
                  <label
                    htmlFor="hourlyRate"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Hourly Rate
                  </label>

                  <div className="relative mt-2">
                    <DollarSign
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="hourlyRate"
                      type="number"
                      min="0"
                      {...register("hourlyRate", {
                        valueAsNumber: true,
                      })}
                      className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    USD per hour
                  </p>

                  {errors.hourlyRate && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.hourlyRate.message}
                    </p>
                  )}
                </div>

                {/* Availability */}
                <div>
                  <label
                    htmlFor="availability"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Availability
                  </label>

                  <select
                    id="availability"
                    {...register("availability")}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="available">
                      Available
                    </option>

                    <option value="busy">
                      Busy
                    </option>

                    <option value="unavailable">
                      Unavailable
                    </option>
                  </select>

                  <p className="mt-2 text-xs text-slate-400">
                    Let clients know when you can work.
                  </p>
                </div>
              </div>
            </section>

            {/* Portfolio */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Portfolio
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Showcase projects you've worked on.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addPortfolio}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Plus size={17} />
                  Add Project
                </button>
              </div>

              {portfolio.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <BriefcaseBusiness
                    className="mx-auto text-slate-400"
                    size={28}
                  />

                  <p className="mt-3 text-sm font-medium text-slate-600">
                    No portfolio projects yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Add your best projects to strengthen your profile.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {portfolio.map((project, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900">
                          Project {index + 1}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            removePortfolio(index)
                          }
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                          aria-label="Remove project"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="mt-4 grid gap-4">
                        <input
                          value={project.title}
                          onChange={(event) =>
                            updatePortfolio(
                              index,
                              "title",
                              event.target.value,
                            )
                          }
                          placeholder="Project title"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />

                        <textarea
                          value={project.description}
                          onChange={(event) =>
                            updatePortfolio(
                              index,
                              "description",
                              event.target.value,
                            )
                          }
                          rows={4}
                          placeholder="Describe the project..."
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />

                        <input
                          value={project.projectUrl}
                          onChange={(event) =>
                            updatePortfolio(
                              index,
                              "projectUrl",
                              event.target.value,
                            )
                          }
                          placeholder="https://example.com"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Save feedback */}
            {saveError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Failed to save your profile. Please check your
                information and try again.
              </div>
            )}

            {saveSuccess && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                Profile saved successfully.
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {isSaving
                  ? "Saving..."
                  : data?.profile
                    ? "Save Changes"
                    : "Create Profile"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default MyProfile;