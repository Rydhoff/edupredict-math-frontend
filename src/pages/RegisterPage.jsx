import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Gamepad2,
  Lock,
  Mail,
  Rocket,
  Sparkles,
  User,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import mascotRegister from "../assets/images/mascot-register.png";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    interests: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

    if (!form.fullName.trim()) {
      setError("Nama lengkap wajib diisi");
      return;
    }

    if (!form.email.trim()) {
      setError("Email wajib diisi");
      return;
    }

    if (form.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak sama");
      return;
    }

    setLoading(true);

    try {
      const user = await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        interests: form.role === "student" ? form.interests.trim() : "",
      });

      navigate(user.role === "teacher" ? "/teacher" : "/student");
    } catch (err) {
      setError(err.response?.data?.message || "Register gagal");
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

        <div className="grid w-full gap-[24px] lg:grid-cols-[1fr_540px] lg:items-center lg:gap-[72px]">
          <section className="hidden lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DEC8FF] bg-[#F7F0FF] px-[14px] py-[7px] text-[14px] font-bold text-[#651DFF] shadow-[0_6px_18px_rgba(101,29,255,0.08)]">
              <Sparkles size={16} />
              AI-Powered Adaptive Math
            </div>

            <h1 className="mt-[24px] max-w-[520px] text-[58px] font-extrabold leading-[0.98] tracking-[-0.055em] text-[#080A14]">
              Create your learning account.
            </h1>

            <p className="mt-[20px] max-w-[450px] text-[19px] font-medium leading-[1.5] text-[#70717A]">
              Daftar sebagai student atau teacher untuk mulai menggunakan
              EduPredict Math.
            </p>

            <div className="relative mt-[34px] h-[330px]">
              <div className="absolute left-[70px] top-[20px] h-[230px] w-[300px] rounded-full bg-[#EEE4FF] opacity-70 blur-[30px]" />

              <img
                src={mascotRegister}
                alt="Octa Register"
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
              className="rounded-[22px] border border-[#E5E7EB] bg-white px-[20px] pb-[22px] pt-[16px] shadow-[0_14px_34px_rgba(0,0,0,0.06)] lg:rounded-[28px] lg:px-[36px] lg:pb-[36px] lg:pt-[30px]"
            >
              <section className="relative mt-[30px] min-h-[130px] lg:mt-0 lg:min-h-0">
                <div className="pt-[12px] lg:pt-0">
                  <h1 className="text-[26px] font-bold tracking-[-0.03em] text-[#080A14] lg:text-[34px] lg:font-extrabold">
                    Buat akunmu
                  </h1>

                  <p className="mt-[6px] w-[210px] text-[15px] font-medium leading-[1.35] text-[#8A8A92] lg:w-full lg:text-[16px]">
                    Yuk mulai pengalaman belajar yang lebih seru!
                  </p>
                </div>

                <img
                  src={mascotRegister}
                  alt="Octa Register"
                  className="absolute right-0 top-[-10px] w-[132px] object-contain drop-shadow-[0_14px_24px_rgba(101,29,255,0.12)] transition duration-300 hover:scale-105 lg:hidden"
                />
              </section>

              <FormGroup label="Nama Lengkap">
                <InputIcon icon={<User size={20} />} />

                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className="h-full w-full bg-transparent pl-[40px] pr-3 text-[14px] font-medium outline-none placeholder:text-[#8A8A92]"
                />
              </FormGroup>

              <FormGroup label="Email">
                <InputIcon icon={<Mail size={20} />} />

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="emailmu@email.com"
                  className="h-full w-full bg-transparent pl-[40px] pr-3 text-[14px] font-medium outline-none placeholder:text-[#8A8A92]"
                />
              </FormGroup>

              <FormGroup label="Password">
                <InputIcon icon={<Lock size={20} />} />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  className="h-full w-full bg-transparent pl-[40px] pr-[44px] text-[14px] font-medium outline-none placeholder:text-[#8A8A92]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-[13px] top-1/2 -translate-y-1/2 text-[#6B7280] transition hover:scale-110"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </FormGroup>

              <FormGroup label="Konfirmasi Password">
                <InputIcon icon={<Lock size={20} />} />

                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  className="h-full w-full bg-transparent pl-[40px] pr-[44px] text-[14px] font-medium outline-none placeholder:text-[#8A8A92]"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-[13px] top-1/2 -translate-y-1/2 text-[#6B7280] transition hover:scale-110"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </FormGroup>

              <div className="mt-[16px]">
                <label className="text-[13px] font-semibold text-[#0F172A]">
                  Pilih peran
                </label>

                <div className="mt-[8px] grid grid-cols-2 gap-[9px]">
                  <RoleButton
                    active={form.role === "student"}
                    onClick={() => handleRole("student")}
                  >
                    Siswa
                  </RoleButton>

                  <RoleButton
                    active={form.role === "teacher"}
                    onClick={() => handleRole("teacher")}
                  >
                    Guru
                  </RoleButton>
                </div>
              </div>

              {form.role === "student" && (
                <div className="mt-[16px]">
                  <label className="text-[13px] font-semibold leading-tight text-[#0F172A]">
                    Minat / Hal yang kamu suka
                  </label>

                  <p className="mt-[3px] text-[12px] font-medium text-[#6B7280]">
                    Contohnya: musik, sepak bola, game, astronomi, dll.
                  </p>

                  <div className="relative mt-[10px] rounded-[16px] border border-[#E5E7EB] bg-white transition duration-300 focus-within:border-[#7C1FFF] focus-within:shadow-[0_0_0_3px_rgba(124,31,255,0.08)]">
                    <div className="absolute left-[13px] top-[14px] text-[#5A16E8]">
                      <Gamepad2 size={20} />
                    </div>

                    <textarea
                      name="interests"
                      value={form.interests}
                      onChange={handleChange}
                      placeholder="Tulis minat atau hal yang kamu suka..."
                      className="h-[92px] w-full resize-none rounded-[16px] bg-transparent px-[14px] py-[13px] pl-[42px] text-[14px] font-medium outline-none placeholder:text-[#8A8A92]"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-[24px] flex h-[50px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-gradient-to-r from-[#981DFF] to-[#5A16E8] text-[16px] font-bold text-white shadow-[0_10px_22px_rgba(108,33,255,0.25)] transition duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-[16px] w-[16px] animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Rocket size={20} />
                    Buat Akun
                  </>
                )}
              </button>

              <p className="mx-auto mt-[18px] max-w-[360px] text-center text-[12px] font-medium leading-[1.35] text-[#7B7B83]">
                By creating an account, you agree to our{" "}
                <span className="font-semibold text-[#5A16E8]">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="font-semibold text-[#5A16E8]">
                  Privacy Policy
                </span>
              </p>

              <p className="mb-[4px] mt-[24px] text-center text-[15px] font-medium text-[#7B7B83]">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="font-bold text-[#5A16E8] transition hover:underline"
                >
                  Masuk
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
    <div className="mt-[16px] first:mt-0">
      <label className="text-[13px] font-semibold text-[#0F172A]">
        {label}
      </label>

      <div className="relative mt-[7px] h-[48px] rounded-[15px] border border-[#E5E7EB] bg-white transition duration-300 focus-within:border-[#7C1FFF] focus-within:shadow-[0_0_0_3px_rgba(124,31,255,0.08)]">
        {children}
      </div>
    </div>
  );
};

const InputIcon = ({ icon }) => {
  return (
    <div className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#5A16E8]">
      {icon}
    </div>
  );
};

const RoleButton = ({ active, children, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[44px] rounded-[14px] border text-[13px] font-bold transition duration-300 hover:scale-[1.02] active:scale-[0.98] ${
        active
          ? "border-[#E4D3FF] bg-[#F7F0FF] text-[#5A16E8] shadow-[0_6px_14px_rgba(101,29,255,0.10)]"
          : "border-[#E5E7EB] bg-white text-[#6B7280]"
      }`}
    >
      {children}
    </button>
  );
};

export default RegisterPage;