import { useState } from "react";
import axiosInstance from "../api/axios";
import {
  CheckCheck,
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  Download,
} from "lucide-react";

const TaskCard = ({ task, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [optimisticCompleted, setOptimisticCompleted] = useState(
    task.completed,
  );

  const handleToggle = async () => {
    const newCompleted = !optimisticCompleted;
    setOptimisticCompleted(newCompleted);
    setLoading(true);
    try {
      await axiosInstance.put(`/tasks/${task._id}`, {
        completed: newCompleted,
      });
      onUpdate();
    } catch {
      setOptimisticCompleted(!newCompleted);
    } finally {
      setLoading(false);
    }
  };

  const dateStr = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`flex flex-col sm:grid sm:grid-cols-[1fr_110px_120px_60px] gap-2 sm:gap-4 sm:items-center px-4 sm:px-6 py-4 border-b border-stone-50 hover:bg-[#faf9f7] transition-colors ${loading ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* Task info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={handleToggle}
          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${
            optimisticCompleted
              ? "bg-[#ff0000] border-[#ff0000]"
              : "border-stone-300 hover:border-[#ff0000]"
          }`}
        >
          {optimisticCompleted && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-medium truncate ${optimisticCompleted ? "line-through text-stone-400" : "text-stone-800"}`}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-stone-400 truncate mt-0.5">
              {task.description}
            </p>
          )}
        </div>

        {task.attachmentUrl && (
          <div className="mt-3 relative group w-48 shrink-0">
            <a
              href={`http://localhost:3000${task.attachmentUrl}`}
              download
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm"
              title="Download Attachment"
            >
              {/* Icon Container with responsive colors */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  task.attachmentName.toLowerCase().endsWith(".pdf")
                    ? "bg-red-50 text-red-500"
                    : task.attachmentName
                          .toLowerCase()
                          .match(/\.(jpg|jpeg|png|gif)$/i)
                      ? "bg-blue-50 text-blue-500"
                      : task.attachmentName
                            .toLowerCase()
                            .match(/\.(xls|xlsx|csv)$/i)
                        ? "bg-emerald-50 text-emerald-500"
                        : "bg-blue-50 text-blue-500"
                }`}
              >
                {task.attachmentName.toLowerCase().endsWith(".pdf") ? (
                  <FileText size={20} />
                ) : task.attachmentName
                    .toLowerCase()
                    .match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <FileImage size={20} />
                ) : task.attachmentName
                    .toLowerCase()
                    .match(/\.(xls|xlsx|csv)$/i) ? (
                  <FileSpreadsheet size={20} />
                ) : (
                  <File size={20} />
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span className="text-xs font-semibold text-stone-700 truncate block">
                  {task.attachmentName || "Attached File"}
                </span>
                <span className="text-[10px] text-stone-400 font-medium uppercase mt-0.5">
                  {task.attachmentName.split(".").pop()} document
                </span>
              </div>

              {/* Hover Download Icon */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Download size={14} className="text-white" />
              </div>
            </a>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:contents">
        <span className="text-xs text-stone-400 font-medium whitespace-nowrap">
          {dateStr}
        </span>

        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
            optimisticCompleted
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {optimisticCompleted ? "✓ Completed" : "In progress"}
        </span>

        {/* Mark complete button — hidden once completed */}
        <div className="ml-auto sm:ml-0 sm:flex sm:justify-end">
          {!optimisticCompleted && (
            <button
              onClick={handleToggle}
              title="Mark Complete"
              className="p-1.5 rounded-lg hover:bg-red-100 text-[#ff0000] transition-colors"
            >
              <CheckCheck size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
