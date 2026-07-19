import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";

const LOGO = "/brand-logos/android-chrome-192x192.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [forgotNote, setForgotNote] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setBusy(true);
    router.post("/portal/login", { email, password, remember }, {
      onError: (errors) => {
        setError(errors.email || "Login failed");
        setBusy(false);
      },
    });
  };

  return (
    <div className="relative min-h-screen bg-[#041a12] flex items-center justify-center p-4 overflow-hidden">
      <Head title="Client Portal" />

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full border border-[#d4ff00]/15" />
        <div className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full border border-[#d4ff00]/10" />
        <div className="absolute -bottom-52 -left-32 w-[520px] h-[520px] rounded-full bg-[#d4ff00]/5 blur-3xl" />
        <div className="absolute bottom-10 right-16 grid grid-cols-4 gap-2 opacity-20">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="w-1 h-1 rounded-full bg-[#d4ff00]" />
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-3xl grid md:grid-cols-[300px_1fr] bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Brand panel */}
        <div className="hidden md:flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-[#062b1d] to-[#041a12] p-8 text-center">
          <img src={LOGO} alt="Solarkon logo" className="w-24 h-24 object-contain" />
          <div>
            <p className="text-2xl font-extrabold tracking-tight text-white leading-none">Solarkon</p>
            <p className="text-[10px] font-normal tracking-wide text-white/70 mt-1">Solar &amp; Green energy</p>
          </div>
          <span className="w-12 h-px bg-[#d4ff00]/50" />
          <p className="text-sm text-white/80 leading-relaxed">
            Powering a <span className="text-[#d4ff00] font-bold">Sustainable</span> Tomorrow
          </p>
        </div>

        {/* Form panel */}
        <div className="p-8 sm:p-10">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-3 mb-6">
            <img src={LOGO} alt="Solarkon logo" className="w-12 h-12 object-contain" />
            <div>
              <p className="text-lg font-extrabold tracking-tight text-[#041a12] leading-none">Solarkon</p>
              <p className="text-[10px] text-gray-400 tracking-wide mt-0.5">Solar &amp; Green energy</p>
            </div>
          </div>

          <h1 className="text-2xl font-black text-[#041a12]">Welcome Back!</h1>
          <span className="block w-10 h-1 bg-[#d4ff00] rounded-full mt-2 mb-5" />
          <p className="text-sm font-black text-[#041a12]">Client Portal</p>
          <p className="text-sm text-gray-500 mb-6">Track the progress of your solar projects</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none transition-all"
                  placeholder="you@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none transition-all"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-[#041a12]"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setForgotNote((v) => !v)}
                className="text-sm font-bold text-emerald-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            {forgotNote && (
              <p className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                Contact your Solarkon project manager and they will reset your password.
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 bg-[#d4ff00] text-[#041a12] font-bold py-3.5 rounded-xl hover:bg-[#c5f000] transition-colors disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              {busy ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="flex items-start gap-2.5 mt-6">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Credentials are provided by the Solarkon team.
              Having trouble? Contact your project manager.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.layout = (page) => page;
