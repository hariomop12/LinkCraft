import React from "react";
import { Copy, Link2 } from "lucide-react";

function Shortener() {
  const [longUrl, setLongUrl] = React.useState("");
  const [result, setResult] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleShorten = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to shorten links");
      return;
    }

    if (!longUrl) {
      alert("Please enter a URL");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/url/shorten`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ longUrl }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Error");
        console.log(await res.text()); 
        return;
      }

      setResult({
        fullShortUrl: data.fullShortUrl,
        longUrl: data.longUrl,
        message: data.message,
      });
    } catch (err) {
      console.error(err);
      alert("Error shortening URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 max-w-2xl mx-auto px-6 text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Shorten Your Link 🔗
      </h2>
      {/* Input field for long URL */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter a long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          onClick={handleShorten}
          className="bg-pink-500 px-5 py-3 rounded-lg hover:bg-pink-600 transition"
        >
          {loading ? "Wait" : "Shorten"}
        </button>
      </div>
      {/* Result crad */}
      {result && (
        <div className="mt-6 p-5 bg-white/10 backdrop-blur-md rounded-2xl border-white/10">
          <p className="text-sm text-gray-300 truncate">{result.longUrl}</p>
          <div className="flex justify-between items-center mt-3 bg-pink-500/20 px-3 py-2 rounded-lg">
            <span className="font-semibold text-pink-400 truncate">
              {result.fullShortUrl || "No URL found"}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(result.fullShortUrl)}
              className="hover:text-pink-300"
            >
              <Copy size={18} />
            </button>
          </div>
          <p className="text-green-400 text-sm mt-3">{result.message}</p>
        </div>
      )}
    </div>
  );
}

export default Shortener;
