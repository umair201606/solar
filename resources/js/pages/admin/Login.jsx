import { useState } from "react";
import { Head, router } from "@inertiajs/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post("/admin/login", { email, password }, {
      onError: (errors) => setError(errors.email || "Login failed"),
    });
  };

  return (
    <div className="min-h-screen bg-[#041a12] flex items-center justify-center p-4">
      <Head title="Admin Login" />
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[#041a12]">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Solarkon Management Panel</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none transition-all"
              placeholder="admin@solar.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none transition-all"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#d4ff00] text-[#041a12] font-bold py-3 rounded-xl hover:bg-[#c5f000] transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

Login.layout = (page) => page;
