import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe2,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["developer", "client"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "developer",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError("");

      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      navigate("/dashboard");
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* LEFT BRAND PANEL */}
        <section className="relative hidden overflow-hidden bg-slate-950 text-white lg:flex">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

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

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-300">
                <Sparkles size={15} />
                Built for African talent
              </div>

              <h2 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
                Your talent.
                <br />
                <span className="text-emerald-400">
                  Your opportunity.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Join a growing marketplace connecting African professionals
                with clients and opportunities around the world.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Create your professional profile",
                  "Connect with clients and developers",
                  "Discover opportunities globally",
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

        {/* RIGHT FORM */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-5 py-10 sm:px-8">
          <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-emerald-100 blur-3xl lg:hidden" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-md"
          >

            {/* Mobile logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                <Globe2 size={22} />
              </div>

              <span className="text-xl font-bold text-slate-950">
                AfriLance
              </span>
            </div>

            {/* Heading */}
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Get started
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Create your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Join AfriLance and start building your future.
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

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-7 space-y-5"
            >

              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    First name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    {...register("firstName")}
                    placeholder="Mujittapha"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  {errors.firstName && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Last name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    {...register("lastName")}
                    placeholder="Magaji"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  {errors.lastName && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                {errors.email && (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  I want to
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setValue("role", "developer")}
                    className={`rounded-xl border p-4 text-left transition ${
                      selectedRole === "developer"
                        ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/10"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <UserRound
                      size={20}
                      className={
                        selectedRole === "developer"
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }
                    />

                    <p className="mt-2 text-sm font-bold text-slate-900">
                      Find work
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      I'm a developer
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setValue("role", "client")}
                    className={`rounded-xl border p-4 text-left transition ${
                      selectedRole === "client"
                        ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/10"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <BriefcaseBusiness
                      size={20}
                      className={
                        selectedRole === "client"
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }
                    />

                    <p className="mt-2 text-sm font-bold text-slate-900">
                      Hire talent
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      I'm a client
                    </p>
                  </button>
                </div>

                <input type="hidden" {...register("role")} />

                {errors.role && (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("password")}
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
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
                  <p className="mt-2 text-xs text-red-600">
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
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    placeholder="Repeat your password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </motion.button>
            </form>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-emerald-600 transition hover:text-emerald-700"
              >
                Sign in
              </Link>
            </p>

            {/* Security */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} />
              Your information is protected with secure authentication
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default Register;