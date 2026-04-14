function Navbar() {
  return (
    <div className="px-6 pt-6">
      <nav className="bg-pink-500 text-white px-6 py-4 flex justify-between items-center rounded-2xl max-w-6xl mx-auto shadow-lg">
        <h1 className="text-xl font-bold">Link Crafter</h1>

        <ul className="flex gap-6">
          <li>
            <a href="#" className="hover:text-pink-200 transition">
              Login
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-pink-200 transition">
              Signup
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
