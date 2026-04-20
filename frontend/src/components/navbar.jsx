import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");  
  };
3
  return (
    <div className="px-6 pt-6">
      <nav className="bg-pink-500 text-white px-6 py-4 flex justify-between items-center rounded-2xl max-w-6xl mx-auto shadow-lg">
        <Link to="/" className="text-xl font-bold">
          Link Crafter
        </Link>

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
              <li>
                <Link to="/dashboard" className="hover:text-pink-200">
                  User Info 
                </Link>
              </li>
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
