import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe2,
  Handshake,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const WhyAfriLance = () => {
  const benefits = [
    {
      icon: Globe2,
      title: "Built for Africa",
      description:
        "A platform designed around African professionals, businesses, and the growing digital economy.",
    },
    {
      icon: ShieldCheck,
      title: "Trust & Security",
      description:
        "Profiles, applications, hiring, and platform workflows are designed to create a safer professional experience.",
    },
    {
      icon: Handshake,
      title: "Better Connections",
      description:
        "Bring clients and skilled professionals together through one focused marketplace.",
    },
    {
      icon: Zap,
      title: "Simple & Fast",
      description:
        "Discover talent, find opportunities, and move from connection to collaboration without unnecessary complexity.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Sparkles size={14} />
              Why AfriLance
            </div>

            <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              More than a marketplace.{" "}
              <span className="text-emerald-600">
                A professional network.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              AfriLance is built to help African talent compete globally while
              giving businesses a better way to discover and work with skilled
              professionals.
            </p>

            <Link
              to="/register"
              className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:bg-slate-800"
            >
              Join AfriLance
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.55, delay: index * 0.1 }}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-950">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 overflow-hidden rounded-[2rem] bg-slate-950 p-8 sm:p-10 lg:p-12"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Globe2 size={18} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  Africa → The World
                </span>
              </div>

              <h3 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                African skills deserve global opportunities.
              </h3>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Build your reputation, connect with ambitious people, and turn
                your digital skills into meaningful opportunities.
              </p>
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/20">
              <Globe2 size={38} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyAfriLance;