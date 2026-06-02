import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Check } from "lucide-react";

import api from "../../services/api";
import PageState from "../../components/ui/PageState";
import StudentBottomNav from "../../components/student/StudentBottomNav";

import maleAvatar from "../../assets/images/avatars/male.png";
import femaleAvatar from "../../assets/images/avatars/female.png";

import streakBadge from "../../assets/images/badges/streak.png";
import streakLockedBadge from "../../assets/images/badges/streak-locked.png";

import perfectScoreBadge from "../../assets/images/badges/perfect-score.png";
import perfectScoreLockedBadge from "../../assets/images/badges/perfect-score-locked.png";

import quickLearnerBadge from "../../assets/images/badges/quick-learner.png";
import quickLearnerLockedBadge from "../../assets/images/badges/quick-learner-locked.png";

import mathMasterBadge from "../../assets/images/badges/math-master.png";
import mathMasterLockedBadge from "../../assets/images/badges/math-master-locked.png";

import logicGeniusBadge from "../../assets/images/badges/logic-genius.png";
import logicGeniusLockedBadge from "../../assets/images/badges/logic-genius-locked.png";

import speedSolverBadge from "../../assets/images/badges/speed-solver.png";
import speedSolverLockedBadge from "../../assets/images/badges/speed-solver-locked.png";

const avatarMap = {
  male: maleAvatar,
  female: femaleAvatar,
};

const achievementsBase = [
  {
    title: "5-Day Streak",
    desc: "Belajar selama 5 hari berturut-turut",
    image: streakBadge,
    check: (student, stats) => student.streak >= 5,
  },
  {
    title: "Perfect Score",
    desc: "Dapatkan nilai 100 di Quiz",
    image: perfectScoreBadge,
    check: (student, stats) => stats.accuracy === 100,
  },
  {
    title: "Quick Learner",
    desc: "Naikkan progress dengan cepat",
    image: quickLearnerBadge,
    check: (student, stats) => stats.progress >= 50,
  },
  {
    title: "Math Master",
    desc: "Selesaikan semua Quiz dengan nilai 100",
    image: mathMasterLockedBadge,
    check: (student, stats) => stats.accuracy === 100 && stats.completedQuizzes >= 10,
  },
  {
    title: "Logic Genius",
    desc: "Selesaikan Quiz Logika & Problem Solving",
    image: logicGeniusBadge,
    check: (student, stats) => stats.totalAttempts >= 5,
  },
  {
    title: "Speed Solver",
    desc: "Selesaikan Quiz kurang dari 5 menit",
    image: speedSolverLockedBadge,
    check: () => false,
  },
];

const RewardsPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardError, setLeaderboardError] = useState("");
  const [achievements, setAchievements] = useState([]);
  const location = useLocation();

  const fetchRewardsData = async () => {
  try {
    setLoading(true);
    setError("");
    setLeaderboardError("");

    const [dashboardRes, leaderboardRes, achievementsRes] = await Promise.all([
      api.get("/student/dashboard"),
      api.get("/leaderboard"),
      api.get("/achievements"),
    ]);

    setDashboard(dashboardRes.data.dashboard);
    setLeaderboard(leaderboardRes.data.leaderboard || []);
    setAchievements(achievementsRes.data.achievements || []);
  } catch (err) {
    setError(err.response?.data?.message || "Gagal memuat rewards");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchRewardsData();
}, [location.key]);

  const student = dashboard?.student || {};
  const statistics = dashboard?.statistics || {};

  const getBadgeImage = (achievement) => {
  const badgeMap = {
    streak: {
      unlocked: streakBadge,
      locked: streakLockedBadge,
    },
    "perfect-score": {
      unlocked: perfectScoreBadge,
      locked: perfectScoreLockedBadge,
    },
    "quick-learner": {
      unlocked: quickLearnerBadge,
      locked: quickLearnerLockedBadge,
    },
    "math-master": {
      unlocked: mathMasterBadge,
      locked: mathMasterLockedBadge,
    },
    "logic-genius": {
      unlocked: logicGeniusBadge,
      locked: logicGeniusLockedBadge,
    },
    "speed-solver": {
      unlocked: speedSolverBadge,
      locked: speedSolverLockedBadge,
    },
  };

  const selected = badgeMap[achievement.key];

  if (!selected) return null;

  return achievement.unlocked ? selected.unlocked : selected.locked;
};

  if (loading) {
    return (
      <PageLayout>
        <PageState type="loading" title="Memuat rewards..." />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <PageState
          type="error"
          title="Gagal memuat rewards"
          message={error}
          action={
            <button
              onClick={fetchRewardsData}
              className="rounded-[8px] bg-[#651DFF] px-[16px] py-[8px] text-[13px] font-bold text-white"
            >
              Coba Lagi
            </button>
          }
        />
      </PageLayout>
    );
  }

  if (!dashboard) {
    return (
      <PageLayout>
        <PageState
          type="empty"
          title="Belum ada rewards"
          message="Selesaikan quiz untuk mulai mendapatkan XP dan achievement."
        />
      </PageLayout>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] bg-white px-[14px] pb-[104px] pt-[49px]">
        <h1 className="text-[26px] font-bold leading-none tracking-[-0.04em] text-black">
          Rewards
        </h1>

        <p className="mt-[8px] text-[15px] font-medium text-[#6B7280]">
          Terus belajar dan kumpulkan XP!
        </p>

        <section className="mt-[20px] rounded-[16px] border border-[#E5E7EB] bg-white px-[21px] pb-[22px] pt-[20px] shadow-[0_8px_22px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black">
              Leaderboard
            </h2>

            <button className="h-[25px] rounded-[7px] border border-[#E5E7EB] bg-white px-[12px] text-[12px] font-medium text-[#6B7280]">
              Minggu ini
            </button>
          </div>

          <div className="mt-[18px] space-y-[9px]">
            {leaderboard.length === 0 ? (
              <PageState
                type="empty"
                title="Leaderboard kosong"
                message="Belum ada data ranking siswa."
              />
            ) : (
              leaderboard.map((user) => (
                <LeaderboardItem key={user.id} user={user} />
              ))
            )}
          </div>

          <div className="mt-[23px] flex h-[45px] items-center justify-between rounded-[6px] bg-[#F7F0FF] px-[15px]">
            <p className="text-[16px] font-bold text-[#651DFF]">
              XP kamu saat ini :
            </p>

            <p className="text-[24px] font-bold text-[#651DFF]">
              {student.xp || 0} XP
            </p>
          </div>
        </section>

        <section className="mt-[20px] rounded-[14px] border border-[#E5E7EB] bg-white px-[21px] pb-[23px] pt-[20px]">
          <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black">
            Achievements
          </h2>

          <div className="mt-[17px] grid grid-cols-2 gap-[12px]">
            {achievements.length === 0 ? (
              <PageState
                type="empty"
                title="Belum ada achievement"
                message="Selesaikan quiz untuk membuka achievement."
              />
            ) : (
              achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.key}
                  item={{
                    ...achievement,
                    image: getBadgeImage(achievement),
                  }}
                />
              ))
            )}
          </div>
        </section>
      </div>

      <StudentBottomNav />
    </main>
  );
};

const PageLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] px-[14px] pb-[104px] pt-[49px]">
        {children}
      </div>

      <StudentBottomNav />
    </main>
  );
};

const LeaderboardItem = ({ user }) => {
  const avatar =
    user.photoUrl || avatarMap[user.gender] || maleAvatar;

  return (
    <div
      className={`flex h-[40px] items-center py-[24px] rounded-[6px] px-[14px] ${
        user.active ? "bg-[#F7F0FF]" : "bg-white"
      }`}
    >
      <p
        className={`w-[26px] text-[14px] font-bold ${
          user.active ? "text-[#651DFF]" : "text-black"
        }`}
      >
        {user.rank}
      </p>

      <img
        src={avatar}
        alt={user.name}
        className="h-[29px] w-[29px] rounded-full object-cover"
      />

      <p
        className={`ml-[18px] flex-1 truncate text-[14px] font-bold ${
          user.active ? "text-[#651DFF]" : "text-black"
        }`}
      >
        {user.active ? `${user.name} (Kamu)` : user.name}
      </p>

      <p
        className={`text-[14px] font-bold ${
          user.active ? "text-[#651DFF]" : "text-black"
        }`}
      >
        {user.xp} XP
      </p>
    </div>
  );
};

const AchievementCard = ({ item }) => {
  return (
   <div className="relative min-h-[226px] rounded-[14px] border border-[#E5E7EB] bg-white px-[10px] pb-[15px] pt-[13px] text-center shadow-[0_5px_16px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-[3px] hover:shadow-[0_12px_26px_rgba(101,29,255,0.12)]">
      {item.unlocked && (
        <div className="absolute right-[8px] top-[8px] z-10 flex h-[25px] w-[25px] items-center justify-center rounded-full bg-[#16B966] text-white">
          <Check size={16} strokeWidth={3} />
        </div>
      )}

      <div className="mx-auto flex h-[116px] items-center justify-center">
        <img
          src={item.image}
          alt={item.title}
          className={`h-[112px] w-[112px] object-contain transition duration-300 ${
            item.unlocked
              ? "hover:scale-105"
              : "opacity-70 grayscale"
          }`}
        />
      </div>

      {item.unlocked ? (
        <div className="mx-auto mt-[8px] mb-[8px] w-fit rounded-full bg-[#EAFBF2] px-[10px] py-[4px] text-[10px] font-bold text-[#16B966]">
          Unlocked
        </div>
      ) : (
        <div className="mx-auto mt-[8px] mb-[8px] w-fit rounded-full bg-[#F3F4F6] px-[10px] py-[4px] text-[10px] font-bold text-[#9CA3AF]">
          Locked
        </div>
      )}

      <h3 className="mt-[14px] text-[14px] font-bold text-black">
        {item.title}
      </h3>

      <p className="mx-auto mt-[5px] max-w-[125px] text-[12px] font-medium leading-[1.15] text-[#6B7280]">
        {item.desc}
      </p>
    </div>
  );
};

export default RewardsPage;