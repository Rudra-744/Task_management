const EditTaskModal = ({
  editingTask,
  setEditingTask,
  handleUpdateTask,
  users,
}) => {
  if (!editingTask) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="font-bold text-stone-800 mb-4 text-lg">Edit Task</h2>
        <form onSubmit={handleUpdateTask} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1 block">
              Title
            </label>
            <input
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
              required
              className="w-full bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#ff0000]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1 block">
              Description
            </label>
            <input
              value={editingTask.description || ""}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  description: e.target.value,
                })
              }
              className="w-full bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#ff0000]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1 block">
              Assign To
            </label>
            <select
              value={
                editingTask.assignedTo?._id || editingTask.assignedTo || ""
              }
              onChange={(e) =>
                setEditingTask({ ...editingTask, assignedTo: e.target.value })
              }
              required
              className="w-full bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#ff0000]"
            >
              <option value="">Select Employee</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1 block">
              Attachment (Optional)
            </label>
            <input
              type="file"
              onChange={(e) =>
                setEditingTask({ ...editingTask, newFile: e.target.files[0] })
              }
              className="w-full bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#ff0000] file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#ff0000] hover:file:bg-red-100"
            />
            {editingTask.attachmentName && !editingTask.newFile && (
              <p className="text-[10px] text-stone-400 mt-1">
                Current: {editingTask.attachmentName}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setEditingTask(null)}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#ff0000] hover:bg-[#cc0000] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
