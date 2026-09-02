import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  FolderKanban,
  Sparkles,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const ForDevelopers = () => {
  const features = [
    {
      icon: UserRound,
      title: "Professional Profile",
      description:
        "Showcase your skills, experience, bio, and professional identity.",
    },
    {
      icon: FolderKanban,
      title: "Portfolio",
      description:
        "Present your best projects and give clients proof of your expertise.",
    },
    {
      icon: BriefcaseBusiness,
      title: "Find Opportunities",
      description:
        "Discover jobs that match your skills, experience, and career goals.",
    },
    {
      icon: TrendingUp,
      title: "Build Your Career",
      description:
        "Grow your reputation, complete projects, and unlock better opportunities.",
    },
  ];

  return (
    <section
      id="work"
      className="relative overflow-hidden bg-slate-950 py-24 text-white sm:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Code2 size={14} />
              For Developers
            </div>

            <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Turn your skills into{" "}
              <span className="text-emerald-400">
                real opportunities.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Build your professional presence, showcase your work, connect
              with clients, and grow your career from one powerful platform.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Create a professional developer profile",
                "Showcase your portfolio and projects",
                "Apply to relevant opportunities",
                "Build your reputation and career",
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

            <Link
              to="/register"
              className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-400"
            >
              Start as a developer
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.1,
                  }}
                  className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.07]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 transition group-hover:bg-emerald-500/20">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}

            {/* Mini dashboard card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="sm:col-span-2 rounded-3xl border border-emerald-400/10 bg-gradient-to-br from-emerald-500/10 to-white/[0.03] p-6"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Sparkles size={14} />
                    Developer Growth
                  </div>

                  <p className="mt-3 text-xl font-bold">
                    Your work should open doors.
                  </p>

                  <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                    AfriLance gives developers the tools to present their
                    skills professionally and connect with meaningful work.
                  </p>
                </div>

                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 sm:flex">
                  <TrendingUp size={22} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForDevelopers;