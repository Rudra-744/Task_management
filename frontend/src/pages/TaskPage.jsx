import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import TaskCard from "../components/TaskCard";
import Loading from "../components/Loading";

import {
  CheckCircle2,
  LayoutDashboard,
  Bell,
  Plus,
  LogOut,
  ListTodo,
  User,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("tasks"); // "tasks" | "profile"
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const closeSidebar = () => setSidebarOpen(false);

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed on server, forcing local logout", error);
    } finally {
      setUser(null);
      navigate("/auth");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchFilter =
      filter === "all"
        ? true
        : filter === "completed"
          ? task.completed
          : !task.completed;
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const pending = tasks.filter((t) => !t.completed).length;
  const completed = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex h-screen bg-[#f0ede8] font-sans overflow-hidden">
      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
        fixed md:static z-40 md:z-auto
        h-screen md:h-auto
        w-64 md:w-56
        bg-white m-0 md:m-3 rounded-none md:rounded-2xl shadow-sm
        flex flex-col p-4 gap-1 shrink-0
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-2 pt-2 pb-5">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff0000] text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[12px]">
              DOT
            </span>
            <span className="font-bold text-stone-800 text-base">DOT IT.</span>
          </div>
          <button
            onClick={closeSidebar}
            className="md:hidden text-stone-400 hover:text-stone-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <NavItem
          icon={<ListTodo size={16} />}
          label="My Tasks"
          active={activeView === "tasks" && filter === "all"}
          onClick={() => {
            setFilter("all");
            setActiveView("tasks");
          }}
        />
        {/* <NavItem
          icon={<ListTodo size={16} />}
          label="My Tasks"
          active={false}
          onClick={() => {
            setFilter("all");
            setActiveView("tasks");
          }}
        /> */}
        <NavItem
          icon={<CheckCircle2 size={16} />}
          label="Completed"
          active={activeView === "tasks" && filter === "completed"}
          onClick={() => {
            setFilter("completed");
            setActiveView("tasks");
          }}
        />
        <NavItem
          icon={<Bell size={16} />}
          label="Pending"
          active={activeView === "tasks" && filter === "pending"}
          onClick={() => {
            setFilter("pending");
            setActiveView("tasks");
          }}
        />

        {/* Stats */}
        <div className="mt-auto">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-3">
            <p className="text-xs text-stone-500 mb-2">Progress</p>
            <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
              <span>Done</span>
              <span>
                {tasks.length > 0
                  ? Math.round((completed / tasks.length) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="bg-stone-200 rounded-full h-1.5">
              <div
                className="bg-[#ff0000] h-1.5 rounded-full transition-all"
                style={{
                  width: `${tasks.length > 0 ? (completed / tasks.length) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-stone-500">
              <span>✅ {completed} done</span>
              <span>⏳ {pending} left</span>
            </div>
          </div>

          {/* Profile button */}
          <button
            onClick={() => setActiveView("profile")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium mb-1 transition-colors ${
              activeView === "profile"
                ? "bg-red-50 text-[#ff0000]"
                : "text-stone-500 hover:bg-stone-50"
            }`}
          >
            <User size={15} /> Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col overflow-hidden p-3 md:pl-0">
        {activeView === "profile" ? (
          /* ── Profile View ── */
          <>
            {/* Mobile top bar with hamburger */}
            <div className="md:hidden bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3 mb-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-stone-500 hover:text-stone-800 p-1"
              >
                <Menu size={20} />
              </button>
              <span className="font-semibold text-stone-700 text-sm">
                Profile
              </span>
            </div>
            <ProfileContent />
          </>
        ) : (
          /* ── Tasks View ── */
          <>
            {/* Top bar */}
            <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 mb-3">
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-stone-500 hover:text-stone-800 p-1"
              >
                <Menu size={20} />
              </button>
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-[#f7f5f2] border-0 rounded-xl px-4 py-2 text-sm text-stone-700 outline-none placeholder-stone-400"
              />
            </div>

            {/* Task table */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-auto">
              <div className="hidden md:grid grid-cols-[1fr_140px_120px_100px] gap-4 px-6 py-3 border-b border-stone-100 text-xs font-semibold text-stone-400 uppercase tracking-wide">
                <span>Task</span>
                <span>Date</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {loading ? (
                <Loading message="Loading tasks..." />
              ) : filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2">
                  <span className="text-3xl">🗂️</span>
                  <p className="text-stone-400 text-sm">
                    No tasks assigned to you yet!
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

/* ── Sidebar Nav Item ── */
const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left ${
      active
        ? "bg-red-50 text-[#ff0000] border-l-2 border-[#ff0000]"
        : "text-stone-500 hover:bg-stone-50"
    }`}
  >
    {icon} {label}
  </button>
);

/* ── Profile View (shows in main area, sidebar stays) ── */
const ProfileContent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false); // view mode by default

  useEffect(() => {
    axiosInstance.get("/auth/me").then((res) => {
      setName(res.data.user.name);
      setEmail(res.data.user.email);
    });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .put("/auth/profile", { name })
      .then(() => {
        setMessage("Profile updated! ✅");
        setIsEditing(false);
      })
      .catch((err) => setMessage(err.response?.data?.message || "Error"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm h-full p-8 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 transition-colors"
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      <div className="max-w-xl space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
          <div className="w-16 h-16 bg-[#ff0000] rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-stone-800">{name}</p>
            <p className="text-sm text-stone-400">{email}</p>
          </div>
        </div>

        {isEditing ? (
          /* ── Edit Mode ── */
          <form onSubmit={handleSave} className="space-y-6">
            {/* Name input */}
            <div className="flex items-center gap-8 py-4 border-b border-stone-100">
              <label className="w-32 text-sm font-semibold text-stone-600">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#ff0000] transition-colors"
              />
            </div>
            {/* Email read only */}
            <div className="flex items-center gap-8 py-4 border-b border-stone-100">
              <label className="w-32 text-sm font-semibold text-stone-600">
                Email
              </label>
              <div className="flex-1 flex justify-between items-center">
                <span className="text-sm text-stone-500">{email}</span>
                <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                  Cannot change
                </span>
              </div>
            </div>
            {message && <p className="text-green-600 text-sm">{message}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-sm hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#ff0000] hover:bg-[#cc0000] text-white rounded-xl text-sm font-semibold disabled:opacity-60"
              >
                {loading ? "Saving..." : "✓ Save changes"}
              </button>
            </div>
          </form>
        ) : (
          /* ── View Mode ── */
          <div className="space-y-0">
            <div className="flex items-center gap-8 py-4 border-b border-stone-100">
              <span className="w-32 text-sm font-semibold text-stone-500">
                Full Name
              </span>
              <span className="text-sm text-stone-800 font-medium">{name}</span>
            </div>
            <div className="flex items-center gap-8 py-4 border-b border-stone-100">
              <span className="w-32 text-sm font-semibold text-stone-500">
                Email
              </span>
              <span className="text-sm text-stone-800">{email}</span>
            </div>
            {message && (
              <p className="text-green-600 text-sm pt-4">{message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
