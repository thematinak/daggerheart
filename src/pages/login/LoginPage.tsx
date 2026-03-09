import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../common/contexts/AuthProvider";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    

    // TODO: tu neskôr príde API call
    if (email === "test@test.com" && password === "1234") {
        login({
        id: "1",
        email: "test@test.com",
        });
      navigate("/");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 flex flex-col gap-6">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-yellow-600">DaggerHeart MP</h1>
          <p className="text-gray-500 text-sm">Login to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>

        {/* Register */}
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button className="text-yellow-600 font-semibold hover:underline">
            Register
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;