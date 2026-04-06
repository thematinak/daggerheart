import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import styles from "../types/cssColor";

const AppLayout = () => {
  const { logout } = useAuth();
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
              Campaign Hub
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-950">DaggerHeart MP</h1>
          </div>

          <nav className="flex items-center gap-2 rounded-full border border-white/70 bg-white/75 p-1 text-sm shadow-sm">
            <Link to="/" className="rounded-full px-4 py-2 font-medium text-slate-700 transition hover:bg-amber-50 hover:text-amber-900">Characters</Link>
            <Link to="/create" className="rounded-full px-4 py-2 font-medium text-slate-700 transition hover:bg-amber-50 hover:text-amber-900">Create</Link>
            <Link to="/login" onClick={logout} className="rounded-full px-4 py-2 font-medium text-slate-700 transition hover:bg-rose-50 hover:text-rose-700">Logout</Link>
          </nav>

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
