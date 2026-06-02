import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import mascotLogin from "../assets/images/mascot-login.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student",
    remember: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleRole = (role) => {
    setForm((prev) => ({
      ...prev,
      role,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login({
        email: form.email,
        password: form.password,
        role: form.role,
      });

      navigate(user.role === "teacher" ? "/teacher" : "/student");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="relative mx-auto min-h-screen w-full max-w-[460px] px-[14px] pb-[28px] pt-[20px]">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute flex left-[26px] top-[30px] h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-white text-[#6B7280] shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>

        {error && (
          <div className="mt-[12px] rounded-[12px] border border-red-100 bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-600 shadow-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-[18px] border border-[#E5E7EB] bg-white px-[20px] pb-[18px] pt-[16px] shadow-[0_10px_28px_rgba(0,0,0,0.05)]"
        >
          <section className="mt-[18px] text-center">
          <h1 className="mt-[14px] text-[26px] font-bold tracking-[-0.03em] text-[#080A14]">
            Welcome back!
          </h1>

          <p className="mx-auto mt-[4px] max-w-[250px] text-[15px] font-medium leading-[1.35] text-[#8A8A92]">
            Yay! Siap melanjutkan perjalanan belajarmu hari ini?
          </p>

          <div className="mt-[4px] flex justify-center">
            <img
              src={mascotLogin}
              alt="Octa Login"
              className="w-[240px] max-w-full object-contain drop-shadow-[0_14px_24px_rgba(101,29,255,0.12)] transition duration-300 hover:scale-105"
            />
          </div>
        </section>

          <FormGroup label="Email">
            <InputIcon icon={<Mail size={20} />} />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="emailmu@email.com"
              className="h-full w-full bg-transparent pl-[38px] pr-3 text-[13px] font-medium outline-none placeholder:text-[#8A8A92]"
            />
          </FormGroup>

          <FormGroup label="Password">
            <InputIcon icon={<Lock size={20} />} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="************"
              className="h-full w-full bg-transparent pl-[38px] pr-[42px] text-[13px] font-medium outline-none placeholder:text-[#8A8A92]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#6B7280] transition hover:scale-110"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </FormGroup>

          <div className="mt-[14px]">
            <label className="text-[13px] font-semibold text-[#0F172A]">
              Pilih peran
            </label>

            <div className="mt-[7px] grid grid-cols-2 gap-[8px]">
              <RoleButton
                active={form.role === "student"}
                onClick={() => handleRole("student")}
              >
                Student
              </RoleButton>

              <RoleButton
                active={form.role === "teacher"}
                onClick={() => handleRole("teacher")}
              >
                Teacher
              </RoleButton>
            </div>
          </div>

          <div className="mt-[12px] flex items-center justify-between">
            <label className="flex items-center gap-[6px] text-[12px] font-medium text-[#6B7280]">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="h-[14px] w-[14px] accent-[#5A16E8]"
              />
              Ingat saya
            </label>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-[12px] font-semibold text-[#5A16E8] transition hover:underline"
            >
              Lupa Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-[20px] flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[10px] bg-gradient-to-r from-[#981DFF] to-[#5A16E8] text-[16px] font-bold text-white shadow-[0_10px_22px_rgba(108,33,255,0.25)] transition duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-[16px] w-[16px] animate-spin rounded-full border-2 border-white border-t-transparent" />
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </button>

          
        <p className="mt-[26px] mb-[14px] text-center text-[15px] font-medium text-[#7B7B83]">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-bold text-[#5A16E8] transition hover:underline"
          >
            Buat akun
          </Link>
        </p>
        </form>

      </div>
    </main>
  );
};

const FormGroup = ({ label, children }) => {
  return (
    <div className="mt-[13px] first:mt-0">
      <label className="text-[13px] font-semibold text-[#0F172A]">
        {label}
      </label>

      <div className="relative mt-[6px] h-[40px] rounded-[12px] border border-[#E5E7EB] bg-white transition duration-300 focus-within:border-[#7C1FFF] focus-within:shadow-[0_0_0_3px_rgba(124,31,255,0.08)]">
        {children}
      </div>
    </div>
  );
};

const InputIcon = ({ icon }) => {
  return (
    <div className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#5A16E8]">
      {icon}
    </div>
  );
};

const RoleButton = ({ active, children, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[38px] rounded-[10px] border text-[13px] font-bold transition duration-300 hover:scale-[1.02] active:scale-[0.98] ${
        active
          ? "border-[#E4D3FF] bg-[#F7F0FF] text-[#5A16E8] shadow-sm"
          : "border-[#E5E7EB] bg-white text-[#6B7280]"
      }`}
    >
      {children}
    </button>
  );
};

export default LoginPage;