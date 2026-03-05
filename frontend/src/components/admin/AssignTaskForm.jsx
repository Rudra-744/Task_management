import { Plus } from "lucide-react";

const AssignTaskForm = ({
  users,
  handleAssign,
  form,
  setForm,
  loading,
  message,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-5 shrink-0">
      <h2 className="font-bold text-stone-800 mb-4 flex items-center gap-2 text-sm md:text-base">
        <Plus size={16} className="text-[#ff0000]" /> Assign New Task
      </h2>
      <form
        onSubmit={handleAssign}
        className="flex flex-col sm:flex-row flex-wrap gap-3"
      >
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Task title *"
          required
          className="w-full sm:flex-1 sm:min-w-32 bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#ff0000]"
        />
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="w-full sm:flex-1 sm:min-w-32 bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#ff0000]"
        />
        <select
          value={form.assignedTo}
          onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
          required
          className="w-full sm:flex-1 sm:min-w-32 bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#ff0000]"
        >
          <option value="">Select Employee</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>
        <input
          type="file"
          onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
          className="w-full sm:flex-1 sm:min-w-40 bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#ff0000] file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#ff0000] hover:file:bg-red-100"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-[#ff0000] hover:bg-[#cc0000] text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Assigning..." : "Assign"}
        </button>
      </form>
      {message && <p className="text-green-600 text-xs mt-2">{message}</p>}
    </div>
  );
};

export default AssignTaskForm;
