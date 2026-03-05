import { Paperclip } from "lucide-react";

const AdminTaskList = ({ tasks, setEditingTask, handleDeleteTask }) => {
  return (
    <>
      {/* Desktop header */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_150px_120px_120px] gap-4 px-6 py-3 border-b border-stone-100 text-xs font-semibold text-stone-400 uppercase">
        <span>Task</span>
        <span>Assigned To</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-stone-400 text-sm py-10">No tasks yet</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className="flex flex-col sm:grid sm:grid-cols-[1fr_150px_120px_120px] gap-1 sm:gap-4 px-4 sm:px-6 py-3 border-b border-stone-50 sm:items-center"
          >
            <div className="flex flex-col gap-1 min-w-0 pr-4">
              <p className="text-sm font-medium text-stone-800 truncate">
                {task.title}
              </p>
              <p className="text-xs text-stone-400 truncate">
                {task.description}
              </p>
              {task.attachmentUrl && (
                <a
                  href={task.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 mt-1 w-fit max-w-full px-2 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-600 rounded-md transition-colors"
                  title="View Attachment"
                >
                  <Paperclip size={12} className="shrink-0" />
                  <span className="text-[10px] font-medium truncate">
                    {task.attachmentName}
                  </span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-400 sm:hidden">👤</span>
              <span className="text-sm text-stone-600">
                {task.assignedTo?.name || "—"}
              </span>
            </div>
            <div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${task.completed ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-500"}`}
              >
                {task.completed ? "Completed" : "In Progress"}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              <button
                onClick={() => setEditingTask(task)}
                className="text-blue-500 hover:text-blue-700 text-xs font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="text-red-400 hover:text-red-600 text-xs font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default AdminTaskList;
