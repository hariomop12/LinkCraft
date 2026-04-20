import React, { useState } from "react";
import { Search, Filter } from "lucide-react";

function SearchFilterBar({
  searchTerm,
  onSearch,
  selectedTags,
  onTagsChange,
  statusFilter,
  onStatusChange,
}) {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    onSearch(value);
  };

  return (
    <div className="mb-8 flex flex-wrap items-center gap-4">
      {/* Search Bar */}
      <div className="flex min-w-[250px] flex-1 items-center rounded-xl border border-white/20 bg-white/10 p-3">
        <Search size={20} className="mr-2 text-[#999]" />
        <input
          type="text"
          placeholder="Search short code, destination URL, title..."
          value={localSearch}
          onChange={handleSearchChange}
          className="flex-1 bg-transparent text-base text-white outline-none placeholder:text-[#999]"
        />
      </div>

      {/* Advanced Filters */}
      <div className="relative">
        <button
          className="inline-flex items-center gap-2 rounded-lg border border-pink-500 bg-pink-500/20 px-4 py-2 font-medium text-pink-500 transition hover:bg-pink-500/30"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter size={18} />
          Filters
        </button>

        {showAdvanced && (
          <div className="absolute right-0 top-full z-50 mt-2 min-w-[300px] rounded-xl border border-white/20 bg-[#1e1e2e]/95 p-4 backdrop-blur-md">
            {/* Tags Filter */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g., work, blog, important"
                value={selectedTags}
                onChange={(e) => onTagsChange(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm text-white placeholder:text-[#999]"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full cursor-pointer rounded-lg border border-white/20 bg-white/10 p-2 text-sm text-white"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchFilterBar;
