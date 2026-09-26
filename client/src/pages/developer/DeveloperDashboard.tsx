import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "@/hooks/useAuth";
import { useDeveloperDashboard } from "@/hooks/useDeveloperDashboard";
import ErrorState from "@/components/ui/ErrorState";

const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const { data, isLoading, isError, error } = useDeveloperDashboard();

  // Redirect to profile creation if the developer has no profile yet
  const is404 =
    isError && axios.isAxiosError(error) && error.response?.status === 404;

  useEffect(() => {
    if (is404) {
      navigate("/profile", { replace: true });
    }
  }, [is404, navigate]);

  const dashboard = data?.dashboard;
  const stats = dashboard?.stats;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Browse Jobs", icon: BriefcaseBusiness, path: "/jobs" },
  {
    label: "Recommended Jobs",
    icon: Sparkles,
    path: "/developer/jobs/recommendations",
  },
  { label: "Applications", icon: FileText, path: "/applications" },
  { label: "My Profile", icon: UserRound, path: "/profile" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const firstName = user?.firstName || "Developer";
  const initials = user?.firstName?.charAt(0).toUpperCase() || "D";

  // Avoid flashing the dashboard shell while we redirect to /profile
  if (is404) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden border-r border-slate-800 bg-slate-950 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-black text-white shadow-lg shadow-emerald-500/30">
              A
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                AfriLance
              </h1>
              <p className="text-xs text-slate-500">Developer Portal</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="relative flex-1 space-y-2 px-4 py-6">
          <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
            Workspace
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-white" />
                )}

                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive
                      ? "text-white"
                      : "text-slate-500 group-hover:text-emerald-400"
                  }`}
                />

                <span>{item.label}</span>

                {isActive && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-white shadow-sm" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="relative px-4 pb-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 font-bold text-emerald-400">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div className="hidden lg:block">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Workspace
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">
                Developer Dashboard
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-400">Developer</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700 ring-4 ring-emerald-50">
              {initials}
            </div>
          </div>
        </header>

        <main className="p-5 sm:p-8">
          <div className="mx-auto max-w-7xl">


           {/* Welcome Hero */}

<section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
  <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-32 right-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />  <div className="relative max-w-3xl">
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      Developer Workspace
    </div><h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-4xl">
  Welcome back, {firstName} 👋
</h1>

<p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
  Manage your applications, discover new opportunities, and build your
  professional presence on AfriLance.
</p>

<div className="mt-6 flex flex-col gap-3 sm:flex-row">
  <button
    type="button"
    onClick={() => navigate("/jobs")}
    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
  >
    Browse Jobs
    <ArrowRight size={17} />
  </button>

  <button
    type="button"
    onClick={() => navigate("/profile")}
    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
  >
    View Profile
    <UserRound size={17} />
  </button>

  <button
    type="button"
    onClick={() => navigate("/developer/jobs/recommendations")}
    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
  >
    Recommended Jobs
    <Sparkles size={17} />
  </button>
</div>

  </div>
</section>

            {/* Error — only shown for non-404 errors, since 404 triggers a redirect */}
            {isError && !is404 && (
              <div className="mt-8">
                <ErrorState
                  title="Failed to load dashboard"
                  description={
                    error instanceof Error
                      ? error.message
                      : "Something went wrong while loading your dashboard."
                  }
                />
              </div>
            )}

            {/* Stats */}
            <section className="mt-8">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                  Overview
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Your activity
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: "Applications",
                    value: stats?.totalApplications ?? 0,
                    icon: FileText,
                    description: "Total submitted",
                    iconClass: "bg-blue-50 text-blue-600",
                  },
                  {
                    label: "Pending",
                    value: stats?.pendingApplications ?? 0,
                    icon: Clock3,
                    description: "Awaiting response",
                    iconClass: "bg-amber-50 text-amber-600",
                  },
                  {
                    label: "Accepted",
                    value: stats?.acceptedApplications ?? 0,
                    icon: CheckCircle2,
                    description: "Successful applications",
                    iconClass: "bg-emerald-50 text-emerald-600",
                  },
                  {
                    label: "Rejected",
                    value: stats?.rejectedApplications ?? 0,
                    icon: XCircle,
                    description: "Not selected",
                    iconClass: "bg-red-50 text-red-600",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            {item.label}
                          </p>
                          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            {isLoading ? "..." : item.value}
                          </p>
                        </div>

                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconClass}`}
                        >
                          <Icon size={21} />
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

         {/* Recent Applications */}
            <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <FileText size={18} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Recent Applications
                    </h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Track the latest jobs you applied for.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/applications")}
                  className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  View all
                  <ArrowRight size={16} />
                </button>
              </div>

              {isLoading ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500" />
                  <p className="mt-4 text-sm text-slate-500">
                    Loading your applications...
                  </p>
                </div>
              ) : dashboard?.recentApplications?.length ? (
                <div className="divide-y divide-slate-100">
                  {dashboard.recentApplications.map((application) => {
                    const isAccepted = application.status === "accepted";
                    const isRejected = application.status === "rejected";

                    return (
                      <div
                        key={application._id}
                        className="group flex flex-col gap-5 px-6 py-6 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 sm:flex">
                            <BriefcaseBusiness size={20} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-slate-900 transition group-hover:text-emerald-700">
                              {application.job.title}
                            </h3>

                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-slate-500">
                              <span className="font-medium text-slate-700">
                                ${application.bidAmount}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span>{application.estimatedDays} days</span>
                              <span className="text-slate-300">•</span>
                              <span className="capitalize">
                                {application.job.budgetType}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                              isAccepted
                                ? "bg-emerald-50 text-emerald-700"
                                : isRejected
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isAccepted
                                  ? "bg-emerald-500"
                                  : isRejected
                                    ? "bg-red-500"
                                    : "bg-amber-500"
                              }`}
                            />
                            {application.status}
                          </span>

                          <ArrowRight
                            size={17}
                            className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <BriefcaseBusiness size={28} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    No applications yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Start exploring jobs and apply to opportunities that match
                    your skills and experience.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/jobs")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                  >
                    Browse Jobs
                    <ArrowRight size={17} />
                  </button>
                </div>
              )}
            </section>

            {/* Profile CTA */}
            <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* ... (baki daya na wannan sashi bai canza ba — file dinka ya yanke a nan) */}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
