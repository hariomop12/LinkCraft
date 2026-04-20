import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCw } from "lucide-react";
import SearchFilterBar from "./SearchFilterBar";
import StatsCards from "./StatsCards";
import LinksTable from "./LinksTable";
import Pagination from "./Pagination";
import EditUrlModal from "./EditUrlModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

function Dashboard() {
  const navigate = useNavigate();

  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
  });

  const [stats, setStats] = useState({
    totalUrls: 0,
    totalClicks: 0,
    memberSince: null,
  });

  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [editingUrl, setEditingUrl] = useState(null);
  const [deletingUrlId, setDeletingUrlId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ✅ FETCH URLS (filtered + paginated)
  const fetchUrls = useCallback(
    async (pageNum = 1, { silent = false } = {}) => {
      if (!token) return navigate("/login");

      try {
        if (!silent) {
          setLoading(true);
          setError("");
        }

        const params = new URLSearchParams({
          q: searchTerm,
          tags: selectedTags,
          status: statusFilter,
          page: pageNum,
          limit,
        });

        const res = await fetch(
          `${backendUrl}/api/url/dashboard/search?${params}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch URLs");

        const data = await res.json();

        setUrls(data.urls || []);
        setPagination(data.pagination || {});
        setPage(pageNum);
      } catch (err) {
        if (!silent) setError(err.message);
        else console.error("Silent URL refresh failed:", err);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [
      searchTerm,
      selectedTags,
      statusFilter,
      limit,
      token,
      backendUrl,
      navigate,
    ],
  );

   const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/api/url/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Stats fetch failed");

      const data = await res.json();

      setStats({
        totalUrls: data.totalUrls,
        totalClicks: data.totalClicks,
        memberSince: data.memberSince,
      });
    } catch (err) {
      console.error("Stats error:", err);
    }
  }, [backendUrl, token]);

  // ✅ INITIAL LOAD
  useEffect(() => {
    fetchUrls(1);
    fetchStats();
  }, [fetchUrls, fetchStats]);

  // ✅ AUTO REFRESH ONLY STATS
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
      fetchUrls(page, { silent: true });
    }, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, [fetchStats, fetchUrls, page]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUrls(page), fetchStats()]);
    setRefreshing(false);
  };

  return (
    <div className="bg-linear-to-br from-[#1e1e2e] to-[#2d2d44] text-white md:p-8 pt-6 rounded-2xl max-w-6xl mx-auto">
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearch={(t) => {
          setSearchTerm(t);
          setPage(1);
        }}
        selectedTags={selectedTags}
        onTagsChange={(t) => {
          setSelectedTags(t);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(s) => {
          setStatusFilter(s);
          setPage(1);
        }}
      />

      <div className="mb-4 flex justify-end">
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-lg"
        >
          <RotateCw className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <StatsCards stats={stats} />

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-400">{error}</div>}

      {!loading && urls.length > 0 && (
        <>
          <LinksTable urls={urls} />
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={fetchUrls}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
