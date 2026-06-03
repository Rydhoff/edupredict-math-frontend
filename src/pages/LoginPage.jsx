import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Rocket,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import mascotLogin from "../assets/images/mascot-login.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim()) {
      setError("Email wajib diisi");
      return;
    }

    if (!form.password) {
      setError("Password wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const user = await login({
        email: form.email.trim(),
        password: form.password,
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
      <div className="relative mx-auto flex min-h-screen w-full max-w-[460px] items-center px-[14px] py-[24px] lg:max-w-[1100px] lg:px-[32px] lg:py-[40px]">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute left-[26px] top-[30px] z-20 flex h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-white text-[#6B7280] shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition hover:scale-105 active:scale-95 lg:left-[32px] lg:top-[36px]"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="grid w-full gap-[24px] lg:grid-cols-[1fr_460px] lg:items-center lg:gap-[64px]">
          <section className="hidden lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DEC8FF] bg-[#F7F0FF] px-[14px] py-[7px] text-[14px] font-bold text-[#651DFF] shadow-[0_6px_18px_rgba(101,29,255,0.08)]">
              <Sparkles size={16} />
              Welcome Back to EduPredict
            </div>

            <h1 className="mt-[24px] max-w-[520px] text-[58px] font-extrabold leading-[0.98] tracking-[-0.055em] text-[#080A14]">
              Continue your smart math journey.
            </h1>

            <p className="mt-[20px] max-w-[450px] text-[19px] font-medium leading-[1.5] text-[#70717A]">
              Masuk otomatis sesuai role akun kamu, baik sebagai student maupun teacher.
            </p>

            <div className="relative mt-[34px] h-[330px]">
              <div className="absolute left-[70px] top-[30px] h-[230px] w-[300px] rounded-full bg-[#EEE4FF] opacity-70 blur-[30px]" />

              <img
                src={mascotLogin}
                alt="Octa Login"
                className="relative z-10 w-[360px] object-contain drop-shadow-[0_24px_40px_rgba(101,29,255,0.16)] transition duration-300 hover:scale-105"
              />
            </div>
          </section>

          <section>
            {error && (
              <div className="mb-[12px] rounded-[12px] border border-red-100 bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-600 shadow-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="rounded-[22px] border border-[#E5E7EB] bg-white px-[20px] pb-[22px] pt-[18px] shadow-[0_14px_34px_rgba(0,0,0,0.06)] lg:rounded-[28px] lg:px-[30px] lg:pb-[28px] lg:pt-[24px]"
            >
              <section className="text-center lg:pt-[4px]">
                <h1 className="mt-[14px] text-[26px] font-bold tracking-[-0.03em] text-[#080A14] lg:text-[34px] lg:font-extrabold">
                  Welcome back!
                </h1>

                <p className="mx-auto mt-[5px] max-w-[270px] text-[15px] font-medium leading-[1.35] text-[#8A8A92] lg:max-w-[330px] lg:text-[16px]">
                  Masuk dengan email dan password. Role akan otomatis terdeteksi.
                </p>

                <div className="mt-[4px] flex justify-center lg:hidden">
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

              <div className="mt-[12px] flex items-center justify-between">
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
                className="mt-[20px] flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[12px] bg-gradient-to-r from-[#981DFF] to-[#5A16E8] text-[16px] font-bold text-white shadow-[0_10px_22px_rgba(108,33,255,0.25)] transition duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 lg:h-[50px]"
              >
                {loading ? (
                  <>
                    <span className="h-[16px] w-[16px] animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Rocket size={20} />
                    Masuk
                  </>
                )}
              </button>

              <p className="mb-[4px] mt-[24px] text-center text-[15px] font-medium text-[#7B7B83]">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="font-bold text-[#5A16E8] transition hover:underline"
                >
                  Buat akun
                </Link>
              </p>
            </form>
          </section>
        </div>
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

      <div className="relative mt-[6px] h-[42px] rounded-[12px] border border-[#E5E7EB] bg-white transition duration-300 focus-within:border-[#7C1FFF] focus-within:shadow-[0_0_0_3px_rgba(124,31,255,0.08)] lg:h-[44px]">
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

export default LoginPage;