import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Eye,
  EyeOff,
  Gamepad2,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import PageState from "../../components/ui/PageState";
import StudentBottomNav from "../../components/student/StudentBottomNav";
import StudentDesktopNav from "../../components/student/StudentDesktopNav";
import profileImage from "../../assets/images/profile/student-profile.png";
import { clearStudentCache } from "../../utils/cache";
import AppPageShell from "../../components/layout/AppPageShell";

const formatDateForInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().split("T")[0];
};

const SettingPage = () => {
  const navigate = useNavigate();
  const { user, getProfile, updateUser } = useAuth();

  const [profilePhoto, setProfilePhoto] = useState(user?.photoUrl || "");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "student",
    birthDate: "",
    gender: "",
    interests: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const profile = await getProfile();
      const currentUser = profile || user;

      if (!currentUser) {
        setError("Profil tidak ditemukan");
        return;
      }

      setProfilePhoto(currentUser.photoUrl || "");

      setForm({
        fullName: currentUser.fullName || "",
        email: currentUser.email || "",
        role: currentUser.role || "student",
        birthDate: formatDateForInput(currentUser.birthDate),
        gender: currentUser.gender || "",
        interests: currentUser.interests || "",
      });
    } catch {
      setError("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const clearMessage = () => {
    setSuccess("");
    setError("");
  };

  const handleChange = (e) => {
    clearMessage();
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    clearMessage();
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setSavingProfile(true);
      setError("");
      setSuccess("");

      if (!form.fullName.trim()) {
        setError("Nama lengkap wajib diisi");
        return;
      }

      const { data } = await api.put("/auth/profile", {
        fullName: form.fullName.trim(),
        birthDate: form.birthDate,
        gender: form.gender,
        interests: form.interests.trim(),
      });

      setProfilePhoto(data.photoUrl || data.user?.photoUrl || "");
      updateUser(data.user);
      clearStudentCache();
      setSuccess("Profile student berhasil diperbarui");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal perbarui profil");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setSavingPassword(true);
      setError("");
      setSuccess("");

      if (!passwordForm.currentPassword || !passwordForm.newPassword) {
        setError("Password lama dan password baru wajib diisi");
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        setError("Password baru minimal 6 karakter");
        return;
      }

      await api.put("/auth/password", passwordForm);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
      });

      setSuccess("Password berhasil diperbarui");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("photo", file);

      const { data } = await api.post("/upload/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfilePhoto(data.photoUrl || data.user?.photoUrl || "");
      updateUser(data.user);
      clearStudentCache();
      setSuccess("Foto profil berhasil diperbarui");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui foto");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <PageState type="loading" title="Memuat profil..." />
      </PageLayout>
    );
  }

  if (error && !form.email) {
    return (
      <PageLayout>
        <PageState
          type="error"
          title="Gagal memuat profil"
          message={error}
          action={
            <button
              onClick={loadProfile}
              className="rounded-[10px] bg-[#651DFF] px-[16px] py-[9px] text-[13px] font-bold text-white"
            >
              Coba Lagi
            </button>
          }
        />
      </PageLayout>
    );
  }

  return (
    <>
    <AppPageShell>
        <header className="flex items-start gap-[14px]">
          <button
            onClick={() => navigate("/student/profile")}
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] bg-white text-[#6B7280] shadow-sm transition hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="text-[25px] font-extrabold leading-none tracking-[-0.04em] text-black lg:text-[30px]">
              Pengaturan Akun
            </h1>

            <p className="mt-[8px] text-[14px] font-medium text-[#6B7280]">
              Kelola profil, keamanan, dan informasi akun siswa
            </p>
          </div>
        </header>

        {(error || success) && (
          <div
            className={`mt-[18px] rounded-[14px] border px-[14px] py-[11px] text-[13px] font-semibold ${
              error
                ? "border-red-100 bg-red-50 text-red-600"
                : "border-green-100 bg-green-50 text-green-600"
            }`}
          >
            {error || success}
          </div>
        )}

        <div className="mt-[22px] grid gap-[18px] lg:grid-cols-[330px_1fr] lg:items-start lg:gap-[24px]">
          <div className="space-y-[18px] lg:sticky lg:top-[28px]">
            <section className="overflow-hidden rounded-[24px] border border-[#E4D3FF] bg-gradient-to-br from-[#F8F2FF] via-white to-[#F7F0FF] px-[20px] py-[22px] shadow-[0_16px_40px_rgba(101,29,255,0.10)]">
              <div className="flex items-center lg:flex-col lg:text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#B88CFF] opacity-40 blur-[12px]" />

                  <img
                    src={profilePhoto || profileImage}
                    alt="Profil"
                    className="relative h-[86px] w-[86px] rounded-full border-4 border-white object-cover shadow-[0_6px_18px_rgba(0,0,0,0.14)] lg:h-[112px] lg:w-[112px]"
                  />
                </div>

                <div className="ml-[18px] min-w-0 flex-1 lg:ml-0 lg:mt-[16px] lg:w-full">
                  <h2 className="truncate text-[21px] font-extrabold tracking-[-0.04em] text-black">
                    {form.fullName || "Siswa"}
                  </h2>

                  <p className="mt-[5px] truncate text-[13px] font-medium text-[#6B7280]">
                    {form.email || "-"}
                  </p>
                </div>
              </div>

              <label className="mt-[18px] flex h-[42px] cursor-pointer items-center justify-center rounded-[13px] bg-white text-[13px] font-bold text-[#651DFF] shadow-sm transition hover:scale-[1.02] active:scale-[0.98]">
                {uploadingPhoto ? "Mengupload foto..." : "Ubah Foto Profil"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadPhoto}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
              </label>
            </section>

            <section className="rounded-[24px] border border-[#E5E7EB] bg-white px-[20px] pb-[22px] pt-[20px] shadow-[0_12px_34px_rgba(0,0,0,0.04)]">
              <SectionTitle
                icon={<Lock size={19} />}
                title="Pusat Keamanan"
                color="text-red-500"
                bg="bg-[#FFF1F1]"
              />

              <PasswordInput
                label="Password Lama"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Password lama"
                visible={showCurrentPassword}
                onToggle={() => setShowCurrentPassword((prev) => !prev)}
              />

              <PasswordInput
                label="Password Baru"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Minimal 6 karakter"
                visible={showNewPassword}
                onToggle={() => setShowNewPassword((prev) => !prev)}
              />

              <div className="mt-[15px] rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-[13px] py-[12px]">
                <div className="flex items-start gap-[8px]">
                  <ShieldCheck size={18} className="mt-[1px] text-[#16B966]" />

                  <p className="text-[12px] font-medium leading-[1.45] text-[#6B7280]">
                    Gunakan kombinasi huruf, angka, dan simbol agar akun siswa
                    lebih aman.
                  </p>
                </div>
              </div>

              <button
                onClick={handleUpdatePassword}
                disabled={savingPassword}
                className="mt-[18px] h-[44px] w-full rounded-[14px] border border-[#E4D3FF] bg-[#F7F0FF] text-[14px] font-bold text-[#5A16E8] transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              >
                {savingPassword ? "Menyimpan password..." : "Perbarui Password"}
              </button>
            </section>
          </div>

          <section className="rounded-[24px] border border-[#E5E7EB] bg-white px-[20px] pb-[24px] pt-[20px] shadow-[0_12px_34px_rgba(0,0,0,0.04)] lg:px-[24px]">
            <SectionTitle
              icon={<UserRound size={19} />}
              title="Informasi Akun"
              color="text-[#651DFF]"
              bg="bg-[#F7F0FF]"
            />

            <Input
              icon={<UserRound size={18} />}
              label="Nama Lengkap"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
            />

            <Input
              icon={<Mail size={18} />}
              label="Email"
              name="email"
              value={form.email}
              disabled
            />

            <div className="mt-[18px]">
              <Label>Peran</Label>

              <div className="mt-[9px] grid grid-cols-2 gap-[10px]">
                <RoleButton active>Siswa</RoleButton>
                <RoleButton active={false} disabled>
                  Guru
                </RoleButton>
              </div>
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-[14px]">
              <Input
                icon={<Calendar size={18} />}
                type="date"
                label="Tanggal Lahir"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
              />

              <Select
                label="Jenis Kelamin"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                options={[
                  { value: "", label: "Pilih jenis kelamin" },
                  { value: "male", label: "Laki-laki" },
                  { value: "female", label: "Perempuan" },
                ]}
              />
            </div>

            <div className="mt-[18px]">
              <Label>Minat / Hal yang kamu suka</Label>

              <div className="relative mt-[9px] rounded-[16px] border border-[#E5E7EB] bg-white transition focus-within:border-[#651DFF]">
                <div className="absolute left-[14px] top-[15px] text-[#6B7280]">
                  <Gamepad2 size={18} />
                </div>

                <textarea
                  name="interests"
                  value={form.interests}
                  onChange={handleChange}
                  placeholder="Contoh: Bermain game FPS, musik, sepak bola"
                  className="h-[112px] w-full resize-none rounded-[16px] px-[14px] py-[13px] pl-[44px] text-[13px] font-medium outline-none"
                />
              </div>

              <p className="mt-[7px] text-[11px] font-medium leading-[1.4] text-[#9CA3AF]">
                Minat ini digunakan AI untuk membuat penjelasan yang lebih
                personal.
              </p>
            </div>

            <button
              onClick={handleUpdateProfile}
              disabled={savingProfile}
              className="mt-[22px] flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[15px] bg-[#16B966] px-[14px] text-[14px] font-bold text-white shadow-[0_10px_22px_rgba(22,185,102,0.22)] transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full bg-white">
                <CheckCircle size={14} className="text-[#16B966]" />
              </span>
              {savingProfile ? "Menyimpan profile..." : "Perbarui Profil"}
            </button>
          </section>
        </div>
      </AppPageShell>

      <StudentDesktopNav />
      <StudentBottomNav />
    </>
  );
};

