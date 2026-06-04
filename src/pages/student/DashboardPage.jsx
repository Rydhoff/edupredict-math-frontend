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
import StudentDesktopNav from "../../components/student/StudentDesktopNav";
import AppPageShell from "../../components/layout/AppPageShell";

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
    <>
      <AppPageShell>
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

            <div className="lg:grid lg:grid-cols-[1.25fr_0.75fr] lg:gap-[24px]">
              <div>
                <div className="transition duration-300 hover:-translate-y-[2px]">
                  <HeroBanner />
                </div>

                <div className="transition duration-300 hover:-translate-y-[2px]">
                  <ProgressCard dashboard={dashboard} />
                </div>
              </div>

              <div>
                <div className="transition duration-300 hover:-translate-y-[2px]">
                  <DailyQuestCard dashboard={dashboard} />
                </div>

                <div className="transition duration-300 hover:-translate-y-[2px]">
                  <StreakCard dashboard={dashboard} />
                </div>
              </div>
            </div>
          </div>
        )}</AppPageShell>

      <StudentDesktopNav />
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
    </>
  );
};

export default DashboardPage;