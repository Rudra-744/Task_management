import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { ArrowLeft } from "lucide-react";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwdLoading, setPasswdLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [passwdMessage, setPasswdMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/auth/me").then((res) => {
      setName(res.data.user.name);
      setEmail(res.data.user.email);
      setRole(res.data.user.role);
    });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    axiosInstance
      .put("/auth/profile", { name })
      .then(() => {
        setMessage("Profile updated successfully");
      })
      .catch((err) => {
        setMessage(err.response.data.message);
      })
      .finally(() => setLoading(false));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswdLoading(true);
    setPasswdMessage("");

    axiosInstance
      .put("/auth/change-password", { currentPassword, newPassword })
      .then((res) => {
        setPasswdMessage(res.data.message);
        setCurrentPassword("");
        setNewPassword("");
      })
      .catch((err) => {
        setPasswdMessage(
          err.response?.data?.message || "Failed to update password",
        );
      })
      .finally(() => setPasswdLoading(false));
  };

  const formatRole = (role) => {
    if (!role) return "";
    return role
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-[#f0ede8] p-6 pb-12">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-6 text-sm"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-stone-800 mb-8">
              Profile Information
            </h1>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Avatar section */}
              <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
                <div className="w-16 h-16 bg-[#ff0000] rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-stone-800">{name}</p>
                  <p className="text-sm text-stone-400">{email}</p>
                </div>
              </div>

              {/* Name field */}
              <div className="flex items-start gap-8 py-4 border-b border-stone-100">
                <label className="w-32 text-sm font-semibold text-stone-600 pt-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex-1 bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#ff0000] transition-colors"
                />
              </div>

              {/* Email field — read only */}
              <div className="flex items-start gap-8 py-4 border-b border-stone-100">
                <label className="w-32 text-sm font-semibold text-stone-600 pt-2">
                  Email Address
                </label>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-stone-500">{email}</span>
                  <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                    Cannot change
                  </span>
                </div>
              </div>

              {/* Role field — read only */}
              <div className="flex items-start gap-8 py-4 border-b border-stone-100">
                <label className="w-32 text-sm font-semibold text-stone-600 pt-2">
                  Account Role
                </label>
                <div className="flex-1 flex items-center">
                  <span className="text-sm font-medium text-[#ff0000] bg-[#fff0f0] px-4 py-1.5 rounded-full border border-[#ffe0e0]">
                    {formatRole(role)}
                  </span>
                </div>
              </div>

              {/* Success message */}
              {message && <p className="text-green-600 text-sm">{message}</p>}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#ff0000] hover:bg-[#cc0000] text-white rounded-xl text-sm font-semibold disabled:opacity-60"
                >
                  {loading ? "Saving..." : "✓ Save Changes"}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-stone-800 mb-6">Security</h2>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="flex items-start gap-8 py-4 border-b border-stone-100">
                <label className="w-32 text-sm font-semibold text-stone-600 pt-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="flex-1 bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#ff0000] transition-colors"
                />
              </div>

              <div className="flex items-start gap-8 py-4 border-b border-stone-100">
                <label className="w-32 text-sm font-semibold text-stone-600 pt-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="flex-1 bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#ff0000] transition-colors"
                />
              </div>

              {passwdMessage && (
                <p
                  className={`text-sm ${passwdMessage.includes("successfully") ? "text-green-600" : "text-red-500"}`}
                >
                  {passwdMessage}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={passwdLoading}
                  className="px-6 py-2.5 bg-stone-800 hover:bg-black text-white rounded-xl text-sm font-semibold disabled:opacity-60"
                >
                  {passwdLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
