import React from "react";
import { Link2, Mouse, Calendar } from "lucide-react";

function StatsCards({ stats }) {
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Links */}
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10">
        <div className="flex h-[50px] w-[50px] items-center justify-center rounded-xl bg-blue-500/20 text-blue-500">
          <Link2 size={24} />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium text-[#999]">Total Links</h3>
          <p className="m-0 text-[1.75rem] font-bold">{stats.totalUrls}</p>
        </div>
      </div>

      {/* Total Clicks */}
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10">
        <div className="flex h-[50px] w-[50px] items-center justify-center rounded-xl bg-green-500/20 text-green-500">
          <Mouse size={24} />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium text-[#999]">
            Total Clicks
          </h3>
          <p className="m-0 text-[1.75rem] font-bold">{stats.totalClicks}</p>
        </div>
      </div>

      {/* Member Since */}
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10">
        <div className="flex h-[50px] w-[50px] items-center justify-center rounded-xl bg-purple-500/20 text-purple-500">
          <Calendar size={24} />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium text-[#999]">
            Member Since
          </h3>
          <p className="m-0 text-[1.75rem] font-bold">
            {formatDate(stats.memberSince)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
