import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Eye, EyeOff, Lock } from "lucide-react";

import api from "../services/api";
import mascotLogin from "../assets/images/mascot-login.png";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successReset, setSuccessReset] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.password || !form.confirmPassword) {
      setError("Password baru dan konfirmasi password wajib diisi");
      return;
    }

    if (form.password.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak sama");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/auth/reset-password/${token}`, {
        password: form.password,
      });

      setSuccessReset(true);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal reset password");
    } finally {
      setLoading(false);
    }
  };

  if (successReset) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
        <div className="relative mx-auto flex min-h-screen w-full max-w-[460px] items-center px-[24px]">
          <div className="w-full rounded-[20px] border border-[#E5E7EB] bg-white px-[24px] py-[34px] text-center shadow-[0_14px_34px_rgba(0,0,0,0.08)]">
            <div className="mx-auto flex h-[82px] w-[82px] items-center justify-center rounded-full bg-green-50 text-[#16B966]">
              <CheckCircle size={44} />
            </div>

            <h1 className="mt-[20px] text-[24px] font-bold tracking-[-0.03em] text-black">
              Password Berhasil Diubah
            </h1>

            <p className="mx-auto mt-[8px] max-w-[280px] text-[14px] font-medium leading-[1.4] text-[#6B7280]">
              Sekarang kamu bisa masuk kembali menggunakan password baru.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-[24px] h-[44px] w-full rounded-[10px] bg-gradient-to-r from-[#981DFF] to-[#5A16E8] text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(108,33,255,0.25)] transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Masuk Sekarang
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="relative mx-auto min-h-screen w-full max-w-[460px] px-[14px] pb-[28px] pt-[20px]">
        <button
          type="button"
          onClick={() => navigate("/login")}
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
          className="rounded-[18px] border border-[#E5E7EB] bg-white px-[20px] pb-[22px] pt-[16px] shadow-[0_10px_28px_rgba(0,0,0,0.05)]"
        >
          <section className="mt-[18px] text-center">
            <h1 className="mt-[14px] text-[26px] font-bold tracking-[-0.03em] text-[#080A14]">
              Reset Password
            </h1>

            <p className="mx-auto mt-[4px] max-w-[275px] text-[15px] font-medium leading-[1.35] text-[#8A8A92]">
              Buat password baru yang aman agar akunmu tetap terlindungi.
            </p>

            <div className="mt-[8px] flex justify-center">
              <img
                src={mascotLogin}
                alt="Octa Reset Password"
                className="w-[220px] max-w-full object-contain drop-shadow-[0_14px_24px_rgba(101,29,255,0.12)] transition duration-300 hover:scale-105"
              />
            </div>
          </section>

          <FormGroup label="Password Baru">
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

          <button
            type="submit"
            disabled={loading}
            className="mt-[20px] flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[10px] bg-gradient-to-r from-[#981DFF] to-[#5A16E8] text-[16px] font-bold text-white shadow-[0_10px_22px_rgba(108,33,255,0.25)] transition duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-[16px] w-[16px] animate-spin rounded-full border-2 border-white border-t-transparent" />
                Menyimpan...
              </>
            ) : (
              "Simpan Password Baru"
            )}
          </button>

          <p className="mt-[22px] text-center text-[15px] font-medium text-[#7B7B83]">
            Kembali ke{" "}
            <Link
              to="/login"
              className="font-bold text-[#5A16E8] transition hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

const FormGroup = ({ label, children }) => {
  return (
    <div className="mt-[13px]">
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

export default ResetPasswordPage;