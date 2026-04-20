import React, { useState } from "react";
import { X } from "lucide-react";

function EditUrlModal({ url, onClose, onSave }) {
  const [formData, setFormData] = useState({
    longUrl: url.longUrl,
    title: url.title || "",
    description: url.description || "",
    tags: url.tags || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(url.id, formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[500px] rounded-2xl border border-white/20 bg-[#1e1e2e]/95 p-6 backdrop-blur-md md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="m-0 text-2xl font-bold">Edit URL</h2>
          <button
            onClick={onClose}
            className="text-[#999] transition hover:text-white"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Destination URL */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold">Destination URL</label>
            <input
              type="url"
              name="longUrl"
              value={formData.longUrl}
              onChange={handleChange}
              placeholder="https://example.com"
              required
              className="rounded-lg border border-white/20 bg-white/10 p-3 text-base text-white placeholder:text-[#666] focus:border-pink-500 focus:outline-none"
            />
          </div>

          {/* Title */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold">
              Title (Optional)
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="My awesome link"
              className="rounded-lg border border-white/20 bg-white/10 p-3 text-base text-white placeholder:text-[#666] focus:border-pink-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a description..."
              rows="3"
              className="resize-none rounded-lg border border-white/20 bg-white/10 p-3 text-base text-white placeholder:text-[#666] focus:border-pink-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Tags */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="work, blog, important"
              className="rounded-lg border border-white/20 bg-white/10 p-3 text-base text-white placeholder:text-[#666] focus:border-pink-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="mt-2 flex justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-[0.95rem] font-semibold text-white transition hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-pink-500 px-6 py-3 text-[0.95rem] font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUrlModal;
