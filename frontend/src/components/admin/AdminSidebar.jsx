import { X, LogOut, ListTodo, Users } from "lucide-react";

const SideTab = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all ${
      active
        ? "bg-red-50 text-[#ff0000] border-l-2 border-[#ff0000]"
        : "text-stone-500 hover:bg-stone-50"
    }`}
  >
    {icon} {label}
  </button>
);

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  handleTabChange,
  user,
  handleLogout,
}) => {
  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-30 w-56 bg-white shadow-lg flex flex-col p-4 gap-1
        transition-transform duration-300
        md:static md:translate-x-0 md:shadow-sm md:rounded-2xl md:m-3 md:h-auto md:z-auto md:shrink-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo row — close btn only on mobile */}
      <div className="flex items-center justify-between px-2 pt-2 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-[#ff0000] text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[12px]">
            DOT
          </span>
          <span className="font-bold text-stone-800 text-base">DOT IT.</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-stone-400 hover:text-stone-700 p-1"
        >
          <X size={18} />
        </button>
      </div>

      <SideTab
        icon={<ListTodo size={16} />}
        label="All Tasks"
        active={activeTab === "tasks"}
        onClick={() => handleTabChange("tasks")}
      />
      <SideTab
        icon={<Users size={16} />}
        label="Manage Users"
        active={activeTab === "users"}
        onClick={() => handleTabChange("users")}
      />

      <div className="mt-auto">
        <div className="bg-red-50 rounded-xl p-3 mb-3 text-center">
          <span className="text-xs font-semibold text-[#ff0000] uppercase tracking-wide">
            {user?.role === "admin" ? "👑 Admin" : "📋 Project Manager"}
          </span>
          <p className="text-xs text-stone-500 mt-1">{user?.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 text-sm font-medium"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
