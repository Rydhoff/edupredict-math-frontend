import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  ChevronRight,
  LogOut,
  Plus,
  Settings,
  School,
  Users,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import PageState from "../../components/ui/PageState";
import TeacherBottomNav from "../../components/teacher/TeacherBottomNav";
import TeacherDesktopNav from "../../components/teacher/TeacherDesktopNav";
import CreateClassModal from "../../components/teacher/CreateClassModal";
import teacherPhoto from "../../assets/images/profile/teacher-profile.png";
import useCachedFetch from "../../hooks/useCachedFetch";
import { clearTeacherCache } from "../../utils/cache";
import NotificationBell from "../../components/shared/NotificationBell";
import AppPageShell from "../../components/layout/AppPageShell";

const TeacherProfilePage = () => {
  const navigate = useNavigate();
  const { logout, user, getProfile } = useAuth();

  const [showLogout, setShowLogout] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    data: profileData,
    loading,
    error,
    refetch: fetchProfileData,
  } = useCachedFetch({
    cacheKey: "teacher_profile",
    fetcher: async () => {
      const [profileRes, dashboardRes] = await Promise.all([
        getProfile(),
        api.get("/teacher/dashboard"),
      ]);

      return {
        profile: profileRes || user,
        dashboard: dashboardRes.data.dashboard,
      };
    },
  });

  const handleCreateSuccess = () => {
    clearTeacherCache();
    setShowCreateModal(false);
    fetchProfileData({ forceLoading: true });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const profile = profileData?.profile || user;
  const dashboard = profileData?.dashboard;

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
              onClick={() => fetchProfileData({ forceLoading: true })}
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
    <>
    <AppPageShell>
      <header className="flex items-start justify-between gap-[14px]">
          <div>
            <h1 className="text-[26px] font-bold leading-none tracking-[-0.04em] text-black lg:text-[32px] lg:font-extrabold">
              Profile
            </h1>

            <p className="mt-[8px] text-[15px] font-medium text-[#6B7280]">
              Kelola akun dan pantau kelasmu!
            </p>
          </div>

          
            <div className="lg:hidden">
              <NotificationBell to="/teacher/notifications" size={24} />
            </div>
        </header>

        <div className="mt-[20px] lg:grid lg:grid-cols-[340px_1fr] lg:items-start lg:gap-[24px]">
          <aside className="lg:sticky lg:top-[32px]">
            <section className="overflow-hidden rounded-[24px] border border-[#E4D3FF] bg-gradient-to-br from-[#F8F2FF] via-white to-[#F7F0FF] px-[20px] py-[22px] shadow-[0_14px_34px_rgba(101,29,255,0.10)]">
              <div className="flex items-center lg:flex-col lg:text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#B88CFF] opacity-40 blur-[12px]" />

                  <img
                    src={profile?.photoUrl || teacherPhoto}
                    alt={profile?.fullName || "Teacher"}
                    className="relative h-[82px] w-[82px] rounded-full border-4 border-white object-cover shadow-[0_3px_12px_rgba(0,0,0,0.12)] lg:h-[110px] lg:w-[110px]"
                  />
                </div>

                <div className="ml-[18px] min-w-0 flex-1 lg:ml-0 lg:mt-[16px] lg:w-full">
                  <h2 className="truncate text-[22px] font-bold tracking-[-0.04em] text-black">
                    {profile?.fullName || "Teacher"}
                  </h2>

                  <p className="mt-[5px] truncate text-[13px] font-medium text-[#6B7280]">
                    {profile?.email || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-[18px] grid grid-cols-2 gap-[10px]">
                <button
                  onClick={() => navigate("/teacher/settings")}
                  className="flex h-[40px] items-center justify-center gap-[7px] rounded-[12px] bg-white text-[13px] font-bold text-[#651DFF] shadow-sm transition hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Settings size={17} />
                  Edit Profile
                </button>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex h-[40px] items-center justify-center gap-[7px] rounded-[12px] bg-gradient-to-r from-[#981DFF] to-[#5A16E8] text-[13px] font-bold text-white shadow-[0_8px_18px_rgba(108,33,255,0.25)] transition hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Plus size={17} strokeWidth={3} />
                  Buat Kelas
                </button>
              </div>
            </section>

            <section className="mt-[18px] grid grid-cols-3 gap-[8px] lg:grid-cols-1">
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
          </aside>

          <section className="mt-[18px] rounded-[24px] border border-[#E5E7EB] bg-white px-[18px] py-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] lg:mt-0 lg:px-[22px]">
            <div className="flex items-center justify-between gap-[14px]">
              <div>
                <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black lg:text-[26px]">
                  Kelas Saya
                </h2>

                <p className="mt-[5px] text-[12px] font-medium text-[#6B7280]">
                  Monitoring kelas aktif teacher
                </p>
              </div>

              <button
                onClick={() => navigate("/teacher/classes")}
                className="shrink-0 rounded-[12px] bg-[#F7F0FF] px-[12px] py-[8px] text-[13px] font-bold text-[#5A16E8] transition hover:scale-105 active:scale-95"
              >
                Lihat Semua
              </button>
            </div>

            <div className="mt-[16px]">
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
                <div className="grid gap-[12px] lg:grid-cols-2">
                  {classMonitoring.slice(0, 6).map((item) => (
                    <ClassItem
                      key={item.id}
                      item={item}
                      onClick={() => navigate(`/teacher/classes/${item.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </AppPageShell>

      <TeacherDesktopNav />
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
    </>
  );
};

const PageLayout = ({ children }) => {
  return (
    <>
    <AppPageShell>
    {children}
      </AppPageShell>

      <TeacherDesktopNav />
      <TeacherBottomNav />
    </>
  );
};

const ProfileStat = ({ icon, value, label, color, bg }) => {
  return (
    <div className="rounded-[15px] border border-[#E5E7EB] bg-white px-[8px] py-[13px] text-center shadow-[0_5px_18px_rgba(0,0,0,0.03)] transition hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)] lg:flex lg:items-center lg:px-[13px] lg:text-left">
      <div
        className={`mx-auto flex h-[34px] w-[34px] items-center justify-center rounded-[11px] ${bg} ${color} lg:mx-0`}
      >
        {icon}
      </div>

      <div className="lg:ml-[12px]">
        <p className="mt-[9px] text-[20px] font-bold leading-none text-black lg:mt-0">
          {value}
        </p>

        <p className="mt-[7px] text-[11px] font-medium leading-none text-[#6B7280]">
          {label}
        </p>
      </div>
    </div>
  );
};

const ClassItem = ({ item, onClick }) => {
  const progress = Math.min(item.averageProgress || 0, 100);

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-[18px] border border-[#E5E7EB] bg-white px-[15px] py-[14px] text-left transition hover:-translate-y-[2px] hover:border-[#D7C4FF] hover:shadow-[0_10px_24px_rgba(101,29,255,0.08)] active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-[12px]">
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
          className="shrink-0 text-[#6B7280] transition group-hover:translate-x-[3px] group-hover:text-[#651DFF]"
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