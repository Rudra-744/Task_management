const AdminUserList = ({ users, user, handleRoleChange, handleDeleteUser }) => {
  return (
    <>
      {/* Desktop header */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_160px_130px_80px] gap-4 px-6 py-3 border-b border-stone-100 text-xs font-semibold text-stone-400 uppercase">
        <span>Name</span>
        <span>Email</span>
        <span>Role</span>
        {user?.role === "admin" && <span>Delete</span>}
      </div>

      {/* PM info banner */}
      {user?.role === "project_manager" && (
        <p className="text-xs text-stone-400 px-4 sm:px-6 py-2 bg-orange-50 border-b border-stone-100">
          👀 You can view employees only. Contact Admin to manage users.
        </p>
      )}

      {users.length === 0 ? (
        <p className="text-center text-stone-400 text-sm py-10">No users yet</p>
      ) : (
        users.map((u) => (
          <div
            key={u._id}
            className="flex flex-col sm:grid sm:grid-cols-[1fr_160px_130px_80px] gap-1 sm:gap-4 px-4 sm:px-6 py-3 border-b border-stone-50 sm:items-center"
          >
            <span className="text-sm font-medium text-stone-800">{u.name}</span>
            <span className="text-xs text-stone-500 break-all">{u.email}</span>

            {/* Role change — sirf admin */}
            {user?.role === "admin" ? (
              <select
                value={u.role}
                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                className="text-xs border border-stone-200 rounded-lg px-2 py-1 outline-none w-fit"
              >
                <option value="employee">Employee</option>
                <option value="project_manager">Project Manager</option>
              </select>
            ) : (
              <span className="text-xs text-stone-500">{u.role}</span>
            )}

            {user?.role === "admin" && (
              <button
                onClick={() => handleDeleteUser(u._id)}
                className="text-red-400 hover:text-red-600 text-xs font-medium w-fit"
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </>
  );
};

export default AdminUserList;
