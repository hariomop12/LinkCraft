import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onLimitChange,
}) {
  const pageNumbers = [];
  const maxVisible = 5;
  const halfVisible = Math.floor(maxVisible / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between md:gap-6 md:p-6">
      <div className="flex items-center justify-center gap-3 md:justify-start">
        <label className="text-sm font-medium">Items per page:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="cursor-pointer rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>

      <div className="flex flex-1 flex-wrap items-center justify-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 font-semibold text-white transition hover:border-pink-500 hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>

        {/* First Page (if not visible) */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 font-semibold text-white transition hover:border-pink-500 hover:bg-pink-500"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 font-semibold text-[#666]">...</span>
            )}
          </>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border font-semibold transition ${
              currentPage === page
                ? "border-pink-500 bg-pink-500 text-white"
                : "border-white/20 bg-white/10 text-white hover:border-pink-500 hover:bg-pink-500"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Last Page (if not visible) */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 font-semibold text-[#666]">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 font-semibold text-white transition hover:border-pink-500 hover:bg-pink-500"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 font-semibold text-white transition hover:border-pink-500 hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex items-center justify-center md:justify-end">
        <span className="text-sm font-medium text-[#999]">
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  );
}

export default Pagination;
