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
    <div className="flex items-center justify-center ml-20 px-6 min-h-80 mt-15">
      <div className="flex items-center gap-12 max-w-6xl w-full">
        <img src="/src/assets/herei.png" alt="hero" className="w-48 h-auto" />

        <div className="pl-10 ml-30">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to Link Crafter
          </h1>

          <p className="text-lg text-gray-300 max-w-md">
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

          
          <button
            onClick={shortenLink}
            className="bg-pink-500 mt-4 px-4 py-2 rounded cursor-pointer text-white hover:bg-pink-600 transition"
          >
            {loading ? "Shortening..." : "Short Link"}
          </button>

         
          {shortUrl && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg text-white flex justify-between items-center">
              <span>{shortUrl}</span>

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
