import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Globe2,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useForgotPassword } from "@/hooks/usePasswordReset";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<
  typeof forgotPasswordSchema
>;

const ForgotPassword = () => {
  const forgotPasswordMutation = useForgotPassword();

  const [successMessage, setSuccessMessage] = useState("");

  const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<ForgotPasswordFormData>({
  resolver: zodResolver(forgotPasswordSchema),
});

  const onSubmit = async (data: ForgotPasswordFormData) => {
  setSuccessMessage("");

  try {
    await forgotPasswordMutation.mutateAsync(data);

    reset();

    setSuccessMessage(
      "If an account exists with this email, a password reset link has been sent.",
    );
  } catch (error) {
    console.error("Forgot password error:", error);
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
                Get back to
                <br />
                <span className="text-emerald-400">
                  your AfriLance account.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Enter your email address and we'll send you a secure
                link to reset your password.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Secure password recovery",
                  "Time-limited reset link",
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
                Forgot your password?
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter the email address associated with your account
                and we'll send you a reset link.
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

            {forgotPasswordMutation.isError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                Something went wrong. Please try again.
              </motion.div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {forgotPasswordMutation.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending reset link...
                  </>
                ) : (
                  <>
                    Send reset link
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

export default ForgotPassword;