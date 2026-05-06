// import React from 'react'

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();
    function handleSubmit(e) {
      e.preventDefault();

      login({
        name: "New User",
        email: "new@email.com",
        role: "customer",
      });

      navigate("/");
    }
  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <p className="text-pink-500 font-semibold uppercase tracking-widest mb-3">
          Create Account
        </p>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Join GlowUp</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <select className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400">
            <option value="customer">Customer</option>
            <option value="stylist">Stylist</option>
          </select>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-full text-lg font-semibold transition"
          >
            Register
          </button>
        </form>

        <p className="text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-500 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;