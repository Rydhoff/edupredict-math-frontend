import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";
import mascotSmall from "../../assets/images/mascot-small.png";

const predictionConfig = {
  Low: {
    label: "Baik",
    emoji: "🙂",
    bg: "bg-[#E8F8EE]",
    iconBg: "bg-[#33C46B]",
    text: "text-[#1F3C28]",
    note: "Kamu berada di jalur yang tepat!",
  },
  Medium: {
    label: "Cukup",
    emoji: "😐",
    bg: "bg-[#FFF7E6]",
    iconBg: "bg-[#F9B700]",
    text: "text-[#7A4E00]",
    note: "Masih ada beberapa topik yang perlu kamu latih.",
  },
  Hard: {
    label: "Perlu Bantuan",
    emoji: "😟",
    bg: "bg-[#FFECEC]",
    iconBg: "bg-[#EF4444]",
    text: "text-[#991B1B]",
    note: "Kamu perlu latihan tambahan dan bantuan AI.",
  },
  Unknown: {
    label: "Belum Ada",
    emoji: "🤖",
    bg: "bg-[#F3F4F6]",
    iconBg: "bg-[#9CA3AF]",
    text: "text-[#374151]",
    note: "Selesaikan quiz dulu untuk melihat prediksi AI.",
  },
};

const ProgressCard = ({ dashboard }) => {
  const navigate = useNavigate();

  const statistics = dashboard?.statistics || {};
  const aiPrediction = dashboard?.aiPrediction || null;
  const chart = dashboard?.chart || [];

  const progress = statistics.progress || 0;
  const totalAttempts = statistics.totalAttempts || 0;
  const targetQuestions = statistics.targetQuestions || 0;

  const riskLevel = aiPrediction?.riskLevel || "Unknown";
  const prediction = predictionConfig[riskLevel] || predictionConfig.Unknown;

  const chartData =
    chart.length > 0
      ? chart
      : [
          { day: "Sen", value: 0 },
          { day: "Sel", value: 0 },
          { day: "Rab", value: 0 },
          { day: "Kam", value: 0 },
          { day: "Jum", value: 0 },
          { day: "Sab", value: 0 },
          { day: "Min", value: 0 },
        ];

  return (
    <section className="mt-[16px] rounded-[15px] border border-[#E5E7EB] bg-white px-[17px] pb-[17px] pt-[19px] shadow-[0_6px_18px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[9px]">
          <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black">
            Progress & Pemahaman
          </h2>
        </div>

        <button
          onClick={() => navigate("/student/progress")}
          className="rounded-full px-[8px] py-[4px] text-[11px] font-bold text-[#651DFF] transition hover:bg-[#F7F0FF]"
        >
          Lihat Detail ›
        </button>
      </div>

      <div className="mt-[21px] flex gap-[15px]">
        <div className="relative w-[104px] shrink-0">
          <p className="text-[12px] font-bold text-black">Progres Belajar</p>

          <div className="relative mx-auto mt-[12px] flex h-[84px] w-[84px] items-center justify-center rounded-full bg-[#EEE8FF] transition duration-300 hover:scale-[1.04]">
            <div
              className="absolute inset-0 rounded-full transition-all duration-700"
              style={{
                background: `conic-gradient(#651DFF ${
                  progress * 3.6
                }deg, #EEE8FF 0deg)`,
              }}
            />
            <div className="relative flex h-[66px] w-[66px] items-center justify-center rounded-full bg-white">
              <span className="text-[22px] font-bold text-black">
                {progress}%
              </span>
            </div>
          </div>

          <p className="mt-[13px] text-center text-[13px] font-bold text-black">
            {totalAttempts} / {targetQuestions} soal
          </p>

          <p className="text-center text-[12px] font-medium text-[#6B7280]">
            Soal dikerjakan
          </p>

          <div className="absolute bottom-[-9px] left-[-18px] flex items-end">
            <img
              src={mascotSmall}
              alt="Octa"
              className="h-[65px] w-[65px] object-contain transition duration-300 hover:scale-105"
            />

            <div className="mb-[13px] ml-[-8px] rounded-[12px] border border-[#E4D3FF] bg-white px-[8px] py-[5px] text-[9px] font-bold leading-[1.1] text-[#651DFF] shadow-[0_4px_12px_rgba(101,29,255,0.08)]">
              Kamu hebat!
              <br />
              Terus semangat ya!
            </div>
          </div>
        </div>

        <div className="min-h-[213px] flex-1 rounded-[15px] border border-[#E5E7EB] bg-white px-[13px] py-[13px] transition duration-300 hover:border-[#E4D3FF] hover:shadow-[0_8px_20px_rgba(101,29,255,0.08)]">
          <h3 className="text-[12px] font-bold text-black">
            Prediksi Pemahaman (AI)
          </h3>

          <div
            className={`mt-[8px] inline-flex items-center gap-[7px] rounded-[8px] px-[8px] py-[5px] ${prediction.bg} transition duration-300 hover:scale-[1.03]`}
          >
            <span
              className={`flex h-[20px] w-[20px] items-center justify-center rounded-full text-[12px] ${prediction.iconBg}`}
            >
              {prediction.emoji}
            </span>
            <span className={`text-[12px] font-bold ${prediction.text}`}>
              {prediction.label}
            </span>
          </div>

          <p className="mt-[9px] text-[9px] font-medium text-[#6B7280]">
            {prediction.note}
          </p>

          <div className="mt-[8px] h-[87px] rounded-[10px] bg-[#FAFAFA] px-[4px] py-[4px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 8, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 8, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                  width={22}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#16B966"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#16B966", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-[9px] flex items-center gap-[7px] rounded-[8px] bg-[#E8F8EE] px-[9px] py-[8px] transition duration-300 hover:scale-[1.02] hover:shadow-[0_6px_14px_rgba(22,185,102,0.15)]">
            <span className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#FFE680] text-[14px]">
              💡
            </span>

            <p className="text-[10px] font-bold leading-[1.15] text-[#651DFF]">
              Pertahankan Konsistensimu
              <br />
              untuk hasil yang lebih maksimal!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressCard;