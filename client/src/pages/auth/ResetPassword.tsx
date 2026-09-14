import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useResetPassword } from "@/hooks/usePasswordReset";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

type ResetPasswordFormData = z.infer<
  typeof resetPasswordSchema
>;

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const resetPasswordMutation = useResetPassword();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<ResetPasswordFormData>({
  resolver: zodResolver(resetPasswordSchema),
});

  const onSubmit = async (
  data: ResetPasswordFormData,
) => {
  if (!token) {
    return;
  }

  try {
    setSuccessMessage("");

    await resetPasswordMutation.mutateAsync({
      token,
      password: data.password,
    });

    reset({
      password: "",
      confirmPassword: "",
    });

    setSuccessMessage(
      "Your password has been reset successfully.",
    );

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  } catch (error) {
    console.error("Reset password error:", error);
  }
};
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Brand panel */}
        <section className="relative hidden overflow-hidden bg-slate-950 text-white lg:flex">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:40px_40px]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
                <Globe2 size={22} />
              </div>

              <span className="text-xl font-bold tracking-tight">
                AfriLance
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-300">
                <Sparkles size={15} />
                Secure account recovery
              </div>

              <h2 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
                Secure your
                <br />
                <span className="text-emerald-400">
                  AfriLance account.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Create a new password and get back to
                building your future on AfriLance.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Secure password reset",
                  "Time-limited reset token",
                  "Your account stays protected",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-emerald-400"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>© 2026 AfriLance</span>

              <div className="flex items-center gap-2">
                <ShieldCheck size={15} />
                Secure platform
              </div>
            </div>
          </div>
        </section>

        {/* Form panel */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-5 py-10 sm:px-8">
          <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-emerald-100 blur-3xl lg:hidden" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                <Globe2 size={22} />
              </div>

              <span className="text-xl font-bold tracking-tight text-slate-950">
                AfriLance
              </span>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Account recovery
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Create a new password
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Choose a strong password for your AfriLance
                account.
              </p>
            </div>

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              >
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>{successMessage}</span>
              </motion.div>
            )}

            {resetPasswordMutation.isError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                Unable to reset your password. The link may
                have expired or is invalid.
              </motion.div>
            )}

            {!token && (
              <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                Invalid password reset link.
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
            >
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  New password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    {...register("password")}
                    placeholder="Enter new password"
                    className={`w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    placeholder="Confirm new password"
                    className={`w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={
                  resetPasswordMutation.isPending ||
                  !token ||
                  Boolean(successMessage)
                }
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resetPasswordMutation.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Resetting password...
                  </>
                ) : (
                  <>
                    Reset password
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </motion.button>
            </form>

            <Link
              to="/login"
              className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Link>

            <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} />
              Your account is protected with secure authentication
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default ResetPassword;