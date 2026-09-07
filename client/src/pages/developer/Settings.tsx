import { useState } from "react";
import {
  Bell,
  LogOut,
  Settings as SettingsIcon,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

const Settings = () => {
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      window.alert("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-5 sm:p-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <SettingsIcon size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Settings
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your account and preferences.
              </p>
            </div>
          </div>

          {/* Account */}
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <UserRound size={19} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Account Information
                </h2>

                <p className="text-sm text-slate-500">
                  Your AfriLance account details.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Full Name
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-2 break-all font-semibold text-slate-900">
                  {user?.email}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Account Type
                </p>

                <p className="mt-2 capitalize font-semibold text-emerald-600">
                  {user?.role}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Security
                </p>

                <div className="mt-2 flex items-center gap-2 font-semibold text-slate-900">
                  <ShieldCheck
                    size={17}
                    className="text-emerald-500"
                  />
                  Protected
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Bell size={19} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Notifications
                </h2>

                <p className="text-sm text-slate-500">
                  Control how AfriLance notifies you.
                </p>
              </div>
            </div>

            <div className="mt-6 divide-y divide-slate-100">
              <div className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">
                    Push notifications
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Receive notifications about your applications.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setNotifications((value) => !value)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    notifications
                      ? "bg-emerald-500"
                      : "bg-slate-300"
                  }`}
                  aria-label="Toggle push notifications"
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                      notifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">
                    Email notifications
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Receive important updates by email.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setEmailNotifications((value) => !value)
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    emailNotifications
                      ? "bg-emerald-500"
                      : "bg-slate-300"
                  }`}
                  aria-label="Toggle email notifications"
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                      emailNotifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Security
                </h2>

                <p className="text-sm text-slate-500">
                  Password management will be handled by Clerk.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800">
                Password management coming soon
              </p>

              <p className="mt-1 text-sm text-amber-700">
                Change password and email verification will be
                added when Clerk authentication is integrated.
              </p>
            </div>
          </section>

          {/* Logout */}
          <section className="mt-6 rounded-3xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Sign out
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Sign out from your AfriLance account on this
                  device.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
