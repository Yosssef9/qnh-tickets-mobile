import { useEffect, useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { setAuth } = useAuth();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const data = await loginRequest({ userCode, password });

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      setAuth({
        user: data.user,
        token: data.token,
      });

      setMessage(data.message || "Login successful");
      setMessageType("success");

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      setMessage(
        error?.response?.data?.message || error.message || "Login failed",
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/about.jpeg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgb(12,45,74)]/55 via-[rgb(21,98,160)]/35 to-black/55" />

      {/* Soft glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-24 h-52 w-52 -translate-x-1/2 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute bottom-10 left-[-40px] h-44 w-44 rounded-full bg-[rgb(21,98,160)]/25 blur-3xl" />
        <div className="absolute right-[-30px] top-1/3 h-44 w-44 rounded-full bg-cyan-300/15 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Top brand text */}
          <div className="mb-5 text-center text-white">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-white/80">
              Qassim National Hospital
            </p>
          </div>

          {/* Card */}
          <div className="rounded-[28px] border border-white/25 bg-white/18 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            {/* Inner white panel */}
            <div className="rounded-[24px] bg-white/92 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.12)] sm:p-7">
              {/* Logo */}
              <div className="mb-5 flex flex-col items-center text-center">
                <img
                  src="/images/newLogo-removebg-preview.png"
                  alt="QNH Logo"
                  className="h-20 object-contain"
                />

                <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(21,98,160)]">
                  QNH Tickets Mobile
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Sign in to access your ticket portal
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Code */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    User Code
                  </label>

                  <div className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-[rgb(21,98,160)] focus-within:bg-white focus-within:ring-4 focus-within:ring-[rgb(21,98,160)]/10">
                    <User
                      size={18}
                      className="text-slate-400 group-focus-within:text-[rgb(21,98,160)]"
                    />
                    <input
                      type="text"
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      placeholder="Enter your user code"
                      className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-[rgb(21,98,160)] focus-within:bg-white focus-within:ring-4 focus-within:ring-[rgb(21,98,160)]/10">
                    <Lock
                      size={18}
                      className="text-slate-400 group-focus-within:text-[rgb(21,98,160)]"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-slate-400 transition hover:text-[rgb(21,98,160)]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {message && (
                  <div
                    className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                      messageType === "success"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-xl bg-[rgb(21,98,160)] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[rgb(21,98,160)]/20 transition hover:bg-[rgb(15,75,125)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              {/* Footer text */}
              <div className="mt-5 text-center">
                <p className="text-xs text-slate-500">
                  Secure access for hospital staff
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
