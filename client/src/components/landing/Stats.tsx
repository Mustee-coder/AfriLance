import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Globe2,
  Star,
  Users,
} from "lucide-react";

const Stats = () => {
  const stats = [
    {
      value: "10K+",
      label: "African Professionals",
      icon: Users,
    },
    {
      value: "5K+",
      label: "Opportunities",
      icon: BriefcaseBusiness,
    },
    {
      value: "30+",
      label: "Countries Connected",
      icon: Globe2,
    },
    {
      value: "98%",
      label: "Client Satisfaction",
      icon: Star,
    },
  ];

  return (
    <section className="border-y border-slate-100 bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="group border-slate-200 px-5 py-10 text-center first:border-0 sm:px-8 lg:border-l lg:py-12"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition duration-300 group-hover:scale-110 group-hover:bg-emerald-100">
                <Icon size={19} />
              </div>

              <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {stat.value}
              </p>

              <p className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Stats;