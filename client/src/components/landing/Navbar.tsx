import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe2, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            <Globe2 size={21} />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-950">
            AfriLance
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#talent"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
          >
            Find Talent
          </a>

          <a
            href="#work"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
          >
            Find Work
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
          >
            How It Works
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-100 bg-white md:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-5 sm:px-8">
              <a
                href="#talent"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
              >
                Find Talent
              </a>

              <a
                href="#work"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
              >
                Find Work
              </a>

              <a
                href="#how-it-works"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
              >
                How It Works
              </a>

              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;