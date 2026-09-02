import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Globe2,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const developers = [
    {
      initials: "AM",
      name: "Amara Okafor",
      role: "Full-Stack Developer",
      skills: "React · Node.js · MongoDB",
    },
    {
      initials: "KM",
      name: "Kofi Mensah",
      role: "AI Engineer",
      skills: "Python · AI · APIs",
    },
    {
      initials: "ZN",
      name: "Zainab Noor",
      role: "Frontend Developer",
      skills: "React · TypeScript · UI",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-emerald-50 blur-3xl" />

      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-16 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-20">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <Sparkles size={16} />
            Built for Africa. Open to the world.
          </div>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            African talent.
            <br />
            <span className="text-emerald-600">
              Global opportunity.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
            AfriLance connects talented African professionals with clients
            looking for exceptional digital skills — from development and
            design to AI and beyond.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row mr-5">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              Start your journey
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              See how it works
            </a>
          </div>

          {/* Trust points */}
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Users size={17} className="text-emerald-600" />
              African professionals
            </div>

            <div className="flex items-center gap-2">
              <BriefcaseBusiness size={17} className="text-emerald-600" />
              Real opportunities
            </div>

            <div className="flex items-center gap-2">
              <Globe2 size={17} className="text-emerald-600" />
              Global clients
            </div>
          </div>
        </motion.div>

        {/* Marketplace Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 sm:p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  AfriLance
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Find the right talent
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Users size={20} />
              </div>
            </div>

            {/* Search */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                <span className="text-sm text-slate-400">
                  Search developers, skills, projects...
                </span>
              </div>
            </div>

            {/* Developer cards */}
            <div className="mt-5 space-y-3">
              {developers.map((developer, index) => (
                <motion.div
                  key={developer.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.45 + index * 0.12,
                  }}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      {developer.initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {developer.name}
                      </p>

                      <p className="truncate text-xs font-medium text-slate-500">
                        {developer.role}
                      </p>

                      <p className="mt-1 truncate text-[11px] text-slate-400">
                        {developer.skills}
                      </p>
                    </div>
                  </div>

                  <span className="ml-3 shrink-0 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700">
                    Available
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block"
          >
            <p className="text-xs font-medium text-slate-500">
              Connecting Africa
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              to the world 🌍
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.95 }}
            className="absolute -right-4 -top-5 hidden rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-xl sm:block"
          >
            <p className="text-xs text-slate-400">
              Marketplace
            </p>

            <p className="mt-0.5 text-sm font-bold">
              Talent + Opportunity
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;