import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";

import { useAuth } from "@/hooks/useAuth";
import { useClientDashboard } from "@/hooks/useClientDashboard";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useClientDashboard();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dashboard = data?.dashboard;
  const stats = dashboard?.stats;

  const initials = useMemo(() => {
    return `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      window.alert("Failed to logout. Please try again.");
    }
  };

  const navigation = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/client/dashboard",
    },
    {
      label: "Post a Job",
      icon: Plus,
      path: "/client/jobs/new",
    },
    {
      label: "My Jobs",
      icon: BriefcaseBusiness,
      path: "/client/jobs",
    },
    {
      label: "Applications",
      icon: FileText,
      path: "/client/jobs",
    },
    {
      label: "My Profile",
      icon: UserRound,
      path: "/client/profile",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/client/settings",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen">
          <aside className="hidden w-72 bg-slate-950 p-6 lg:block">
            <div className="h-8 w-32 animate-pulse rounded bg-white/10" />

            <div className="mt-10 space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-11 animate-pulse rounded-xl bg-white/10"
                />
              ))}
            </div>
          </aside>

          <main className="flex-1 p-5 sm:p-8">
            <div className="mx-auto max-w-7xl">
              <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />

              <div className="mt-3 h-5 w-80 animate-pulse rounded bg-slate-200" />

              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-32 animate-pulse rounded-3xl bg-white"
                  />
                ))}
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-3">
                <div className="h-96 animate-pulse rounded-3xl bg-white xl:col-span-2" />
                <div className="h-96 animate-pulse rounded-3xl bg-white" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isError || !dashboard || !stats) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <ErrorState
          title="Unable to load dashboard"
          description="We couldn't load your client dashboard right now. Please try again."
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Try Again
            </button>
          }
        />
      </div>
    </div>
  );
}
  const statCards = [
    {
      label: "Total Jobs",
      value: stats.totalJobs,
      icon: BriefcaseBusiness,
      description: "Jobs you've posted",
    },
    {
      label: "Open Jobs",
      value: stats.openJobs,
      icon: TrendingUp,
      description: "Currently accepting proposals",
    },
    {
      label: "In Progress",
      value: stats.inProgressJobs,
      icon: Clock3,
      description: "Jobs currently active",
    },
    {
      label: "Applications",
      value: stats.totalApplications,
      icon: FileText,
      description: "Proposals received",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 px-5 py-6 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-2xl font-black tracking-tight text-white"
          >
            Afri<span className="text-emerald-400">Lance</span>
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Client Account */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Client Account
          </p>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold text-white">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </p>

              <p className="truncate text-xs text-slate-400">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              item.path === "/client/dashboard";

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:pl-72">
        <div className="p-5 sm:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Topbar */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={21} />
              </button>

              <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                {initials}
              </div>
            </div>

            {/* Welcome */}
            <section className="mt-6 overflow-hidden rounded-3xl bg-slate-950 p-6 shadow-xl sm:p-8">
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-emerald-400">
                  Client Dashboard
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Welcome back, {user?.firstName}.
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  Manage your projects, review developer proposals,
                  and find the right talent for your next job.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/client/jobs/new")
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  <Plus size={17} />
                  Post a New Job
                </button>
              </div>
            </section>

            {/* Stats */}
            <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <Icon size={20} />
                      </div>

                      <span className="text-2xl font-bold text-slate-900">
                        {card.value}
                      </span>
                    </div>

                    <p className="mt-5 font-semibold text-slate-900">
                      {card.label}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </section>

            {/* Content */}
            <section className="mt-6 grid gap-6 xl:grid-cols-3">
              {/* Recent Jobs */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Recent Jobs
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Your latest job postings.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/client/jobs")
                    }
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    View all
                  </button>
                </div>

            {dashboard.recentJobs.length === 0 ? (
  <div className="mt-8">
    <EmptyState
      title="No jobs yet"
      description="Post your first job and start receiving proposals."
      action={
        <button
          type="button"
          onClick={() => navigate("/client/jobs/new")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus size={16} />
          Post Job
        </button>
      }
    />
  </div>
) : (
                  <div className="mt-6 space-y-3">
                 
                 
                    {dashboard.recentJobs.map((job) => (
                      <button
                        key={job._id}
                        type="button"
                        onClick={() =>
                          navigate(`/jobs/${job._id}`)
                        }
                        className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/30 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900">
                            {job.title}
                          </h3>

                          <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                            {job.description}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                              {job.status.replace(
                                "_",
                                " ",
                              )}
                            </span>

                            <span className="text-xs text-slate-400">
                              {job.budgetType === "fixed"
                                ? `$${job.budget} fixed`
                                : `$${job.budget}/hr`}
                            </span>
                          </div>
                        </div>

                        <span className="shrink-0 text-sm font-semibold text-emerald-600">
                          View Job →
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-bold text-slate-900">
                  Quick Actions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your hiring workflow.
                </p>

                <div className="mt-6 space-y-3">
                  {/* Post Job */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/client/jobs/new")
                    }
                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <Plus size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Post a Job
                      </p>

                      <p className="text-xs text-slate-500">
                        Find developers for your project.
                      </p>
                    </div>
                  </button>

                  {/* Applications */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/client/jobs")
                    }
                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <FileText size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Review Applications
                      </p>

                      <p className="text-xs text-slate-500">
                        Review proposals from developers.
                      </p>
                    </div>
                  </button>

                  {/* Profile */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/client/profile")
                    }
                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <UserRound size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Complete Profile
                      </p>

                      <p className="text-xs text-slate-500">
                        Build trust with developers.
                      </p>
                    </div>
                  </button>
                </div>

                {/* Tip */}
                <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 size={17} />

                    <p className="text-sm font-semibold">
                      Keep your jobs updated
                    </p>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-emerald-700/80">
                    Clear job descriptions and realistic budgets
                    help attract better developers.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;