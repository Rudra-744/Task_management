import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance, { setToken } from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AdminAuthPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      console.log("🔐 Admin login attempt");
      const res = await axiosInstance.post("/auth/admin-login", form);
      console.log("✓ Login successful:", res.data.user.email);
      
      // Store token for Authorization header
      if (res.data.token) {
        setToken(res.data.token);
      }
      
      // Set user in context
      setUser(res.data.user);
      
      // Navigate to admin
      setTimeout(() => {
        console.log("→ Navigating to /admin");
        navigate("/admin");
      }, 100);
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data?.message);
      setError(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#f0ede8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <span className="bg-[#ff0000] text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">
            DOT
          </span>
          <span className="font-bold text-stone-800 text-xl">DOT IT.</span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-7">
          <h2 className="text-lg font-bold text-stone-800 mb-1">Admin Login</h2>
          <p className="text-stone-400 text-sm mb-6">
            Admin & Project Manager access only
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              required
              className="w-full bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#ff0000] transition-colors"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#ff0000] transition-colors"
            />
            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm"
            >
              {loading ? "Please wait..." : "Sign In"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-stone-400 mt-5">
          Employee?{" "}
          <a href="/auth" className="text-[#ff0000] font-medium">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminAuthPage;
