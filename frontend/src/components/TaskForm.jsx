import { useState } from "react";
import axiosInstance from "../api/axios";
import { X, Upload } from "lucide-react";

// task prop = null → Create mode
// task prop = task object → Edit mode
const TaskForm = ({ task, onTaskCreated, onClose }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    task?.image ? `http://localhost:3000/uploads/${task.image}` : null,
  );
  const [loading, setLoading] = useState(false);

  const isEditMode = !!task;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    setLoading(true);
    if (isEditMode) {
      // Edit mode → PUT
      await axiosInstance.put(`/tasks/${task._id}`, formData);
    } else {
      // Create mode → POST
      await axiosInstance.post("/tasks", formData);
    }
    setLoading(false);
    onTaskCreated();
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
        <h2 className="font-bold text-stone-800 text-base">
          {isEditMode ? "Edit Task" : "Create New Task"}
        </h2>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">
            Task Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Finish monthly report"
            required
            className="w-full bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#ff0000] transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            className="w-full bg-[#faf9f7] border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#ff0000] transition-colors resize-none h-20"
          />
        </div>

        {/* Image */}
        <div>
          <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">
            Attachment
          </label>
          <label className="flex items-center gap-3 bg-[#faf9f7] border border-stone-200 border-dashed rounded-xl px-4 py-3 cursor-pointer hover:border-[#ff0000] transition-colors">
            <Upload size={16} className="text-stone-400" />
            <span className="text-sm text-stone-400">
              {image
                ? image.name
                : isEditMode && task.image
                  ? "Change image"
                  : "Choose image (JPG/PNG)"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-2 rounded-xl w-full h-32 object-cover"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-stone-200 text-stone-600 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#ff0000] hover:bg-[#cc0000] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {loading
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
                ? "Save Changes"
                : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
