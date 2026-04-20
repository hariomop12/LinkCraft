import React from "react";
import { Copy, Edit2, Trash2, Eye, EyeOff } from "lucide-react";

function LinksTable({ urls, onEdit, onDelete, onToggleStatus }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/10">
            <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[#ccc] md:p-4">
              Short Code
            </th>
            <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[#ccc] md:p-4">
              Destination
            </th>
            <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[#ccc] md:p-4">
              Clicks
            </th>
            <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[#ccc] md:p-4">
              Tags
            </th>
            <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[#ccc] md:p-4">
              Status
            </th>
            <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[#ccc] md:p-4">
              Created
            </th>
            <th className="p-3 text-center text-xs font-semibold uppercase tracking-wide text-[#ccc] md:p-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr
              key={url.id}
              className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
            >
              {/* Short Code */}
              <td className="p-3 font-mono text-sm md:p-4">
                <div className="flex items-center gap-2">
                  <code className="rounded bg-pink-500/20 px-2 py-1 font-semibold text-pink-500">
                    {url.shortUrl}
                  </code>
                  {url.isCustomCode && <span className="text-xs">✨</span>}
                  <button
                    onClick={() => copyToClipboard(url.fullShortUrl)}
                    className="rounded p-1 text-blue-500 transition hover:text-blue-400"
                    title="Copy full URL"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </td>

              {/* Destination */}
              <td className="max-w-[300px] p-3 text-sm md:p-4">
                <a
                  href={url.longUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-words text-blue-400 transition hover:text-blue-300 hover:underline"
                  title={url.longUrl}
                >
                  {url.title || url.longUrl.substring(0, 40)}...
                </a>
              </td>

              {/* Clicks */}
              <td className="p-3 text-center text-sm md:p-4">
                <span className="inline-block rounded-full bg-green-500/20 px-3 py-1 font-semibold text-green-500">
                  {url.clickCount}
                </span>
              </td>

              {/* Tags */}
              <td className="p-3 text-sm md:p-4">
                {url.tags ? (
                  <div className="flex flex-wrap gap-2">
                    {url.tags.split(",").map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-purple-500/20 px-3 py-1 text-[0.85rem] font-medium text-purple-200"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[#666]">—</span>
                )}
              </td>

              {/* Status */}
              <td className="p-3 text-sm md:p-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-[0.85rem] font-semibold ${
                    url.status === "active"
                      ? "bg-green-500/20 text-green-200"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {url.status === "active" ? "🟢 Active" : "🔴 Disabled"}
                </span>
              </td>

              {/* Created */}
              <td className="p-3 text-sm text-[#999] md:p-4">
                {formatDate(url.createdAt)}
              </td>

              {/* Actions */}
              <td className="p-3 text-center text-sm md:p-4">
                <div className="flex justify-center gap-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => onEdit(url)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 transition hover:bg-blue-500/20 hover:text-blue-400 md:h-8 md:w-8"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>

                  {/* Toggle Status Button */}
                  <button
                    onClick={() => onToggleStatus(url.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 transition hover:bg-amber-500/20 hover:text-amber-400 md:h-8 md:w-8"
                    title={url.status === "active" ? "Disable" : "Enable"}
                  >
                    {url.status === "active" ? (
                      <Eye size={16} />
                    ) : (
                      <EyeOff size={16} />
                    )}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDelete(url.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition hover:bg-red-500/20 hover:text-red-400 md:h-8 md:w-8"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LinksTable;
