import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import toast from "react-hot-toast";

import AdminSidebar from "../components/admin/AdminSidebar";
import AssignTaskForm from "../components/admin/AssignTaskForm";
import AdminTaskList from "../components/admin/AdminTaskList";
import AdminUserList from "../components/admin/AdminUserList";
import EditTaskModal from "../components/admin/EditTaskModal";

const AdminDashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("/admin/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch tasks failed", err);
      // Optional: import toast if possible, or just log
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
      if (res.data.length === 0) {
        toast.error("No employees found. Please register employees first.");
      }
    } catch (err) {
      console.error("Fetch users failed", err);
      // Surface toast if it's a 401 error
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          setUser(null);
          navigate("/auth");
        }, 1000);
      } else {
        toast.error(
          err.response?.data?.message || "Failed to load employee list",
        );
      }
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🔄 Logging out...");
      await axiosInstance.post("/auth/logout");
      console.log("✓ Server logout successful");
    } catch (error) {
      console.error("❌ Logout failed on server", error);
    } finally {
      console.log("✓ Clearing local auth data");
      setUser(null);
      navigate("/auth");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("assignedTo", form.assignedTo);
      if (form.file) {
        formData.append("file", form.file);
      }

      const response = await axiosInstance.post(
        "/admin/assign-task",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Find the user to immediately populate the new task in the UI local state
      const assignedUser = users.find((u) => u._id === form.assignedTo);
      const newTask = {
        ...response.data.task,
        assignedTo: assignedUser
          ? { name: assignedUser.name, email: assignedUser.email }
          : { name: "—" },
      };

      // Instantly inject the populated task at the top of the tasks list
      setTasks((prevTasks) => [newTask, ...prevTasks]);

      setMessage("Task assigned! ✅");
      setForm({ title: "", description: "", assignedTo: "", file: null });

      // Reset file input value manually
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    await axiosInstance.delete(`/admin/tasks/${id}`);
    fetchTasks();
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editingTask.title);
      formData.append("description", editingTask.description);
      formData.append(
        "assignedTo",
        editingTask.assignedTo._id || editingTask.assignedTo,
      );

      if (editingTask.newFile) {
        formData.append("file", editingTask.newFile);
      }

      await axiosInstance.put(`/admin/tasks/${editingTask._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setEditingTask(null);
      fetchTasks();
      setMessage("Task updated successfully! ✅");
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const handleDeleteUser = async (id) => {
    await axiosInstance.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  const handleRoleChange = async (id, role) => {
    await axiosInstance.put(`/admin/users/${id}/role`, { role });
    fetchUsers();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#f0ede8] font-sans overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Extracted Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        user={user}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden p-3 md:pl-0 gap-3 min-w-0">
        {/* Mobile topbar */}
        <div className="flex items-center gap-3 md:hidden bg-white rounded-2xl shadow-sm px-4 py-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-stone-600 hover:text-stone-900"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <span className="bg-[#ff0000] text-white w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px]">
              DOT
            </span>
            <span className="font-bold text-stone-800 text-sm">DOT IT.</span>
          </div>
          <span className="ml-auto text-xs font-semibold text-[#ff0000]">
            {user?.role === "admin" ? "👑 Admin" : "📋 PM"}
          </span>
        </div>

        {/* Extracted Assign Task Form */}
        <AssignTaskForm
          users={users}
          form={form}
          setForm={setForm}
          loading={loading}
          message={message}
          handleAssign={handleAssign}
        />

        {/* Tab Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-auto min-h-0">
          {activeTab === "tasks" ? (
            <AdminTaskList
              tasks={tasks}
              setEditingTask={setEditingTask}
              handleDeleteTask={handleDeleteTask}
            />
          ) : (
            <AdminUserList
              users={users}
              user={user}
              handleRoleChange={handleRoleChange}
              handleDeleteUser={handleDeleteUser}
            />
          )}
        </div>

        {/* Extracted Edit Task Modal */}
        <EditTaskModal
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          handleUpdateTask={handleUpdateTask}
          users={users}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
