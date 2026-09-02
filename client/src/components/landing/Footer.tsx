import { Link } from "react-router-dom";
import { ArrowUpRight, Globe2, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { label: "in", name: "LinkedIn" },
    { label: "GH", name: "GitHub" },
    { label: "X", name: "X" },
    { label: "f", name: "Facebook" },
  ];

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                <Globe2 size={22} />
              </div>

              <span className="text-xl font-bold tracking-tight">
                AfriLance
              </span>
            </Link>

            <p className="mt-6 text-sm leading-7 text-slate-400">
              Connecting African talent with global opportunities. Build your
              career, find skilled professionals, and turn ideas into reality.
            </p>

            {/* Social Links */}
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 text-xs font-bold text-slate-400 transition hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {/* Find Work */}
            <div>
              <h3 className="text-sm font-bold text-white">
                Find Work
              </h3>

              <div className="mt-5 space-y-3">
                <Link
                  to="/register"
                  className="block text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  Browse Jobs
                </Link>

                <Link
                  to="/register"
                  className="block text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  Create Profile
                </Link>

                <Link
                  to="/register"
                  className="block text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  Join as Developer
                </Link>
              </div>
            </div>

            {/* Find Talent */}
            <div>
              <h3 className="text-sm font-bold text-white">
                Find Talent
              </h3>

              <div className="mt-5 space-y-3">
                <Link
                  to="/register"
                  className="block text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  Discover Talent
                </Link>

                <Link
                  to="/register"
                  className="block text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  Post a Job
                </Link>

                <Link
                  to="/register"
                  className="block text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  Start Hiring
                </Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-bold text-white">
                Company
              </h3>

              <div className="mt-5 space-y-3">
                <a
                  href="#how-it-works"
                  className="block text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  How It Works
                </a>

                <a
                  href="#featured-talent"
                  className="block text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  Our Talent
                </a>

                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  About AfriLance
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-bold text-white">
                Resources
              </h3>

              <div className="mt-5 space-y-3">
                <a
                  href="#"
                  className="block text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  Help Center
                </a>

                <a
                  href="mailto:support@afrilance.com"
                  className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  <Mail size={14} />
                  Contact Us
                </a>

                <a
                  href="#"
                  className="block text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  Community
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-5 border-t border-slate-800 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {currentYear} AfriLance. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500">
            <a
              href="#"
              className="transition hover:text-emerald-400"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="transition hover:text-emerald-400"
            >
              Terms of Service
            </a>

            <a
              href="#"
              className="transition hover:text-emerald-400"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;