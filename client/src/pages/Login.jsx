import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { loginUser } from "../api/auth";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({
        email,
        password,
      });

      login(res.data);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8">
        <p className="text-pink-500 font-semibold uppercase tracking-widest mb-2 sm:mb-3 text-sm sm:text-base">
          Welcome Back
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
          Login
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm sm:text-base">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="text-gray-500 text-center mt-6 text-sm sm:text-base">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-pink-500 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
