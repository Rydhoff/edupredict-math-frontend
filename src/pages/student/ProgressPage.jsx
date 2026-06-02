import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import api from "../../services/api";
import PageState from "../../components/ui/PageState";
import StudentBottomNav from "../../components/student/StudentBottomNav";
import mascotSmall from "../../assets/images/mascot-small.png";

const labelPositions = [
  { key: "Bilangan", x: "50%", y: "5%", align: "center" },
  { key: "Aljabar", x: "90%", y: "30%", align: "right" },
  { key: "Statistika", x: "88%", y: "67%", align: "right" },
  { key: "Rasio", x: "50%", y: "91%", align: "center" },
  { key: "Geometri", x: "10%", y: "67%", align: "left" },
  { key: "Pengukuran", x: "10%", y: "30%", align: "left" },
];

const descriptions = {
  Bilangan: "Kemampuan operasi dan konsep bilangan",
  Aljabar: "Kemampuan memahami pola dan persamaan",
  Geometri: "Kemampuan memahami bentuk dan ruang",
  Statistika: "Kemampuan memahami data, grafik, dan peluang",
  Rasio: "Kemampuan memahami perbandingan dan persen",
  Pengukuran: "Kemampuan memahami luas, volume, dan satuan",
};

const getProgressColor = (value) => {
  if (value < 50) return "bg-[#FF6B1A]";
  if (value < 70) return "bg-[#F9B700]";
  return "bg-[#18B866]";
};

const getValueTextColor = (value) => {
  if (value < 50) return "text-[#FF2D55]";
  if (value < 70) return "text-[#F59E0B]";
  return "text-[#641BFF]";
};

const ProgressPage = () => {
  const location = useLocation();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/student/dashboard");
      setDashboard(data.dashboard);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [location.key]);

  const categoryProgress = useMemo(() => {
    const progressData = dashboard?.categoryProgress || {};

    return labelPositions.map((item) => {
      const value = progressData?.[item.key]?.progress || 0;
      const total = progressData?.[item.key]?.total || 0;
      const correct = progressData?.[item.key]?.correct || 0;

      return {
        title: item.key,
        description: descriptions[item.key] || "Progress kategori",
        value,
        total,
        correct,
      };
    });
  }, [dashboard]);

  const hasAnyProgress = categoryProgress.some((item) => item.total > 0);

  const radarData = categoryProgress.map((item) => ({
    skill: item.title,
    value: item.value,
  }));

  if (loading) {
    return (
      <PageLayout>
        <PageState type="loading" title="Memuat progress..." />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <PageState
          type="error"
          title="Gagal memuat progress"
          message={error}
          action={
            <button
              onClick={fetchDashboard}
              className="rounded-[8px] bg-[#651DFF] px-[16px] py-[8px] text-[13px] font-bold text-white"
            >
              Coba Lagi
            </button>
          }
        />
      </PageLayout>
    );
  }

  if (!hasAnyProgress) {
    return (
      <PageLayout>
        <PageState
          type="empty"
          title="Belum ada progress"
          message="Selesaikan quiz terlebih dahulu untuk melihat perkembangan skill."
        />
      </PageLayout>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] bg-white px-[14px] pb-[104px] pt-[49px]">
        <h1 className="text-[26px] font-bold leading-none tracking-[-0.04em] text-black">
          Progress Skill
        </h1>

        <p className="mt-[8px] text-[15px] font-medium text-[#6B7280]">
          Pantau perkembangan kemampuan matematikamu
        </p>

        <section className="mt-[20px] rounded-[14px] border border-[#E5E7EB] bg-white px-[21px] pb-[24px] pt-[20px]">
          <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black">
            Skill Mapping
          </h2>

          <div className="relative mt-[12px] h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius={92}>
                <PolarGrid stroke="#E9EAF0" />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tickCount={5}
                  tick={{ fontSize: 9, fill: "#9CA3AF" }}
                  axisLine={false}
                />
                <Radar
                  dataKey="value"
                  stroke="#641BFF"
                  strokeWidth={2}
                  fill="#8A19FF"
                  fillOpacity={0.14}
                  dot={{ r: 4, fill: "#641BFF", strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>

            {labelPositions.map((item) => {
              const progressItem = categoryProgress.find(
                (cat) => cat.title === item.key
              );

              const value = progressItem?.value || 0;

              return (
                <div
                  key={item.key}
                  className="absolute text-center"
                  style={{
                    left: item.x,
                    top: item.y,
                    transform:
                      item.align === "center"
                        ? "translateX(-50%)"
                        : item.align === "left"
                        ? "translateX(-10%)"
                        : "translateX(-90%)",
                  }}
                >
                  <p className="whitespace-pre-line text-[9px] font-bold leading-[1.05] text-black">
                    {item.key}
                  </p>

                  <p
                    className={`mt-[3px] text-[15px] font-bold leading-none ${getValueTextColor(
                      value
                    )}`}
                  >
                    {value}%
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-[4px] flex h-[72px] items-center rounded-[8px] border border-[#E4D3FF] bg-[#F7F0FF] px-[10px]">
            <img
              src={mascotSmall}
              alt="Octa"
              className="ml-[-7px] h-[78px] w-[78px] object-contain"
            />

            <div className="ml-[10px]">
              <h3 className="text-[14px] font-bold text-[#651DFF]">
                Great Job!
              </h3>

              <p className="mt-[1px] text-[12px] font-medium leading-[1.18] text-black">
                Progress dihitung dari jawaban benar
                <br />
                pada setiap kategori quiz. 💪
              </p>
            </div>
          </div>
        </section>

        <section className="mt-[24px] rounded-[14px] border border-[#E5E7EB] bg-white px-[21px] py-[20px]">
          <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black">
            Progress per Kategori
          </h2>

          <div className="mt-[17px] space-y-[12px]">
            {categoryProgress.map((item) => (
              <CategoryProgressItem key={item.title} item={item} />
            ))}
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

const CategoryProgressItem = ({ item }) => {
  return (
    <div className="rounded-[15px] border border-[#E5E7EB] bg-white px-[20px] py-[17px]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[14px] font-bold text-black">{item.title}</h3>

          <p className="mt-[3px] text-[12px] font-medium text-[#6B7280]">
            {item.description}
          </p>

          <p className="mt-[6px] text-[11px] font-medium text-[#9CA3AF]">
            {item.correct} benar dari {item.total} percobaan
          </p>
        </div>

        <p className="text-[15px] font-bold text-black">{item.value}%</p>
      </div>

      <div className="mt-[11px] h-[6px] rounded-full bg-[#D9D9D9]">
        <div
          className={`h-full rounded-full ${getProgressColor(item.value)}`}
          style={{ width: `${item.value}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressPage;