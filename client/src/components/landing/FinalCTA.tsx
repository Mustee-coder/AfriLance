import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Globe2,
} from "lucide-react";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section className="relative overflow-hidden bg-emerald-600 py-24 sm:py-28">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-emerald-800/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
            <Globe2 size={27} />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-100">
            Your next opportunity starts here
          </p>

          <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ready to build something{" "}
            <span className="text-emerald-100">great?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-emerald-50 sm:text-lg">
            Whether you're looking for your next project or the right person
            to build it, AfriLance helps you make the connection.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-emerald-700 shadow-xl transition hover:bg-emerald-50"
            >
              Get started
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              <Code2 size={17} />
              Join as a developer
            </Link>
          </div>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[
            {
              icon: Code2,
              title: "For Developers",
              text: "Showcase your skills",
            },
            {
              icon: BriefcaseBusiness,
              title: "For Clients",
              text: "Find skilled talent",
            },
            {
              icon: Globe2,
              title: "Built for Africa",
              text: "Connect globally",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur-sm"
              >
                <Icon className="mx-auto text-emerald-100" size={20} />

                <p className="mt-2 text-sm font-bold text-white">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-emerald-100">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;