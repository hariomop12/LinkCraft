import React from "react";
import { AlertTriangle, X } from "lucide-react";

function DeleteConfirmModal({ onConfirm, onCancel, urlShortCode }) {
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[400px] rounded-2xl border border-white/20 bg-[#1e1e2e]/95 p-6 text-center backdrop-blur-md md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="mb-4 text-red-500">
          <AlertTriangle size={48} />
        </div>

        {/* Content */}
        <h2 className="m-0 text-xl font-bold">Delete URL?</h2>
        <p>
          Are you sure you want to delete <strong>{urlShortCode}</strong>?
        </p>
        <p className="mt-4 font-semibold text-red-500">
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-[0.95rem] font-semibold text-white transition hover:bg-white/20"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-6 py-3 text-[0.95rem] font-semibold text-white transition hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
