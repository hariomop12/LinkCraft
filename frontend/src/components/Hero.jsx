import { useState } from "react";

function Hero() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const shortenLink = async () => {
    if (!longUrl) return alert("Enter a URL");

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/url/public/shorten`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ longUrl }),
        },
      );

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      setShortUrl(data.fullShortUrl); // better use full url
    } catch (err) {
      console.error(err);
      alert("Error shortening link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4   mt-20">
      <div className="flex flex-col lg:flex-row items-center gap-10 max-w-6xl w-full">
        {/* IMAGE */}
        <img
          src="/src/assets/herei.png"
          alt="hero"
          className="w-40 sm:w-52 md:w-64 h-auto"
        />

        {/* CONTENT */}
        <div className="w-full max-w-xl text-center lg:text-left ml-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to Link Crafter
          </h1>

          <p className="text-base sm:text-lg text-gray-300">
            A convenient way to shorten long links and manage your links.
          </p>

          {/* INPUT */}
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter your long URL here..."
            className="mt-6 px-4 py-3 rounded-lg bg-white/10 text-white w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          {/* BUTTON */}
          <button
            onClick={shortenLink}
            className="bg-pink-500 mt-4 px-4 py-2 rounded w-full sm:w-auto cursor-pointer text-white hover:bg-pink-600 transition"
          >
            {loading ? "Shortening..." : "Short Link"}
          </button>

          {/* RESULT */}
          {shortUrl && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="break-all">{shortUrl}</span>

              <button
                onClick={() => navigator.clipboard.writeText(shortUrl)}
                className="text-pink-300 hover:text-pink-400"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hero;
