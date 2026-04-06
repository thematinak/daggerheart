import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../common/contexts/AuthProvider";
import styles from "../../common/types/cssColor";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`http://pecen.eu/daggerheart/api1/create_user.php`, {
      method: "POST",
      body: JSON.stringify({ username: name })
    });

    const result = await response.json();

    if (result.id && result.username) {
        login({ id: result.id, name: result.username });
      navigate("/");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <div className={`${styles.tokens.page.shell} flex min-h-screen items-center justify-center p-4`}>
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-[10%] top-20 h-44 w-44 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute right-[12%] bottom-16 h-56 w-56 rounded-full bg-sky-200/20 blur-3xl" />
      </div>
      <div className={`${styles.tokens.page.section} relative z-10 flex w-full max-w-md flex-col gap-6 p-8`}>

        <div className="text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-amber-700">
            New Adventurer
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">DaggerHeart MP</h1>
          <p className={`mt-2 ${styles.tokens.page.subtitle}`}>Create your account</p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
