import { useState } from "react";
import {
  FileText,
  Plus,
  TrendingUp,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import PageState from "../../components/ui/PageState";
import TeacherBottomNav from "../../components/teacher/TeacherBottomNav";
import TeacherDesktopNav from "../../components/teacher/TeacherDesktopNav";
import CreateClassModal from "../../components/teacher/CreateClassModal";
import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/images/logo.png";
import mascot from "../../assets/images/mascot-dashboard.png";

import useCachedFetch from "../../hooks/useCachedFetch";
import { clearTeacherCache } from "../../utils/cache";

const TeacherDashboardPage = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const teacherName = user?.fullName?.split(" ")[0] || "Teacher";

  const greeting =
    user?.gender === "male"
      ? `Pak ${teacherName}`
      : user?.gender === "female"
      ? `Bu ${teacherName}`
      : `${teacherName}`;
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    data: dashboard,
    loading,
    error,
    refetch: fetchDashboard,
  } = useCachedFetch({
    cacheKey: "teacher_dashboard",
    fetcher: async () => {
      const { data } = await api.get("/teacher/dashboard");
      return data.dashboard;
    },
  });

  const summary = dashboard?.summary || {};
  const classMonitoring = dashboard?.classMonitoring || [];

  const handleCreateSuccess = () => {
    clearTeacherCache();
    setShowCreateModal(false);
    fetchDashboard({ forceLoading: true });
  };

  const summaryCards = [
    {
      icon: Users,
      value: summary.totalStudents ?? 0,
      label: "Siswa Aktif",
      bg: "bg-[#F3E8FF]",
      color: "text-[#8A19FF]",
    },
    {
      icon: TrendingUp,
      value: `${summary.averageProgress ?? 0}%`,
      label: "Rata-rata\nProgress",
      bg: "bg-[#E8F8EE]",
      color: "text-[#16B966]",
    },
    {
      icon: TriangleAlert,
      value: summary.studentsNeedAttention ?? 0,
      label: "Butuh\nPerhatian",
      bg: "bg-[#FFF1E3]",
      color: "text-[#FF9A1F]",
    },
    {
      icon: FileText,
      value: summary.weeklyCompletedQuiz ?? 0,
      label: "Quiz\nMinggu Ini",
      bg: "bg-[#EAF2FF]",
      color: "text-[#2478FF]",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] px-[14px] pb-[104px] pt-[49px] lg:ml-[304px] lg:max-w-[1100px] lg:px-[32px] lg:pb-[44px]">
        <header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[9px] lg:hidden">
              <img
                src={logo}
                alt="EduPredict Math"
                className="h-[48px] w-auto"
              />

              <h1 className="text-[22px] font-bold tracking-[-0.03em] text-[#101322]">
                EduPredict Math
              </h1>
            </div>

            <div className="hidden lg:block">
              <p className="text-[14px] font-medium text-[#6B7280]">
                Selamat datang kembali
              </p>

              <h1 className="mt-[5px] text-[32px] font-extrabold leading-none tracking-[-0.04em] text-black">
               Halo, {greeting}! 👋
              </h1>
            </div>
          </div>

          <div className="lg:hidden">
            <p className="mt-[25px] text-[14px] font-medium text-[#6B7280]">
              Selamat datang kembali
            </p>

            <h2 className="mt-[4px] text-[25px] font-bold leading-none tracking-[-0.04em] text-black">
             Halo, {greeting}! 👋
            </h2>
          </div>
        </header>

        {loading ? (
          <section className="mt-[24px]">
            <PageState type="loading" title="Memuat dashboard..." />
          </section>
        ) : error ? (
          <section className="mt-[24px]">
            <PageState
              type="error"
              title="Gagal memuat dashboard"
              message={error}
              action={
                <button
                  onClick={() => fetchDashboard({ forceLoading: true })}
                  className="rounded-[8px] bg-[#651DFF] px-[16px] py-[8px] text-[13px] font-bold text-white"
                >
                  Coba Lagi
                </button>
              }
            />
          </section>
        ) : (
          <div className="mt-[20px] lg:grid lg:grid-cols-[1fr_420px] lg:items-start lg:gap-[22px]">
            <div>
              <section className="rounded-[20px] border border-[#E4D3FF] bg-gradient-to-br from-[#F8F2FF] to-white shadow-[0_12px_30px_rgba(101,29,255,0.08)] lg:rounded-[24px]">
                <div className="relative min-h-[148px] overflow-hidden px-[17px] py-[15px] lg:min-h-[210px] lg:px-[26px] lg:py-[24px]">
                  <div className="relative z-10">
                    <h3 className="mt-[8px] text-[36px] font-bold leading-[0.8] tracking-[-0.07em] text-[#191A7A] lg:text-[54px]">
                      Octa
                    </h3>

                    <p className="mt-[4px] text-[11px] font-bold text-[#3918D5] lg:text-[13px]">
                      si Gurita Pintar
                    </p>

                    <p className="mt-[12px] w-[220px] text-[14px] font-bold leading-[1.08] text-black lg:mt-[18px] lg:w-[340px] lg:text-[22px] lg:leading-[1.12]">
                      Pantau progress siswa dan bantu mereka berkembang setiap
                      hari.
                    </p>
                  </div>

                  <div className="absolute right-[7px] top-[11px] h-[105px] w-[128px] animate-pulse rounded-full bg-[#EEE4FF] lg:right-[40px] lg:top-[28px] lg:h-[150px] lg:w-[180px]" />

                  <img
                    src={mascot}
                    alt="Octa"
                    className="absolute bottom-0 right-[1px] z-10 w-[165px] object-contain transition duration-300 hover:scale-105 lg:right-[24px] lg:w-[245px]"
                  />
                </div>
              </section>

              <section className="mt-[17px] grid grid-cols-2 gap-[10px] sm:grid-cols-4 lg:grid-cols-4 lg:gap-[12px]">
                {summaryCards.map((item) => (
                  <SummaryCard key={item.label} item={item} />
                ))}
              </section>
            </div>

            <section className="mt-[14px] rounded-[20px] border border-[#E5E7EB] bg-white px-[16px] pb-[24px] pt-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] lg:mt-0 lg:rounded-[24px] lg:px-[20px]">
              <div className="flex items-center justify-between">
                <h2 className="text-[24px] font-bold tracking-[-0.04em] text-black lg:text-[26px]">
                  Kelas Monitoring
                </h2>

                <button
                  onClick={() => navigate("/teacher/classes")}
                  className="text-[14px] font-bold text-[#5A16E8]"
                >
                  Lihat semua
                </button>
              </div>

              <div className="mt-[18px]">
                {classMonitoring.length === 0 ? (
                  <PageState
                    type="empty"
                    title="Belum ada kelas"
                    message="Tambahkan kelas untuk mulai memonitor siswa."
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
                  <div className="space-y-[11px]">
                    {classMonitoring.slice(0, 3).map((item) => (
                      <ClassMonitoringCard
                        key={item.id}
                        item={item}
                        onClick={() => navigate(`/teacher/classes/${item.id}`)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-[17px] flex justify-center">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="group flex h-[42px] items-center justify-center gap-[8px] rounded-full bg-gradient-to-r from-[#981DFF] to-[#5A16E8] px-[28px] text-[16px] font-bold text-white shadow-[0_10px_22px_rgba(108,33,255,0.28)] transition duration-300 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Plus
                    size={19}
                    strokeWidth={3}
                    className="transition duration-300 group-hover:rotate-90"
                  />
                  Tambah Kelas
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

      <TeacherDesktopNav />
      <TeacherBottomNav />

      {showCreateModal && (
        <CreateClassModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </main>
  );
};

const SummaryCard = ({ item }) => {
  const Icon = item.icon;

  return (
    <div className="flex min-h-[124px] flex-col items-center rounded-[14px] border border-[#E5E7EB] bg-white px-[8px] py-[13px] text-center shadow-[0_5px_18px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)] lg:min-h-[138px] lg:rounded-[18px]">
      <div
        className={`flex h-[42px] w-[42px] items-center justify-center rounded-[12px] ${item.bg} ${item.color} lg:h-[48px] lg:w-[48px] lg:rounded-[15px]`}
      >
        <Icon size={24} strokeWidth={2.2} />
      </div>

      <h3 className="mt-[9px] text-[22px] font-bold leading-none text-black lg:text-[25px]">
        {item.value}
      </h3>

      <p className="mt-[9px] whitespace-pre-line text-[11px] font-medium leading-[1.14] text-[#6B7280] lg:text-[12px]">
        {item.label}
      </p>
    </div>
  );
};

const ClassMonitoringCard = ({ item, onClick }) => {
  const progress = Math.min(item.averageProgress || 0, 100);

  return (
    <button
      onClick={onClick}
      className="w-full rounded-[16px] border border-[#E5E7EB] bg-white px-[16px] py-[14px] text-left transition duration-300 hover:-translate-y-[2px] hover:border-[#D7C4FF] hover:shadow-[0_10px_24px_rgba(101,29,255,0.08)] active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-[12px]">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold leading-none text-[#101348]">
            {item.className}
          </h3>

          <p className="mt-[7px] text-[12px] font-medium leading-none text-[#6B7280]">
            Class Code: {item.classCode}
          </p>
        </div>

        <p className="shrink-0 rounded-full bg-[#F7F0FF] px-[9px] py-[4px] text-[12px] font-bold text-[#651DFF]">
          {item.totalStudents} siswa
        </p>
      </div>

      <div className="mt-[13px] flex items-center justify-between">
        <p className="text-[12px] font-medium text-[#6B7280]">
          Rata-rata progress
        </p>

        <p className="text-[15px] font-bold text-[#101348]">{progress}%</p>
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

export default TeacherDashboardPage;