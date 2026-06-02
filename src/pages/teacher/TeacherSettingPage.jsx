import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import PageState from "../../components/ui/PageState";
import TeacherBottomNav from "../../components/teacher/TeacherBottomNav";
import teacherPhoto from "../../assets/images/profile/teacher-profile.png";

const formatDateForInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().split("T")[0];
};

const TeacherSettingPage = () => {
  const navigate = useNavigate();
  const { user, getProfile, updateUser } = useAuth();

  const [profilePhoto, setProfilePhoto] = useState(user?.photoUrl || "");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "teacher",
    birthDate: "",
    gender: "",
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
        setError("Profile tidak ditemukan");
        return;
      }

      setProfilePhoto(currentUser.photoUrl || "");

      setForm({
        fullName: currentUser.fullName || "",
        email: currentUser.email || "",
        role: currentUser.role || "teacher",
        birthDate: formatDateForInput(currentUser.birthDate),
        gender: currentUser.gender || "",
      });
    } catch {
      setError("Gagal memuat profile");
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
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      });

      updateUser(data.user);
      setProfilePhoto(data.user?.photoUrl || profilePhoto);
      setSuccess("✨ Profile teacher berhasil diperbarui");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal update profile");
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

      setSuccess("🔒 Password berhasil diperbarui");
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
      setSuccess("📸 Foto profile berhasil diperbarui");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal upload foto");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <PageState type="loading" title="Memuat profile..." />
      </PageLayout>
    );
  }

  if (error && !form.email) {
    return (
      <PageLayout>
        <PageState
          type="error"
          title="Gagal memuat profile"
          message={error}
          action={
            <button
              onClick={loadProfile}
              className="rounded-[8px] bg-[#651DFF] px-[16px] py-[8px] text-[13px] font-bold text-white"
            >
              Coba Lagi
            </button>
          }
        />
      </PageLayout>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] bg-white px-[14px] pb-[104px] pt-[49px]">
        <div className="flex items-start gap-[14px]">
          <button
            onClick={() => navigate("/teacher/profile")}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#F8F9FB] text-[#6B7280] transition hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={23} />
          </button>

          <div>
            <h1 className="text-[26px] font-bold leading-none tracking-[-0.04em] text-black">
              Setting
            </h1>

            <p className="mt-[8px] text-[15px] font-medium text-[#6B7280]">
              Kelola informasi akun teacher
            </p>
          </div>
        </div>

        {(error || success) && (
          <div
            className={`mt-[16px] rounded-[12px] border px-[13px] py-[10px] text-[13px] font-semibold ${
              error
                ? "border-red-100 bg-red-50 text-red-600"
                : "border-green-100 bg-green-50 text-green-600"
            }`}
          >
            {error || success}
          </div>
        )}

        <section className="mt-[21px] overflow-hidden rounded-[20px] border border-[#E4D3FF] bg-gradient-to-br from-[#F8F2FF] via-white to-[#F7F0FF] px-[20px] py-[20px] shadow-[0_14px_34px_rgba(101,29,255,0.10)]">
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#B88CFF] blur-[12px] opacity-40" />

              <img
                src={profilePhoto || teacherPhoto}
                alt="Profile"
                className="relative h-[82px] w-[82px] rounded-full border-4 border-white object-cover shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
              />
            </div>

            <div className="ml-[18px] min-w-0 flex-1">
              <h2 className="mt-[8px] truncate text-[22px] font-bold tracking-[-0.04em] text-black">
                {form.fullName || "Teacher"}
              </h2>

              <p className="mt-[4px] truncate text-[13px] font-medium text-[#6B7280]">
                {form.email || "-"}
              </p>
            </div>
          </div>

          <label className="mt-[16px] flex h-[38px] cursor-pointer items-center justify-center rounded-[11px] bg-white text-[13px] font-bold text-[#651DFF] shadow-sm transition hover:scale-[1.02] active:scale-[0.98]">
            {uploadingPhoto ? "Mengupload foto..." : "Ubah Foto Profile"}
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadPhoto}
              disabled={uploadingPhoto}
              className="hidden"
            />
          </label>
        </section>

        <section className="mt-[16px] rounded-[18px] border border-[#E5E7EB] bg-white px-[18px] pb-[22px] pt-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition hover:-translate-y-[2px]">
          <SectionTitle
            icon={<UserRound size={20} />}
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

          <div className="mt-[14px]">
            <Label>Peran</Label>

            <div className="mt-[8px] grid grid-cols-2 gap-[8px]">
              <RoleButton active={false} disabled>
                Student
              </RoleButton>
              <RoleButton active>Teacher</RoleButton>
            </div>
          </div>

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

          <button
            onClick={handleUpdateProfile}
            disabled={savingProfile}
            className="mt-[18px] flex h-[42px] w-full items-center justify-center gap-[7px] rounded-[12px] bg-[#16B966] px-[14px] text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(22,185,102,0.22)] transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white">
              <CheckCircle size={14} className="text-[#16B966]" />
            </span>
            {savingProfile ? "Menyimpan profile..." : "Update profile"}
          </button>
        </section>

        <section className="mt-[16px] rounded-[18px] border border-[#E5E7EB] bg-white px-[18px] pb-[22px] pt-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition hover:-translate-y-[2px]">
          <SectionTitle
            icon={<Lock size={20} />}
            title="Security Center"
            color="text-red-500"
            bg="bg-[#FFF1F1]"
          />

          <PasswordInput
            label="Password Lama"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Masukkan password lama"
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

          <div className="mt-[14px] rounded-[13px] border border-[#E5E7EB] bg-[#F9FAFB] px-[13px] py-[11px]">
            <div className="flex items-start gap-[8px]">
              <ShieldCheck size={18} className="mt-[1px] text-[#16B966]" />
              <p className="text-[12px] font-medium leading-[1.4] text-[#6B7280]">
                Gunakan kombinasi huruf, angka, dan simbol agar akun teacher
                lebih aman.
              </p>
            </div>
          </div>

          <button
            onClick={handleUpdatePassword}
            disabled={savingPassword}
            className="mt-[18px] h-[42px] w-full rounded-[12px] border border-[#E4D3FF] bg-[#F7F0FF] text-[14px] font-bold text-[#5A16E8] transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {savingPassword ? "Menyimpan password..." : "Update password"}
          </button>
        </section>
      </div>

      <TeacherBottomNav />
    </main>
  );
};

const PageLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] bg-white px-[14px] pb-[104px] pt-[49px]">
        {children}
      </div>

      <TeacherBottomNav />
    </main>
  );
};

const SectionTitle = ({ icon, title, color, bg }) => {
  return (
    <div className="flex items-center gap-[9px]">
      <div
        className={`flex h-[34px] w-[34px] items-center justify-center rounded-[10px] ${bg} ${color}`}
      >
        {icon}
      </div>

      <h2 className="text-[21px] font-bold tracking-[-0.04em] text-black">
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
    <div className="mt-[14px]">
      <Label>{label}</Label>

      <div className="relative mt-[8px] h-[40px] rounded-[12px] border border-[#E5E7EB] bg-white focus-within:border-[#651DFF]">
        <div className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#6B7280]">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="h-full w-full rounded-[12px] px-[13px] pl-[42px] text-[13px] font-medium outline-none disabled:bg-[#F9FAFB] disabled:text-[#6B7280]"
        />
      </div>
    </div>
  );
};

const Select = ({ label, name, value, onChange, options }) => {
  return (
    <div className="mt-[14px]">
      <Label>{label}</Label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-[8px] h-[40px] w-full rounded-[12px] border border-[#E5E7EB] bg-white px-[13px] text-[13px] font-medium outline-none focus:border-[#651DFF]"
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
      className={`h-[40px] rounded-[12px] border text-[13px] font-bold transition ${
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
    <div className="mt-[14px]">
      <Label>{label}</Label>

      <div className="relative mt-[8px] h-[40px] rounded-[12px] border border-[#E5E7EB] focus-within:border-[#651DFF]">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-full w-full rounded-[12px] px-[13px] pr-[42px] text-[13px] font-medium outline-none"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#111827] transition hover:scale-110"
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
};

export default TeacherSettingPage;