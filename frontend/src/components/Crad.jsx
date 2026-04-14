// eslint-disable-next-line no-shadow-restricted-names
import { Infinity, Lock, User, History, Link2, Sparkles } from "lucide-react";

function Features() {
  const features = [
    {
      id: 1,
      title: "Lifetime Links",
      description:
        "Your shortened URLs never expire. Save and use them forever.",
      icon: <Infinity size={28} />,
    },
    {
      id: 2,
      title: "Anonymous Shortening",
      description:
        "No login required. Quickly shorten URLs without any signup.",
      icon: <User size={28} />,
    },
    {
      id: 3,
      title: "Secure & Private",
      description: "Your links are safe and protected with strong security.",
      icon: <Lock size={28} />,
    },
    {
      id: 4,
      title: "Track History",
      description:
        "Login to view and manage all your shortened links in one place.",
      icon: <History size={28} />,
    },
    {
      id: 5,
      title: "Fast & Simple",
      description:
        "Generate short links instantly with a clean and minimal UI.",
      icon: <Link2 size={28} />,
    },
    {
      id: 6,
      title: "Open Source",
      description: "Fully transparent and customizable. Built for developers.",
      icon: <Sparkles size={28} />,
    },
  ];

  return (
    <div className="mt-24 px-6 max-w-6xl mx-auto text-white">
      <h2 className="text-3xl font-bold text-center mb-12">Features</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((item) => (
          <div
            key={item.id}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:scale-105 transition"
          >
            <div className="text-pink-400 mb-4">{item.icon}</div>

            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>

            <p className="text-gray-300 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
