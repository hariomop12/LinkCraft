import { Link, useNavigate, useLocation } from "react-router-dom";
import { BarChart3 } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isDashboard = location.pathname === "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="px-6 pt-6 mb-10">
      <nav className="bg-pink-500 text-white px-6 py-4 flex justify-between items-center rounded-2xl max-w-6xl mx-auto shadow-lg">
        {/* LEFT SIDE */}
        {isDashboard ? (
          <div className="flex items-center gap-4">
            <BarChart3 size={28} className="text-white" />
            <h1 className="m-0 text-2xl font-bold">LinkCraft Dashboard</h1>
          </div>
        ) : (
          <Link to="/" className="text-xl font-bold">
            Link Crafter
          </Link>
        )}

        {/* RIGHT SIDE */}
        <ul className="flex gap-6 items-center">
          {!token ? (
            <>
              <li>
                <Link to="/login" className="hover:text-pink-200">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-pink-200">
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <>
              {isDashboard && (
                <li
                  className="font-medium cursor-pointer text-sm"
                  onClick={() => navigate("/")}
                >
                  👤 {user.username || "User"}
                </li>
              )}

              {!isDashboard && (
                <li>
                  <Link to="/dashboard" className="hover:text-pink-200">
                    User Info
                  </Link>
                </li>
              )}

              <li>
                <button
                  onClick={handleLogout}
                  className="bg-white text-pink-500 px-3 py-1 rounded hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
