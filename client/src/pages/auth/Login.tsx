import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError("");

      await login(data);

      navigate("/dashboard");
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* ───────────────── LEFT BRAND PANEL ───────────────── */}
        <section className="relative hidden overflow-hidden bg-slate-950 text-white lg:flex">
          {/* Decorative gradients */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:40px_40px]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
                <Globe2 size={22} />
              </div>

              <span className="text-xl font-bold tracking-tight">
                AfriLance
              </span>
            </motion.div>

            {/* Main message */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-xl"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-300">
                <Sparkles size={15} />
                Africa's digital talent marketplace
              </div>

              <h2 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
                African talent.
                <br />
                <span className="text-emerald-400">
                  Global opportunity.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Connect with talented African developers, discover global
                opportunities, and build the future together.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Find skilled developers",
                  "Work with clients globally",
                  "Build your professional career",
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

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>© 2026 AfriLance</span>

              <div className="flex items-center gap-2">
                <ShieldCheck size={15} />
                Secure platform
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────── RIGHT LOGIN PANEL ───────────────── */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-5 py-10 sm:px-8">

          {/* Mobile decorative glow */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-emerald-100 blur-3xl lg:hidden" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
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

            {/* Heading */}
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Welcome back
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Sign in to your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Continue building your future with AfriLance.
              </p>
            </div>

            {/* Error */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {serverError}
              </motion.div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  }`}
                />

                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password")}
                    placeholder="Enter your password"
                    className={`w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </motion.button>
            </form>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-emerald-600 transition hover:text-emerald-700"
              >
                Create your account
              </Link>
            </p>

            {/* Trust */}
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

export default Login;