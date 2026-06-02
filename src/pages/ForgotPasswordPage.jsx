import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Send } from "lucide-react";

import api from "../services/api";
import mascotLogin from "../assets/images/mascot-login.png";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setSuccess(
        data.message ||
          "Link reset password sudah dikirim. Silakan cek email kamu."
      );
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengirim link reset");
    } finally {
      setLoading(false);
    }
  };

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

        <form
          onSubmit={handleSubmit}
          className="rounded-[18px] border border-[#E5E7EB] bg-white px-[20px] pb-[22px] pt-[16px] shadow-[0_10px_28px_rgba(0,0,0,0.05)]"
        >
          <section className="mt-[18px] text-center">
            <h1 className="mt-[14px] text-[26px] font-bold tracking-[-0.03em] text-[#080A14]">
              Lupa Password?
            </h1>

            <p className="mx-auto mt-[4px] max-w-[275px] text-[15px] font-medium leading-[1.35] text-[#8A8A92]">
              Tenang, masukkan email akunmu dan kami kirimkan link reset.
            </p>

            <div className="mt-[8px] flex justify-center">
              <img
                src={mascotLogin}
                alt="Octa Forgot Password"
                className="w-[220px] max-w-full object-contain drop-shadow-[0_14px_24px_rgba(101,29,255,0.12)] transition duration-300 hover:scale-105"
              />
            </div>
          </section>

          <FormGroup label="Email">
            <InputIcon icon={<Mail size={20} />} />
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuccess("");
              }}
              placeholder="emailmu@email.com"
              className="h-full w-full bg-transparent pl-[38px] pr-3 text-[13px] font-medium outline-none placeholder:text-[#8A8A92]"
            />
          </FormGroup>

          <button
            type="submit"
            disabled={loading}
            className="mt-[20px] flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[10px] bg-gradient-to-r from-[#981DFF] to-[#5A16E8] text-[16px] font-bold text-white shadow-[0_10px_22px_rgba(108,33,255,0.25)] transition duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-[16px] w-[16px] animate-spin rounded-full border-2 border-white border-t-transparent" />
                Mengirim...
              </>
            ) : (
              <>
                <Send size={18} />
                Kirim Link Reset
              </>
            )}
          </button>

          {(error || success) && (
          <div
            className={`mb-[12px] mt-[20px] rounded-[12px] border px-3 py-2 text-[13px] font-semibold shadow-sm ${
              error
                ? "border-red-100 bg-red-50 text-red-600"
                : "border-green-100 bg-green-50 text-green-600"
            }`}
          >
            {error || success}
          </div>
        )}

          <p className="mt-[22px] text-center text-[15px] font-medium text-[#7B7B83]">
            Ingat password?{" "}
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

export default ForgotPasswordPage;