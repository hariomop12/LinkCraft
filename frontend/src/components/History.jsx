import { useEffect, useState } from "react";
import { Copy, ExternalLink, BarChart3 } from "lucide-react";

function History() {
  const [urls, setUrls] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/url/user/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        setUrls(data.urls);
        setUser(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400 mt-10">Loading...</p>;
  }

  return (
    <div className="mt-16 max-w-6xl mx-auto px-6 text-white">
      {/* USER INFO */}
      {user && (
        <div className="mb-8 p-5 bg-white/10 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="text-gray-300 text-sm">{user.email}</p>

          <div className="flex gap-6 mt-4 text-sm text-gray-300">
            <span>🔗 {user.statistics.totalUrls} URLs</span>
            <span>👆 {user.statistics.totalClicks} Clicks</span>
          </div>
        </div>
      )}

      {/* URL LIST */}
      <h2 className="text-2xl font-bold mb-6">Your Links</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {urls.map((item) => (
          <div
            key={item.id}
            className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10"
          >
            {/* long url */}
            <p className="text-sm text-gray-300 truncate">{item.longUrl}</p>

            {/* short url */}
            <div className="flex justify-between items-center mt-3 bg-pink-500/20 px-3 py-2 rounded-lg">
              <span>{item.fullShortUrl}</span>

              <button
                onClick={() => navigator.clipboard.writeText(item.fullShortUrl)}
                className="hover:text-pink-300"
              >
                <Copy size={18} />
              </button>
            </div>

            {/* stats */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <BarChart3 size={16} />
                {item.clickCount} clicks
              </div>

              <a
                href={item.fullShortUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-pink-300"
              >
                <ExternalLink size={16} />
                Visit
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
