import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { setToken } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let res;
      const isSignup = !isLogin;
      console.log(`🔐 ${isSignup ? "Signup" : "Login"} attempt`);
      
      if (isLogin) {
        res = await axiosInstance.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
      } else {
        res = await axiosInstance.post("/auth/signup", form);
      }
      
      console.log("✓ Auth successful:", res.data.user.email);
      
      // Store token for Authorization header
      if (res.data.token) {
        setToken(res.data.token);
      }
      
      // Set user in context
      setUser(res.data.user);
      toast.success(res.data.message || "Welcome!");

      if (
        res.data.user.role === "admin" ||
        res.data.user.role === "project_manager"
      ) {
        console.log("→ Navigating to /admin (admin/PM)");
        navigate("/admin");
      } else {
        console.log("→ Navigating to /tasks (employee)");
        navigate("/tasks");
      }
    } catch (err) {
      console.error("❌ Auth failed:", err.response?.data?.message);
      toast.error(err.response?.data?.message || "Something went wrong");
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-lg font-bold text-stone-800 mb-1">
            {isLogin ? "Welcome back 👋" : "Get started today"}
          </h2>
          <p className="text-stone-400 text-sm mb-6">
            {isLogin ? "Sign in to your account" : "Create your free account"}
          </p>

          {/* Toggle */}
          <div className="flex bg-[#f7f5f2] rounded-xl p-1 mb-5">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isLogin ? "bg-white text-stone-800 shadow-sm" : "text-stone-400"}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isLogin ? "bg-white text-stone-800 shadow-sm" : "text-stone-400"}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#ff0000] transition-colors"
              />
            )}
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
              className="w-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm mt-1"
            >
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-stone-400 mt-5">
          Manage your tasks efficiently with DOT IT. ✨
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
