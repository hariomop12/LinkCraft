function Footer() {
  return (
    <footer className="mt-20 py-6 text-center text-gray-300 ">
      <p className="text-sm">
        © {new Date().getFullYear()} All rights reserved.
      </p>

      <p className="text-sm mt-2">
        Made with ❤️ by{" "}
        <span className="text-pink-400 font-semibold">Hariom OP</span>
      </p>
    </footer>
  );
}

export default Footer;
