import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedTalent = () => {
  const developers = [
    {
      initials: "AM",
      name: "Amara Okafor",
      role: "Full-Stack Developer",
      location: "Lagos, Nigeria",
      skills: ["React", "Node.js", "MongoDB"],
      rating: "4.9",
      projects: "32",
    },
    {
      initials: "KM",
      name: "Kofi Mensah",
      role: "AI Engineer",
      location: "Accra, Ghana",
      skills: ["Python", "AI", "APIs"],
      rating: "5.0",
      projects: "27",
    },
    {
      initials: "ZN",
      name: "Zainab Noor",
      role: "Frontend Developer",
      location: "Abuja, Nigeria",
      skills: ["React", "TypeScript", "UI/UX"],
      rating: "4.8",
      projects: "24",
    },
  ];

  return (
    <section
      id="featured-talent"
      className="relative overflow-hidden bg-white py-24 sm:py-28"
    >
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-emerald-50 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-slate-50 blur-3xl" />

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
              Featured Talent
            </div>

            <h2 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Meet professionals ready to{" "}
              <span className="text-emerald-600">build with you.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Discover skilled professionals across Africa with the
              experience and expertise to bring your next idea to life.
            </p>
          </motion.div>

          <Link
            to="/register"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
          >
            Explore talent
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {developers.map((developer, index) => (
            <motion.div
              key={developer.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-900/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-700">
                  {developer.initials}
                </div>

                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                  <Star size={13} fill="currentColor" />
                  {developer.rating}
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-lg font-bold text-slate-950">
                  {developer.name}
                </h3>

                <p className="mt-1 text-sm font-medium text-emerald-600">
                  {developer.role}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin size={14} />
                  {developer.location}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {developer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs text-slate-400">Completed projects</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {developer.projects}
                  </p>
                </div>

                <Link
                  to="/register"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  View profile
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTalent;