import { useState } from "react";

import api from "../../services/api";
import PageState from "../../components/ui/PageState";
import useCachedFetch from "../../hooks/useCachedFetch";

import DashboardHeader from "../../components/student/DashboardHeader";
import HeroBanner from "../../components/student/HeroBanner";
import ProgressCard from "../../components/student/ProgressCard";
import DailyQuestCard from "../../components/student/DailyQuestCard";
import StreakCard from "../../components/student/StreakCard";
import StudentBottomNav from "../../components/student/StudentBottomNav";
import JoinClassModal from "../../components/student/JoinClassModal";

const DashboardPage = () => {
  const [showJoinClass, setShowJoinClass] = useState(false);

  const {
    data: dashboard,
    loading,
    error,
    refetch: fetchDashboard,
  } = useCachedFetch({
    cacheKey: "student_dashboard",
    fetcher: async () => {
      const { data } = await api.get("/student/dashboard");
      return data.dashboard;
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] px-[15px] pb-[104px] pt-[46px]">
        {loading ? (
          <PageState type="loading" title="Memuat dashboard..." />
        ) : error ? (
          <PageState
            type="error"
            title="Gagal memuat dashboard"
            message={error}
            action={
              <button
                onClick={() => fetchDashboard({ forceLoading: true })}
                className="rounded-[10px] bg-[#651DFF] px-[16px] py-[9px] text-[13px] font-bold text-white transition hover:scale-[1.03] active:scale-[0.98]"
              >
                Coba Lagi
              </button>
            }
          />
        ) : !dashboard ? (
          <PageState
            type="empty"
            title="Dashboard belum tersedia"
            message="Mulai quiz pertama untuk melihat progress belajarmu."
          />
        ) : (
          <div className="animate-[fadeIn_0.35s_ease-out]">
            <DashboardHeader dashboard={dashboard} />

            <div className="transition duration-300 hover:-translate-y-[2px]">
              <HeroBanner />
            </div>

            <div className="transition duration-300 hover:-translate-y-[2px]">
              <ProgressCard dashboard={dashboard} />
            </div>

            <div className="transition duration-300 hover:-translate-y-[2px]">
              <DailyQuestCard dashboard={dashboard} />
            </div>

            <div className="transition duration-300 hover:-translate-y-[2px]">
              <StreakCard dashboard={dashboard} />
            </div>
          </div>
        )}
      </div>

      <StudentBottomNav />

      {showJoinClass && (
        <JoinClassModal
          onClose={() => setShowJoinClass(false)}
          onSuccess={() => {
            setShowJoinClass(false);
            fetchDashboard({ forceLoading: true });
          }}
        />
      )}
    </main>
  );
};

export default DashboardPage;