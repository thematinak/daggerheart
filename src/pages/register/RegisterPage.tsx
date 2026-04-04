import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../common/contexts/AuthProvider";

const LoginPage: React.FC = () => {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 flex flex-col gap-6">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-yellow-600">DaggerHeart MP</h1>
          <p className="text-gray-500 text-sm">Register</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          {/* User Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              User name
            </label>
            <input
              type="text"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded-lg transition"
          >
            Register
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;