import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const ForClients = () => {
  const features = [
    {
      icon: ClipboardList,
      title: "Post a Job",
      description:
        "Describe your project, requirements, budget, and find professionals who fit your needs.",
    },
    {
      icon: Search,
      title: "Discover Talent",
      description:
        "Search and filter skilled African professionals based on skills, experience, and expertise.",
    },
    {
      icon: UserCheck,
      title: "Hire With Confidence",
      description:
        "Review profiles, portfolios, applications, and choose the right professional for your project.",
    },
    {
      icon: ShieldCheck,
      title: "Manage Projects",
      description:
        "Keep your work organized and move from hiring to successful project completion.",
    },
  ];

  return (
    <section
      id="talent"
      className="relative overflow-hidden bg-slate-50 py-24 sm:py-28"
    >
      {/* Background */}
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-emerald-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Feature Grid */}
          <div className="order-2 grid gap-4 sm:grid-cols-2 lg:order-1">
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
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}

            {/* Talent card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="sm:col-span-2 rounded-3xl border border-emerald-100 bg-emerald-50 p-6"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                    <UsersRound size={14} />
                    African Talent Network
                  </div>

                  <p className="mt-3 text-xl font-bold text-slate-950">
                    Find people who can build.
                  </p>

                  <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                    Connect with professionals across software development,
                    design, AI, data, and other digital disciplines.
                  </p>
                </div>

                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm sm:flex">
                  <UsersRound size={22} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Sparkles size={14} />
              For Clients
            </div>

            <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Find the right people to{" "}
              <span className="text-emerald-600">
                build your vision.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              From a small project to a growing business, connect with skilled
              African professionals who can turn your ideas into real products.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Post projects and opportunities",
                "Discover skilled professionals",
                "Review applications and portfolios",
                "Hire the right talent for your project",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-600"
                >
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-emerald-600"
                  />
                  {item}
                </div>
              ))}
            </div>

            <Link
              to="/register"
              className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:bg-slate-800"
            >
              Start hiring
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ForClients;