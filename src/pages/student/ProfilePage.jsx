import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  ChevronRight,
  Flame,
  LogOut,
  Plus,
  Settings,
  Star,
  Target,
  Trophy,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import PageState from "../../components/ui/PageState";
import StudentBottomNav from "../../components/student/StudentBottomNav";
import StudentDesktopNav from "../../components/student/StudentDesktopNav";
import JoinClassModal from "../../components/student/JoinClassModal";
import profileImage from "../../assets/images/profile/student-profile.png";
import NotificationBell from "../../components/shared/NotificationBell";
import useCachedFetch from "../../hooks/useCachedFetch";
import { clearStudentCache } from "../../utils/cache";

const getNextLevelXP = (level = 1) => {
  return Math.max(Number(level) || 1, 1) * 100;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [showLogout, setShowLogout] = useState(false);
  const [showJoinClass, setShowJoinClass] = useState(false);

  const {
    data: profileData,
    loading,
    error,
    refetch: fetchProfileData,
  } = useCachedFetch({
    cacheKey: "student_profile",
    fetcher: async () => {
      const [dashboardRes, classesRes] = await Promise.all([
        api.get("/student/dashboard"),
        api.get("/classes/my"),
      ]);

      return {
        dashboard: dashboardRes.data.dashboard,
        classes: classesRes.data.classes || [],
      };
    },
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboard = profileData?.dashboard;
  const classes = profileData?.classes || [];

  const student = dashboard?.student || user || {};
  const statistics = dashboard?.statistics || {};

  const xp = student.xp || 0;
  const level = student.level || 1;
  const nextLevelXP = getNextLevelXP(level);
  const currentLevelStartXP = Math.max((level - 1) * 100, 0);
  const currentLevelXP = Math.max(xp - currentLevelStartXP, 0);
  const neededForCurrentLevel = Math.max(nextLevelXP - currentLevelStartXP, 100);
  const levelProgress = Math.min(
    Math.round((currentLevelXP / neededForCurrentLevel) * 100),
    100
  );

  if (loading) {
    return (
      <PageLayout>
        <PageState type="loading" title="Memuat profile..." />
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
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] lg:pt-[56px] px-[16px] pb-[104px] pt-[16px] lg:ml-[304px] lg:max-w-[1200px] lg:px-[32px] lg:pb-[40px]">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-[26px] font-bold leading-none tracking-[-0.04em] text-black">
              Profile
            </h1>

            <p className="mt-[8px] text-[15px] font-medium text-[#6B7280]">
              Kelola akun dan lihat progress-mu!
            </p>
          </div>

          <div className="lg:hidden">
            <NotificationBell to="/student/notifications" size={27} />
          </div>
        </header>

        <div className="lg:mt-[24px] lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-[24px]">
          <div>
            <section className="mt-[20px] overflow-hidden rounded-[20px] border border-[#E4D3FF] bg-gradient-to-br from-[#F8F2FF] via-white to-[#F7F0FF] px-[20px] py-[20px] shadow-[0_14px_34px_rgba(101,29,255,0.10)] lg:mt-0">
              <div className="flex items-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#B88CFF] opacity-40 blur-[12px]" />

                  <img
                    src={student?.photoUrl || profileImage}
                    alt={student?.fullName || "Student"}
                    className="relative h-[78px] w-[78px] rounded-full border-4 border-white object-cover shadow-[0_3px_12px_rgba(0,0,0,0.12)]"
                  />
                </div>

                <div className="ml-[18px] min-w-0 flex-1">
                  <h2 className="truncate text-[22px] font-bold tracking-[-0.04em] text-black">
                    {student?.fullName || "Student"}
                  </h2>

                  <p className="mt-[5px] text-[13px] font-medium text-[#6B7280]">
                    Level {level} • Math Explorer
                  </p>
                </div>
              </div>

              <div className="mt-[16px]">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold text-[#6B7280]">
                    XP Progress
                  </p>

                  <p className="text-[12px] font-bold text-[#651DFF]">
                    {currentLevelXP} / {neededForCurrentLevel} XP
                  </p>
                </div>

                <div className="mt-[7px] h-[8px] overflow-hidden rounded-full bg-[#E5E7EB]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#981DFF] to-[#5A16E8] transition-all duration-700"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-[18px] grid grid-cols-2 gap-[10px]">
                <button
                  onClick={() => navigate("/student/settings")}
                  className="flex h-[38px] items-center justify-center gap-[7px] rounded-[11px] bg-white text-[13px] font-bold text-[#651DFF] shadow-sm transition hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Settings size={17} />
                  Edit Profile
                </button>

                <button
                  onClick={() => setShowJoinClass(true)}
                  className="flex h-[38px] items-center justify-center gap-[7px] rounded-[11px] bg-gradient-to-r from-[#981DFF] to-[#5A16E8] text-[13px] font-bold text-white shadow-[0_8px_18px_rgba(108,33,255,0.25)] transition hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Plus size={17} strokeWidth={3} />
                  Join Kelas
                </button>
              </div>
            </section>

            <section className="mt-[18px] grid grid-cols-4 gap-[7px] lg:grid-cols-2 lg:gap-[12px]">
              <ProfileStat
                icon={<Star size={20} fill="#8A19FF" />}
                value={xp}
                label="XP"
                color="text-[#8A19FF]"
                bg="bg-[#F7F0FF]"
              />

              <ProfileStat
                icon={<Flame size={20} fill="#FF7A00" />}
                value={student?.streak || 0}
                label="Streak"
                color="text-[#FF7A00]"
                bg="bg-[#FFF1E3]"
              />

              <ProfileStat
                icon={<Trophy size={20} fill="#F5A400" />}
                value={statistics.completedQuizzes || 0}
                label="Quiz"
                color="text-[#F5A400]"
                bg="bg-[#FFF1D6]"
              />

              <ProfileStat
                icon={<Target size={20} />}
                value={`${statistics.accuracy || 0}%`}
                label="Score"
                color="text-[#16B966]"
                bg="bg-[#E8F8EE]"
              />
            </section>
          </div>

          <section className="mt-[18px] rounded-[18px] border border-[#E5E7EB] bg-white px-[17px] py-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] lg:mt-0 lg:self-start">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black">
                  Kelas Saya
                </h2>

                <p className="mt-[5px] text-[12px] font-medium text-[#6B7280]">
                  Kelas yang sedang kamu ikuti
                </p>
              </div>

              <button
                onClick={() => setShowJoinClass(true)}
                className="rounded-[10px] bg-[#F7F0FF] px-[12px] py-[8px] text-[13px] font-bold text-[#5A16E8] transition hover:scale-105 active:scale-95"
              >
                + Join
              </button>
            </div>

            <div className="mt-[16px] space-y-[10px]">
              {classes.length === 0 ? (
                <PageState
                  type="empty"
                  title="Belum join kelas"
                  message="Masukkan kode kelas dari teacher untuk bergabung."
                  action={
                    <button
                      onClick={() => setShowJoinClass(true)}
                      className="rounded-[10px] bg-[#651DFF] px-[16px] py-[9px] text-[13px] font-bold text-white"
                    >
                      Join Kelas
                    </button>
                  }
                />
              ) : (
                classes.map((item) => <ClassItem key={item._id} item={item} />)
              )}
            </div>
          </section>
        </div>

        <section className="mt-[20px] space-y-[12px] lg:grid lg:grid-cols-3 lg:gap-[16px] lg:space-y-0">
          <MenuItem
            icon={<BarChart3 size={24} />}
            title="Progress"
            desc="Lihat perkembangan belajar dan pemahamanmu"
            color="violet"
            onClick={() => navigate("/student/progress")}
          />

          <MenuItem
            icon={<Settings size={24} />}
            title="Setting"
            desc="Ubah pengaturan akun dan lainnya"
            color="violet"
            onClick={() => navigate("/student/settings")}
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

      <StudentDesktopNav />
      <StudentBottomNav />

      {showJoinClass && (
        <JoinClassModal
          onClose={() => setShowJoinClass(false)}
          onSuccess={() => {
            clearStudentCache();
            setShowJoinClass(false);
            fetchProfileData({ forceLoading: true });
          }}
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
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] px-[14px] pb-[104px] pt-[49px] lg:ml-[304px] lg:max-w-[1200px] lg:px-[32px] lg:pb-[40px]">
        {children}
      </div>

      <StudentDesktopNav />
      <StudentBottomNav />
    </main>
  );
};

const ProfileStat = ({ icon, value, label, color, bg }) => {
  return (
    <div className="rounded-[15px] border border-[#E5E7EB] bg-white px-[5px] py-[13px] text-center shadow-[0_5px_18px_rgba(0,0,0,0.03)] transition hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
      <div
        className={`mx-auto flex h-[34px] w-[34px] items-center justify-center rounded-[11px] ${bg} ${color}`}
      >
        {icon}
      </div>

      <p className="mt-[9px] truncate text-[15px] font-bold leading-none text-black">
        {value}
      </p>

      <p className="mt-[7px] text-[10px] font-medium leading-none text-[#6B7280]">
        {label}
      </p>
    </div>
  );
};

const ClassItem = ({ item }) => {
  return (
    <div className="group w-full rounded-[16px] border border-[#E5E7EB] bg-white px-[15px] py-[14px] text-left transition hover:-translate-y-[2px] hover:border-[#D7C4FF] hover:shadow-[0_10px_24px_rgba(101,29,255,0.08)]">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold leading-none text-[#101348]">
            {item.className}
          </h3>

          <p className="mt-[8px] text-[12px] font-medium leading-none text-[#6B7280]">
            Teacher: {item.teacher?.fullName || "Teacher"}
          </p>
        </div>

        <ChevronRight
          size={23}
          className="text-[#6B7280] transition group-hover:translate-x-[3px] group-hover:text-[#651DFF]"
        />
      </div>
    </div>
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
      className="group flex h-[64px] w-full items-center rounded-[16px] border border-[#E5E7EB] bg-white px-[16px] text-left transition hover:-translate-y-[2px] hover:border-[#D7C4FF] hover:shadow-[0_10px_24px_rgba(101,29,255,0.08)] active:scale-[0.99] lg:h-[118px] lg:flex-col lg:items-start lg:justify-center"
    >
      <div
        className={`flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[11px] ${iconBox}`}
      >
        {icon}
      </div>

      <div className="ml-[14px] flex-1 lg:ml-0 lg:mt-[12px] lg:flex-none">
        <h3 className="text-[13px] font-bold leading-none text-black">
          {title}
        </h3>

        <p className="mt-[7px] text-[11px] font-medium leading-[1.25] text-[#6B7280]">
          {desc}
        </p>
      </div>

      <ChevronRight
        size={25}
        className="text-[#6B7280] transition group-hover:translate-x-[3px] group-hover:text-[#651DFF] lg:absolute lg:right-[16px] lg:top-[16px]"
      />
    </button>
  );
};

const LogoutModal = ({ onCancel, onLogout }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 px-[32px]">
      <div className="w-full max-w-[337px] rounded-[18px] bg-white px-[28px] pb-[34px] pt-[15px] text-center shadow-[0_14px_34px_rgba(0,0,0,0.22)]">
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

export default ProfilePage;