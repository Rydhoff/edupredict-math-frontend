import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock3,
  Flame,
  Home,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";

import PageState from "../../components/ui/PageState";
import mascotResult from "../../assets/images/mascot-result.png";

const getResultMessage = (accuracy) => {
  if (accuracy >= 90) {
    return {
      title: "Luar biasa! 🎉",
      desc: "Pemahamanmu sangat kuat. Pertahankan ritme belajarmu!",
    };
  }

  if (accuracy >= 70) {
    return {
      title: "Great job!",
      desc: "Hasilmu sudah bagus. Sedikit latihan lagi bisa makin mantap!",
    };
  }

  return {
    title: "Tetap semangat!",
    desc: "Kamu sudah mencoba dengan baik. Yuk ulangi dan perkuat lagi konsepnya!",
  };
};

const QuizResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const result = location.state || null;

  if (!result) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
        <div className="mx-auto min-h-screen w-full max-w-[460px] px-[15px] pt-[92px]">
          <PageState
            type="empty"
            title="Result tidak tersedia"
            message="Data hasil quiz tidak ditemukan. Silakan mulai quiz kembali."
            action={
              <button
                onClick={() => navigate("/student/quizzes/library")}
                className="rounded-[10px] bg-[#651DFF] px-[16px] py-[9px] text-[13px] font-bold text-white transition hover:scale-[1.03] active:scale-[0.98]"
              >
                Mulai Quiz
              </button>
            }
          />
        </div>
      </main>
    );
  }

  const score = result.score || result.correctAnswers || 0;
  const totalQuestions = result.totalQuestions || 8;
  const accuracy =
    result.accuracy || Math.round((score / totalQuestions) * 100) || 0;
  const xpEarned = result.xpEarned || score * 10;
  const wrong = Math.max(totalQuestions - score, 0);

  const message = getResultMessage(accuracy);

  const handleRetry = () => {
    navigate(`/student/quiz/play?category=${result?.category || "Mixed"}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] px-[15px] pb-[38px] pt-[74px]">
        <div className="relative flex justify-center">

          <img
            src={mascotResult}
            alt="Quiz selesai"
            className="relative z-10 w-[215px] object-contain transition duration-300 hover:scale-105"
          />
        </div>

        <h1 className="mt-[17px] text-center text-[34px] font-bold tracking-[-0.05em] text-black">
          Quiz Selesai!
        </h1>

        <p className="mt-[5px] text-center text-[21px] font-bold text-[#651DFF]">
          {message.title}
        </p>

        <p className="mx-auto mt-[6px] max-w-[330px] text-center text-[13px] font-medium leading-[1.35] text-[#6B7280]">
          {message.desc}
        </p>

        <section className="mt-[28px] grid grid-cols-2 overflow-hidden rounded-[14px] border border-[#E4D3FF] bg-[#FAF5FF] py-[18px] shadow-[0_8px_24px_rgba(101,29,255,0.08)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(101,29,255,0.12)]">
          <div className="border-r border-[#E4D3FF] text-center">
            <p className="text-[14px] font-medium text-[#6B7280]">
              Skor kamu
            </p>

            <h2 className="mt-[6px] text-[26px] font-bold text-black">
              {score}/{totalQuestions}
            </h2>
          </div>

          <div className="text-center">
            <p className="text-[14px] font-medium text-[#6B7280]">Akurasi</p>

            <h2 className="mt-[6px] text-[26px] font-bold text-[#651DFF]">
              {accuracy}%
            </h2>
          </div>
        </section>

        <section className="mt-[22px] grid grid-cols-4 gap-[7px]">
          <MiniCard icon={<Clock3 size={14} />} label="Waktu" value="08:35" />
          <MiniCard
            icon={<Flame size={14} />}
            label="XP"
            value={`+${xpEarned}`}
          />
          <MiniCard
            icon={<CheckCircle size={14} />}
            label="Benar"
            value={score}
          />
          <MiniCard icon={<XCircle size={14} />} label="Salah" value={wrong} />
        </section>

        <div className="mt-[26px] grid grid-cols-2 gap-[12px]">
          <button
            onClick={handleRetry}
            className="flex h-[42px] items-center justify-center gap-[7px] rounded-[10px] border border-[#E5E7EB] bg-white text-[14px] font-bold text-black shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition duration-300 hover:scale-[1.03] hover:bg-[#F8F9FB] active:scale-[0.98]"
          >
            <RotateCcw size={17} />
            Ulangi Quiz
          </button>

          <button
            onClick={() => navigate("/student/rewards")}
            className="flex h-[42px] items-center justify-center gap-[7px] rounded-[10px] border border-[#E5E7EB] bg-white text-[14px] font-bold text-black shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition duration-300 hover:scale-[1.03] hover:bg-[#F8F9FB] active:scale-[0.98]"
          >
            <Trophy size={17} />
            Leaderboard
          </button>
        </div>

        <button
          onClick={() => navigate("/student")}
          className="mt-[16px] flex h-[42px] w-full items-center justify-center gap-[7px] rounded-[10px] bg-gradient-to-r from-[#7B2CFF] to-[#4F1DE8] text-[16px] font-bold text-white shadow-[0_10px_22px_rgba(101,29,255,0.28)] transition duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Home size={18} />
          Kembali ke Home
        </button>
      </div>
    </main>
  );
};

const MiniCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-[10px] border border-[#E4D3FF] bg-[#FAF5FF] px-[6px] py-[10px] text-center shadow-[0_4px_12px_rgba(101,29,255,0.05)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_18px_rgba(101,29,255,0.12)]">
      <div className="flex items-center justify-center gap-[3px] text-[#651DFF]">
        {icon}
        <p className="text-[10px] font-medium text-[#6B7280]">{label}</p>
      </div>

      <h3 className="mt-[5px] text-[18px] font-bold text-black">{value}</h3>
    </div>
  );
};

export default QuizResultPage;