const PageLayout = ({ children }) => {
  return (
    <>
    <AppPageShell>
      {children}
    </AppPageShell>

      <StudentDesktopNav />
      <StudentBottomNav />
    </>
  );
};

const SectionTitle = ({ icon, title, color, bg }) => {
  return (
    <div className="flex items-center gap-[10px]">
      <div
        className={`flex h-[36px] w-[36px] items-center justify-center rounded-[12px] ${bg} ${color}`}
      >
        {icon}
      </div>

      <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-black">
        {title}
      </h2>
    </div>
  );
};

const Label = ({ children }) => {
  return (
    <label className="text-[12px] font-bold leading-none text-black">
      {children}
    </label>
  );
};

const Input = ({
  icon,
  type = "text",
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
}) => {
  return (
    <div className="mt-[18px]">
      <Label>{label}</Label>

      <div className="relative mt-[9px] h-[46px] rounded-[15px] border border-[#E5E7EB] bg-white transition focus-within:border-[#651DFF]">
        <div className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#6B7280]">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="h-full w-full rounded-[15px] px-[14px] pl-[44px] text-[13px] font-medium outline-none disabled:bg-[#F9FAFB] disabled:text-[#6B7280]"
        />
      </div>
    </div>
  );
};

const Select = ({ label, name, value, onChange, options }) => {
  return (
    <div className="mt-[18px]">
      <Label>{label}</Label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-[9px] h-[46px] w-full rounded-[15px] border border-[#E5E7EB] bg-white px-[14px] text-[13px] font-medium outline-none transition focus:border-[#651DFF]"
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const RoleButton = ({ active, disabled, children }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`h-[46px] rounded-[15px] border text-[13px] font-bold transition ${
        active
          ? "border-[#E4D3FF] bg-[#F7F0FF] text-[#5A16E8]"
          : "border-[#E5E7EB] bg-white text-[#6B7280]"
      } disabled:opacity-70`}
    >
      {children}
    </button>
  );
};

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  visible,
  onToggle,
}) => {
  return (
    <div className="mt-[18px]">
      <Label>{label}</Label>

      <div className="relative mt-[9px] h-[46px] rounded-[15px] border border-[#E5E7EB] bg-white transition focus-within:border-[#651DFF]">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-full w-full rounded-[15px] px-[14px] pr-[44px] text-[13px] font-medium outline-none"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-[13px] top-1/2 -translate-y-1/2 text-[#111827] transition hover:scale-110"
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
};

export default SettingPage;