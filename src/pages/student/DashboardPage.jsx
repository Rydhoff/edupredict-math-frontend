import { useEffect, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../../services/api";
import PageState from "../../components/ui/PageState";

import DashboardHeader from "../../components/student/DashboardHeader";
import HeroBanner from "../../components/student/HeroBanner";
import ProgressCard from "../../components/student/ProgressCard";
import DailyQuestCard from "../../components/student/DailyQuestCard";
import StreakCard from "../../components/student/StreakCard";
import StudentBottomNav from "../../components/student/StudentBottomNav";
import JoinClassModal from "../../components/student/JoinClassModal";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [showJoinClass, setShowJoinClass] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/student/dashboard");
      setDashboard(data.dashboard);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [location.key]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] px-[15px] pb-[104px] pt-[46px]">
        {loading ? (
          <PageState type="loading" title="Memuat dashboard..."/>
        ) : error ? (
          <PageState
            type="error"
            title="Gagal memuat dashboard"
            message={error}
            action={
              <button
                onClick={fetchDashboard}
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
            fetchDashboard();
          }}
        />
      )}
    </main>
  );
};

export default DashboardPage;