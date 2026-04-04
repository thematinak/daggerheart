import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import styles from "../types/cssColor";

const AppLayout = () => {
  const {logout} = useAuth();
  return (
    <div className="min-h-screen flex flex-col">

      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">

          <h1 className="font-bold text-xl">DaggerHeart MP</h1>

          <nav className="flex gap-6">
            <Link to="/">Characters</Link>
            <Link to="/create">Create</Link>
            <Link to="/login" onClick={logout}>Logout</Link>
          </nav>

        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t">
        <div className={`max-w-6xl mx-auto px-6 py-4 text-center text-sm ${styles.gray.lightText}`}>
          © {new Date().getFullYear()} DaggerHeart MP
        </div>
      </footer>

    </div>
  );
};

export default AppLayout;