import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ChevronRight,
  LogOut,
  Plus,
  Settings,
  School,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import PageState from "../../components/ui/PageState";
import TeacherBottomNav from "../../components/teacher/TeacherBottomNav";
import CreateClassModal from "../../components/teacher/CreateClassModal";
import teacherPhoto from "../../assets/images/profile/teacher-profile.png";
import NotificationBell from "../../components/shared/NotificationBell";

const TeacherProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, getProfile } = useAuth();

  const [profile, setProfile] = useState(user);
  const [dashboard, setDashboard] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileRes, dashboardRes] = await Promise.all([
        getProfile(),
        api.get("/teacher/dashboard"),
      ]);

      setProfile(profileRes || user);
      setDashboard(dashboardRes.data.dashboard);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat profile teacher");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [location.key]);

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchProfileData();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const summary = dashboard?.summary || {};
  const classMonitoring = dashboard?.classMonitoring || [];

  if (loading) {
    return (
      <PageLayout>
        <PageState type="loading" title="Memuat profile teacher..." />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <PageState
          type="error"
          title="Gagal memuat profile"
          message={error}
          action={
            <button
              onClick={fetchProfileData}
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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[26px] font-bold leading-none tracking-[-0.04em] text-black">
              Profile
            </h1>
            <p className="mt-[8px] text-[15px] font-medium text-[#6B7280]">
              Kelola akun dan pantau kelasmu!
            </p>
          </div>

          <NotificationBell to="/teacher/notifications" size={27} />
        </div>

        <section className="mt-[20px] overflow-hidden rounded-[20px] border border-[#E4D3FF] bg-gradient-to-br from-[#F8F2FF] via-white to-[#F7F0FF] px-[20px] py-[20px] shadow-[0_14px_34px_rgba(101,29,255,0.10)]">
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#B88CFF] blur-[12px] opacity-40" />
              <img
                src={profile?.photoUrl || teacherPhoto}
                alt={profile?.fullName || "Teacher"}
                className="relative h-[78px] w-[78px] rounded-full border-4 border-white object-cover shadow-[0_3px_12px_rgba(0,0,0,0.12)]"
              />
            </div>

            <div className="ml-[18px] min-w-0 flex-1">
              <h2 className="mt-[8px] truncate text-[22px] font-bold tracking-[-0.04em] text-black">
                {profile?.fullName || "Teacher"}
              </h2>

              <p className="mt-[4px] truncate text-[13px] font-medium text-[#6B7280]">
                {profile?.email || "-"}
              </p>
            </div>
          </div>

          <div className="mt-[18px] grid grid-cols-2 gap-[10px]">
            <button
              onClick={() => navigate("/teacher/settings")}
              className="flex h-[38px] items-center justify-center gap-[7px] rounded-[11px] bg-white text-[13px] font-bold text-[#651DFF] shadow-sm transition hover:scale-[1.03] active:scale-[0.98]"
            >
              <Settings size={17} />
              Edit Profile
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex h-[38px] items-center justify-center gap-[7px] rounded-[11px] bg-gradient-to-r from-[#981DFF] to-[#5A16E8] text-[13px] font-bold text-white shadow-[0_8px_18px_rgba(108,33,255,0.25)] transition hover:scale-[1.03] active:scale-[0.98]"
            >
              <Plus size={17} strokeWidth={3} />
              Buat Kelas
            </button>
          </div>
        </section>

        <section className="mt-[18px] grid grid-cols-3 gap-[8px]">
          <ProfileStat
            icon={<School size={20} />}
            value={classMonitoring.length || 0}
            label="Kelas"
            color="text-[#651DFF]"
            bg="bg-[#F7F0FF]"
          />

          <ProfileStat
            icon={<Users size={20} />}
            value={summary.totalStudents || 0}
            label="Students"
            color="text-[#16B966]"
            bg="bg-[#E8F8EE]"
          />

          <ProfileStat
            icon={<BarChart3 size={20} />}
            value={`${summary.averageProgress || 0}%`}
            label="Progress"
            color="text-[#F59E0B]"
            bg="bg-[#FFF1D6]"
          />
        </section>

        <section className="mt-[18px] rounded-[18px] border border-[#E5E7EB] bg-white px-[17px] py-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black">
                Kelas Saya
              </h2>
              <p className="mt-[5px] text-[12px] font-medium text-[#6B7280]">
                Monitoring kelas aktif teacher
              </p>
            </div>

            <button
              onClick={() => navigate("/teacher/classes")}
              className="rounded-[10px] bg-[#F7F0FF] px-[12px] py-[8px] text-[13px] font-bold text-[#5A16E8] transition hover:scale-105 active:scale-95"
            >
              Lihat Semua
            </button>
          </div>

          <div className="mt-[16px] space-y-[10px]">
            {classMonitoring.length === 0 ? (
              <PageState
                type="empty"
                title="Belum ada kelas"
                message="Buat kelas terlebih dahulu untuk memantau siswa."
                action={
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-[10px] bg-[#651DFF] px-[16px] py-[9px] text-[13px] font-bold text-white"
                  >
                    + Buat Kelas
                  </button>
                }
              />
            ) : (
              classMonitoring.slice(0, 3).map((item) => (
                <ClassItem
                  key={item.id}
                  item={item}
                  onClick={() => navigate(`/teacher/classes/${item.id}`)}
                />
              ))
            )}
          </div>
        </section>

        <section className="mt-[16px] space-y-[12px]">
          <MenuItem
            icon={<Settings size={25} />}
            title="Setting"
            desc="Ubah pengaturan akun dan lainnya"
            color="violet"
            onClick={() => navigate("/teacher/settings")}
          />

          <MenuItem
            icon={<LogOut size={24} />}
            title="Logout"
            desc="Keluar dari akun yang digunakan saat ini"
            color="red"
            onClick={() => setShowLogout(true)}
          />
        </section>
      </div>

      <TeacherBottomNav />

      {showCreateModal && (
        <CreateClassModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showLogout && (
        <LogoutModal
          onCancel={() => setShowLogout(false)}
          onLogout={handleLogout}
        />
      )}
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

const ProfileStat = ({ icon, value, label, color, bg }) => {
  return (
    <div className="rounded-[15px] border border-[#E5E7EB] bg-white px-[8px] py-[13px] text-center shadow-[0_5px_18px_rgba(0,0,0,0.03)] transition hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
      <div
        className={`mx-auto flex h-[34px] w-[34px] items-center justify-center rounded-[11px] ${bg} ${color}`}
      >
        {icon}
      </div>

      <p className="mt-[9px] text-[20px] font-bold leading-none text-black">
        {value}
      </p>

      <p className="mt-[7px] text-[11px] font-medium leading-none text-[#6B7280]">
        {label}
      </p>
    </div>
  );
};

const ClassItem = ({ item, onClick }) => {
  const progress = Math.min(item.averageProgress || 0, 100);

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-[16px] border border-[#E5E7EB] bg-white px-[15px] py-[14px] text-left transition hover:-translate-y-[2px] hover:border-[#D7C4FF] hover:shadow-[0_10px_24px_rgba(101,29,255,0.08)] active:scale-[0.99]"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold leading-none text-[#101348]">
            {item.className}
          </h3>

          <p className="mt-[8px] text-[12px] font-medium leading-none text-[#6B7280]">
            {item.totalStudents || 0} siswa
          </p>
        </div>

        <ChevronRight
          size={23}
          className="text-[#6B7280] transition group-hover:translate-x-[3px] group-hover:text-[#651DFF]"
        />
      </div>

      <div className="mt-[13px] flex items-center justify-between">
        <p className="text-[12px] font-medium text-[#6B7280]">
          Rata-rata progress
        </p>

        <p className="text-[14px] font-bold text-[#101348]">{progress}%</p>
      </div>

      <div className="mt-[6px] h-[7px] overflow-hidden rounded-full bg-[#D9D9D9]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#18C964] to-[#46E28A] transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </button>
  );
};

const MenuItem = ({ icon, title, desc, color, onClick }) => {
  const iconBox =
    color === "red"
      ? "bg-[#FFF1F1] text-red-500"
      : "bg-[#F7F0FF] text-[#5A16E8]";

  return (
    <button
      onClick={onClick}
      className="group flex h-[64px] w-full items-center rounded-[16px] border border-[#E5E7EB] bg-white px-[16px] text-left transition hover:-translate-y-[2px] hover:border-[#D7C4FF] hover:shadow-[0_10px_24px_rgba(101,29,255,0.08)] active:scale-[0.99]"
    >
      <div
        className={`flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[11px] ${iconBox}`}
      >
        {icon}
      </div>

      <div className="ml-[14px] flex-1">
        <h3 className="text-[13px] font-bold leading-none text-black">
          {title}
        </h3>

        <p className="mt-[7px] text-[11px] font-medium leading-none text-[#6B7280]">
          {desc}
        </p>
      </div>

      <ChevronRight
        size={25}
        className="text-[#6B7280] transition group-hover:translate-x-[3px] group-hover:text-[#651DFF]"
      />
    </button>
  );
};

const LogoutModal = ({ onCancel, onLogout }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 px-[32px]">
      <div className="w-full max-w-[337px] rounded-[18px] bg-white px-[28px] pb-[34px] pt-[35px] text-center shadow-[0_14px_34px_rgba(0,0,0,0.22)]">
        <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#FFCACA] bg-[#FFF1F1] text-red-500">
          <LogOut size={36} />
        </div>

        <h2 className="mt-[24px] text-[18px] font-bold leading-none text-black">
          Yakin ingin logout?
        </h2>

        <p className="mt-[9px] text-[13px] font-medium leading-[1.35] text-[#6B7280]">
          Kamu akan keluar dari akun ini.
          <br />
          Untuk kembali, silahkan login kembali.
        </p>

        <div className="mt-[18px] grid grid-cols-2 gap-[20px]">
          <button
            onClick={onCancel}
            className="h-[34px] rounded-[9px] border border-[#E5E7EB] text-[13px] font-bold text-black"
          >
            Batal
          </button>

          <button
            onClick={onLogout}
            className="h-[34px] rounded-[9px] bg-red-600 text-[13px] font-bold text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;