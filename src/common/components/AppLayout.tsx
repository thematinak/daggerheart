import React, { useEffect, useMemo, useState } from "react";
import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import { ChevronRight, PanelLeftClose, PanelLeftOpen, PlusSquare, Shield, Swords } from "lucide-react";
import { useAuth } from "../contexts/AuthProvider";
import styles from "../types/cssColor";

const AppLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const toolLinks = useMemo(() => ([
    {
      to: "/tools/items/new",
      label: "New Item",
      description: "Create backpack items and consumables.",
      icon: PlusSquare,
    },
    {
      to: "/tools/weapons/new",
      label: "New Weapon",
      description: "Create custom primary and secondary weapons.",
      icon: Swords,
    },
    {
      to: "/tools/armor/new",
      label: "New Armor",
      description: "Create armor entries with thresholds and score.",
      icon: Shield,
    },
  ]), []);

  const isToolRoute = toolLinks.some((link) => location.pathname.startsWith(link.to.replace("/new", "")));

  useEffect(() => {
    setIsToolsOpen(false);
  }, [location.pathname]);

  return (
    <div className={`${styles.tokens.page.shell} flex flex-col`}>
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-[8%] top-20 h-44 w-44 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute right-[10%] top-32 h-52 w-52 rounded-full bg-sky-200/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-40 w-40 rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-amber-700">
              With Love
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-950">DaggerHeart MP</h1>
          </div>

          <nav className="flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/75 p-1 text-sm shadow-sm">
            <NavLink to="/" className={({ isActive }) => `rounded-full px-4 py-2 font-medium transition ${isActive ? "bg-amber-100 text-amber-900" : "text-slate-700 hover:bg-amber-50 hover:text-amber-900"}`}>Characters</NavLink>
            <NavLink to="/create" className={({ isActive }) => `rounded-full px-4 py-2 font-medium transition ${isActive ? "bg-amber-100 text-amber-900" : "text-slate-700 hover:bg-amber-50 hover:text-amber-900"}`}>Create</NavLink>
            <button
              type="button"
              onClick={() => setIsToolsOpen((state) => !state)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium transition ${isToolRoute || isToolsOpen ? "bg-amber-100 text-amber-900" : "text-slate-700 hover:bg-amber-50 hover:text-amber-900"}`}
            >
              {isToolsOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
              Tools
            </button>
            <Link to="/login" onClick={logout} className="rounded-full px-4 py-2 font-medium text-slate-700 transition hover:bg-rose-50 hover:text-rose-700">Logout</Link>
          </nav>

        </div>

        <div
          className={`mx-auto w-full max-w-6xl overflow-hidden px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
            isToolsOpen ? "max-h-72 pb-4 opacity-100" : "max-h-0 pb-0 opacity-0"
          }`}
        >
          <div className="ml-auto w-full max-w-md rounded-[1.5rem] border border-amber-200/80 bg-white/88 p-3 shadow-[0_24px_60px_-40px_rgba(120,53,15,0.45)] backdrop-blur">
            <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              Content Tools
            </div>
            <div className="grid gap-2">
              {toolLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsToolsOpen(false)}
                    className={({ isActive }) => [
                      "flex items-center justify-between rounded-2xl border px-4 py-3 transition",
                      isActive
                        ? "border-amber-300 bg-amber-50 text-amber-900"
                        : "border-slate-200 bg-white/90 text-slate-700 hover:border-amber-200 hover:bg-amber-50/60",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                        <Icon size={18} />
                      </span>
                      <div>
                        <div className="text-sm font-semibold">{link.label}</div>
                        <div className="text-xs text-slate-500">{link.description}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <div className={styles.tokens.page.container}>
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/60 bg-white/55 backdrop-blur-xl">
        <div className={`mx-auto max-w-6xl px-4 py-4 text-center text-sm sm:px-6 lg:px-8 ${styles.semantic.muted.text}`}>
          © {new Date().getFullYear()} DaggerHeart MP
        </div>
      </footer>

    </div>
  );
};

export default AppLayout;
