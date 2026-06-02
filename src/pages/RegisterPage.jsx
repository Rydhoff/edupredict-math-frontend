import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Gamepad2,
  Lock,
  Mail,
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

    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak sama");
      return;
    }

    setLoading(true);

    try {
      const user = await register({
        fullName: form.fullName.trim(),
        email: form.email,
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
      <div className="relative mx-auto min-h-screen w-full max-w-[460px] px-[14px] pb-[28px] pt-[20px]">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute left-[26px] top-[30px] z-10 flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-white text-[#6B7280] shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>

        {error && (
          <div className="mb-[12px] rounded-[12px] border border-red-100 bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-600 shadow-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-[18px] border border-[#E5E7EB] bg-white px-[20px] pb-[18px] pt-[16px] shadow-[0_10px_28px_rgba(0,0,0,0.05)]"
        >
          <section className="relative mt-[32px] min-h-[130px]">
  <div className="pt-[12px]">
    <h1 className="text-[26px] font-bold tracking-[-0.03em] text-[#080A14]">
      Buat akunmu
    </h1>

    <p className="mt-[6px] w-[210px] text-[15px] font-medium leading-[1.35] text-[#8A8A92]">
      Yuk mulai pengalaman belajar yang lebih seru!
    </p>
  </div>

  <img
    src={mascotRegister}
    alt="Octa Register"
    className="
      absolute
      right-[0px]
      top-[-10px]
      w-[132px]
      object-contain
      drop-shadow-[0_14px_24px_rgba(101,29,255,0.12)]
      transition
      duration-300
      hover:scale-105
    "
  />
</section>
          <FormGroup label="Nama Lengkap">
            <InputIcon icon={<User size={20} />} />
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              className="h-full w-full bg-transparent pl-[38px] pr-3 text-[13px] font-medium outline-none placeholder:text-[#8A8A92]"
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

          <FormGroup label="Konfirmasi Password">
            <InputIcon icon={<Lock size={20} />} />
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="************"
              className="h-full w-full bg-transparent pl-[38px] pr-[42px] text-[13px] font-medium outline-none placeholder:text-[#8A8A92]"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#6B7280] transition hover:scale-110"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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

          {form.role === "student" && (
            <div className="mt-[14px]">
              <label className="text-[13px] font-semibold leading-tight text-[#0F172A]">
                Minat / Hal yang kamu suka
              </label>

              <p className="mt-[2px] text-[12px] font-medium text-[#6B7280]">
                Contohnya: musik, sepak bola, game, astronomi, dll.
              </p>

              <div className="relative mt-[10px] rounded-[12px] border border-[#E5E7EB] bg-white transition duration-300 focus-within:border-[#7C1FFF] focus-within:shadow-[0_0_0_3px_rgba(124,31,255,0.08)]">
                <div className="absolute left-[11px] top-[13px] text-[#5A16E8]">
                  <Gamepad2 size={20} />
                </div>

                <textarea
                  name="interests"
                  value={form.interests}
                  onChange={handleChange}
                  placeholder="Tulis minat atau hal yang kamu suka..."
                  className="h-[74px] w-full resize-none rounded-[12px] bg-transparent px-[12px] py-[12px] pl-[38px] text-[13px] font-medium outline-none placeholder:text-[#8A8A92]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-[24px] flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[10px] bg-gradient-to-r from-[#981DFF] to-[#5A16E8] text-[16px] font-bold text-white shadow-[0_10px_22px_rgba(108,33,255,0.25)] transition duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-[16px] w-[16px] animate-spin rounded-full border-2 border-white border-t-transparent" />
                Memproses...
              </>
            ) : (
              "Buat Akun"
            )}
          </button>

          <p className="mx-auto mt-[20px] max-w-[310px] text-center text-[12px] font-medium leading-[1.25] text-[#7B7B83]">
            By creating an account, you agree to our{" "}<br />
            <span className="font-semibold text-[#5A16E8]">
              Terms of Service
            </span>
            <span className="font-semibold text-[#5A16E8]">
              Privacy Policy
            </span>
          </p>

          <p className="mt-[32px] mb-[8px] text-center text-[15px] font-medium text-[#7B7B83]">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-bold text-[#5A16E8] transition hover:underline"
            >
              Masuk
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

export default RegisterPage;