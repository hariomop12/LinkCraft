import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      setLoading(true);

       
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

       const loginRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        },
      );

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        alert(loginData.message || "Auto login failed");
        return;
      }

       if (loginData.token) {
        localStorage.setItem("token", loginData.token);
      } else {
        alert("No token received");
        return;
      }

       navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl m-26">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl w-full max-w-md text-white border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 rounded bg-white/10"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 rounded bg-white/10"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 rounded bg-white/10"
        />

        <button
          onClick={handleSignup}
          className="w-full bg-pink-500 py-2 rounded hover:bg-pink-600 transition"
        >
          {loading ? "Creating..." : "Signup"}
        </button>
      </div>
    </div>
  );
}

export default Signup;
