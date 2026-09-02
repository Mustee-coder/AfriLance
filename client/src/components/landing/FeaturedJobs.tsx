import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  DollarSign,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedJobs = () => {
  const jobs = [
    {
      title: "Build a Modern E-commerce Platform",
      company: "Growing African Startup",
      location: "Remote · Africa",
      budget: "$1,500 – $2,500",
      type: "Fixed Price",
      skills: ["React", "Node.js", "MongoDB"],
      posted: "2 days ago",
    },
    {
      title: "AI-powered Customer Support Dashboard",
      company: "Technology Company",
      location: "Remote · Global",
      budget: "$2,000 – $4,000",
      type: "Fixed Price",
      skills: ["Next.js", "AI", "TypeScript"],
      posted: "1 day ago",
    },
    {
      title: "Frontend Developer for SaaS Product",
      company: "Digital Business",
      location: "Remote",
      budget: "$25 – $40/hr",
      type: "Hourly",
      skills: ["React", "TypeScript", "Tailwind"],
      posted: "3 days ago",
    },
  ];

  return (
    <section
      id="featured-jobs"
      className="relative overflow-hidden bg-slate-50 py-24 sm:py-28"
    >
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-emerald-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <BriefcaseBusiness size={14} />
              Featured Jobs
            </div>

            <h2 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Find opportunities that{" "}
              <span className="text-emerald-600">match your skills.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Explore projects from clients looking for talented professionals
              to turn ideas into real products.
            </p>
          </motion.div>

          <Link
            to="/register"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
          >
            Browse all jobs
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-12 space-y-4">
          {jobs.map((job, index) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-900/5 sm:p-7"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      {job.type}
                    </span>

                    <span className="text-xs text-slate-400">
                      {job.posted}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-950 transition group-hover:text-emerald-700">
                    {job.title}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {job.company}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {job.location}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <DollarSign size={14} />
                      {job.budget}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={14} />
                      {job.posted}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 lg:w-72 lg:shrink-0">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/register"
                    className="group/button inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
                  >
                    View opportunity
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover/button:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 rounded-3xl bg-slate-950 p-7 text-white sm:p-8"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-emerald-400">
                Your next opportunity could be here.
              </p>

              <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to put your skills to work?
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Create your AfriLance profile and start discovering projects
                that match what you do best.
              </p>
            </div>

            <Link
              to="/register"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-500"
            >
              Find work
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedJobs;