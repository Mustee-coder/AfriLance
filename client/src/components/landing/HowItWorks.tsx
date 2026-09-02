import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Globe2,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create your profile",
      description:
        "Build a professional profile that showcases your skills, experience, portfolio, and expertise.",
      icon: UserRound,
    },
    {
      number: "02",
      title: "Find the right match",
      description:
        "Discover opportunities or talented professionals that match your goals, skills, budget, and project needs.",
      icon: BriefcaseBusiness,
    },
    {
      number: "03",
      title: "Work & grow",
      description:
        "Connect, collaborate, complete projects, and build a stronger professional reputation.",
      icon: Globe2,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white py-24 sm:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-40 h-80 w-80 rounded-full bg-emerald-50 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-slate-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <CheckCircle2 size={14} />
            Simple & powerful
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Everything starts with{" "}
            <span className="text-emerald-600">one connection.</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-500 sm:text-lg">
            Whether you're looking for work or looking for talent, AfriLance
            makes the process simple, transparent, and professional.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          {/* Connecting line */}
          <div className="absolute left-[16.66%] right-[16.66%] top-8 hidden h-px bg-slate-200 md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.12,
                }}
                className="group relative"
              >
                {/* Number / icon */}
                <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 transition duration-300 group-hover:scale-105 group-hover:shadow-emerald-600/30">
                  <Icon size={25} />
                </div>

                {/* Card */}
                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-emerald-200 group-hover:shadow-xl group-hover:shadow-slate-900/5">
                  <p className="text-xs font-bold tracking-[0.2em] text-emerald-600">
                    STEP {step.number}
                  </p>

                  <h3 className="mt-3 text-xl font-bold text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 flex justify-center"
        >
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:bg-slate-800"
          >
            Join AfriLance
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;