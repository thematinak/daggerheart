import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../common/contexts/AuthProvider";
import styles from "../../common/types/cssColor";
import { useNotifications } from "../../common/contexts/CommonDataProvider";
import { loginUser } from "../../common/endponts/common";
import ThemeToggleButton from "../../common/components/ThemeToggleButton";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const { showError } = useNotifications();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await loginUser(name);
    
    if (result.id && result.username) {
        login({ id: result.id, name: result.username });
      navigate("/");
    } else {
      showError(result.error || "Login failed");
    }
  };

  return (
    <div className={`${styles.tokens.page.shell} flex min-h-screen items-center justify-center p-4`}>
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-[10%] top-20 h-44 w-44 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute right-[12%] bottom-16 h-56 w-56 rounded-full bg-sky-200/20 blur-3xl" />
      </div>
      <div className={`${styles.tokens.page.section} relative z-10 flex w-full max-w-md flex-col gap-6 p-6 sm:p-8`}>
        <div className="flex justify-end">
          <ThemeToggleButton />
        </div>

        <div className="text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--text-accent)]">
            Welcome Back
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--text-primary)]">DaggerHeart MP</h1>
          <p className={`mt-2 ${styles.tokens.page.subtitle}`}>Login to your account</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className={`text-sm font-semibold ${styles.gray.text}`}>
              User name
            </label>
            <input
              type="text"
              className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`${styles.tokens.button.base} ${styles.tokens.button.primary} mt-2`}
          >
            Login
          </button>
        </form>

        <Link to="/register" className="text-center text-sm text-[var(--text-secondary)]">
          Don't have an account? <span className="font-semibold text-[var(--text-accent)] hover:underline">Register</span>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
