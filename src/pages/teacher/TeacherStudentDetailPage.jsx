import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  ChevronDown,
  Target,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import api from "../../services/api";
import PageState from "../../components/ui/PageState";
import TeacherBottomNav from "../../components/teacher/TeacherBottomNav";
import TeacherDesktopNav from "../../components/teacher/TeacherDesktopNav";
import studentPhoto from "../../assets/images/profile/student-ridho.png";
import { clearTeacherCache } from "../../utils/cache";

const categoryLabels = [
  "Bilangan",
  "Aljabar",
  "Geometri",
  "Statistika",
  "Rasio",
  "Pengukuran",
];

const TeacherStudentDetailPage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [tab, setTab] = useState("overview");
  const [data, setData] = useState(null);
  const [studentClasses, setStudentClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [error, setError] = useState("");

  const fetchStudentDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentRes, classesRes] = await Promise.all([
        api.get(`/teacher/students/${studentId}/analytics`),
        api.get("/classes"),
      ]);

      setData(studentRes.data);

      const relatedClasses = (classesRes.data.classes || []).filter((cls) =>
        (cls.students || []).some((student) => {
          const id = student._id || student.id || student;
          return String(id) === String(studentId);
        })
      );

      setStudentClasses(relatedClasses);
      setSelectedClassId(relatedClasses[0]?._id || "");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat detail siswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDetail();
  }, [studentId]);

  const handleRemoveStudent = async () => {
    if (!selectedClassId) {
      setError("Pilih kelas terlebih dahulu");
      return;
    }

    try {
      setRemoving(true);
      setError("");

      await api.delete(`/classes/${selectedClassId}/students/${studentId}`);
      clearTeacherCache();
      sessionStorage.removeItem("teacher_students");

      setShowRemoveModal(false);
      navigate("/teacher/students");
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menghapus siswa dari kelas"
      );
    } finally {
      setRemoving(false);
    }
  };

  const skillData = useMemo(() => {
    const mastery = data?.latestPrediction?.categoryMastery || {};

    return categoryLabels.map((label) => {
      const value = mastery[label];

      return {
        title: label,
        desc: "Kemampuan siswa pada kategori ini",
        value:
          value === null || value === undefined ? 0 : Math.round(value * 100),
      };
    });
  }, [data]);

  const radarData = useMemo(() => {
    return skillData.map((item) => ({
      skill: item.title,
      value: item.value,
    }));
  }, [skillData]);

  if (loading) {
    return (
      <PageLayout>
        <PageState type="loading" title="Memuat detail siswa..." />
      </PageLayout>
    );
  }

  if (error && !data?.student) {
    return (
      <PageLayout>
        <PageState
          type="error"
          title="Gagal memuat detail siswa"
          message={error}
          action={
            <button
              onClick={fetchStudentDetail}
              className="rounded-[8px] bg-[#651DFF] px-[16px] py-[8px] text-[13px] font-bold text-white"
            >
              Coba Lagi
            </button>
          }
        />
      </PageLayout>
    );
  }

  if (!data?.student) {
    return (
      <PageLayout>
        <PageState
          type="empty"
          title="Siswa tidak ditemukan"
          message="Data siswa belum tersedia."
        />
      </PageLayout>
    );
  }

  const student = data.student;
  const stats = data.statistics || {};
  const riskLevel = data.latestPrediction?.riskLevel || "Unknown";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] px-[14px] pb-[104px] pt-[49px] lg:ml-[304px] lg:max-w-[1100px] lg:px-[32px] lg:pb-[44px]">
        <header>
          <div className="flex items-center justify-between gap-[14px]">
            <div className="flex min-w-0 items-center gap-[12px]">
              <button
                onClick={() => navigate(-1)}
                className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] bg-white text-[#6B7280] shadow-sm transition hover:scale-105 active:scale-95"
              >
                <ArrowLeft size={24} />
              </button>

              <h1 className="truncate text-[26px] font-bold leading-none tracking-[-0.04em] text-black lg:text-[32px] lg:font-extrabold">
                Student Detail
              </h1>
            </div>

            <button
              onClick={() => setShowRemoveModal(true)}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] border border-red-100 bg-red-50 text-red-500 transition hover:scale-105 active:scale-95"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {error && (
            <div className="mt-[14px] rounded-[12px] bg-red-50 px-[13px] py-[10px] text-[13px] font-semibold text-red-600">
              {error}
            </div>
          )}
        </header>

        <div className="mt-[24px] lg:grid lg:grid-cols-[340px_1fr] lg:items-start lg:gap-[24px]">
          <aside className="lg:sticky lg:top-[32px]">
            <section className="rounded-[22px] border border-[#E4D3FF] bg-gradient-to-br from-[#F8F2FF] to-white px-[22px] py-[20px] shadow-[0_10px_26px_rgba(101,29,255,0.08)] lg:rounded-[24px]">
              <div className="flex items-center lg:flex-col lg:text-center">
                <img
                  src={student.photoUrl || studentPhoto}
                  alt={student.fullName}
                  className="h-[78px] w-[78px] rounded-full border-4 border-white object-cover shadow-[0_3px_12px_rgba(0,0,0,0.18)] lg:h-[104px] lg:w-[104px]"
                />

                <div className="ml-[18px] min-w-0 flex-1 lg:ml-0 lg:mt-[16px] lg:w-full">
                  <h2 className="truncate text-[22px] font-bold leading-none tracking-[-0.04em] text-black">
                    {student.fullName}
                  </h2>

                  <p className="mt-[7px] text-[12px] font-medium leading-none text-[#6B7280]">
                    XP: {student.xp || 0} • Level {student.level || 1}
                  </p>

                  <RiskBadge riskLevel={riskLevel} />
                </div>
              </div>

              <div className="mt-[18px] grid grid-cols-3 gap-[8px] lg:grid-cols-1">
                <MiniStat
                  icon={<Target size={18} />}
                  value={`${stats.accuracy || 0}%`}
                  label="Akurasi"
                  color="text-[#651DFF]"
                  bg="bg-[#F7F0FF]"
                />

                <MiniStat
                  icon={<BarChart3 size={18} />}
                  value={stats.totalAttempts || 0}
                  label="Attempts"
                  color="text-[#16B966]"
                  bg="bg-[#E8F8EE]"
                />

                <MiniStat
                  icon={<TriangleAlert size={18} />}
                  value={riskLevel}
                  label="Risk"
                  color="text-[#EF4444]"
                  bg="bg-[#FFE1E1]"
                />
              </div>
            </section>

            <div className="mt-[18px] grid grid-cols-2 rounded-[16px] bg-[#F8F9FB] p-[4px]">
              <TabButton
                active={tab === "overview"}
                onClick={() => setTab("overview")}
              >
                Overview
              </TabButton>

              <TabButton active={tab === "skill"} onClick={() => setTab("skill")}>
                Skill
              </TabButton>
            </div>
          </aside>

          <section className="mt-[18px] lg:mt-0">
            {tab === "overview" ? (
              <OverviewTab radarData={radarData} skillData={skillData} />
            ) : (
              <SkillTab skillData={skillData} />
            )}
          </section>
        </div>
      </div>

      <TeacherDesktopNav />
      <TeacherBottomNav />

      {showRemoveModal && (
        <RemoveStudentModal
          studentName={student.fullName}
          classes={studentClasses}
          selectedClassId={selectedClassId}
          setSelectedClassId={setSelectedClassId}
          removing={removing}
          onCancel={() => setShowRemoveModal(false)}
          onRemove={handleRemoveStudent}
        />
      )}
    </main>
  );
};

const PageLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] px-[14px] pb-[104px] pt-[49px] lg:ml-[304px] lg:max-w-[1100px] lg:px-[32px] lg:pb-[44px]">
        {children}
      </div>

      <TeacherDesktopNav />
      <TeacherBottomNav />
    </main>
  );
};

const TabButton = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`h-[40px] rounded-[12px] text-[14px] font-bold transition ${
        active
          ? "bg-white text-[#651DFF] shadow-[0_4px_14px_rgba(0,0,0,0.06)]"
          : "text-[#6B7280]"
      }`}
    >
      {children}
    </button>
  );
};

const RiskBadge = ({ riskLevel }) => {
  const style = {
    Low: "bg-[#DFFBEA] text-[#0FA85D]",
    Medium: "bg-[#FFF1D6] text-[#D88B00]",
    Hard: "bg-[#FFE1E1] text-[#EF4444]",
    Unknown: "bg-[#F3F4F6] text-[#6B7280]",
  };

  return (
    <span
      className={`mt-[10px] inline-flex rounded-[8px] px-[10px] py-[6px] text-[12px] font-bold leading-none ${
        style[riskLevel] || style.Unknown
      }`}
    >
      {riskLevel} Risk
    </span>
  );
};

const MiniStat = ({ icon, value, label, color, bg }) => {
  return (
    <div className="rounded-[13px] border border-[#E5E7EB] bg-white px-[8px] py-[11px] text-center shadow-sm transition hover:-translate-y-[2px] lg:flex lg:items-center lg:px-[13px] lg:text-left">
      <div
        className={`mx-auto flex h-[28px] w-[28px] items-center justify-center rounded-[9px] ${bg} ${color} lg:mx-0 lg:h-[36px] lg:w-[36px] lg:rounded-[11px]`}
      >
        {icon}
      </div>

      <div className="lg:ml-[10px]">
        <p
          className={`mt-[7px] truncate text-[14px] font-bold leading-none ${color} lg:mt-0 lg:text-[16px]`}
        >
          {value}
        </p>

        <p className="mt-[6px] text-[10px] font-medium leading-none text-[#6B7280]">
          {label}
        </p>
      </div>
    </div>
  );
};

const OverviewTab = ({ radarData, skillData }) => {
  const labels = [
    {
      title: "Bilangan",
      value: findValue(skillData, "Bilangan"),
      x: "50%",
      y: "4%",
    },
    {
      title: "Aljabar",
      value: findValue(skillData, "Aljabar"),
      x: "90%",
      y: "29%",
      align: "right",
    },
    {
      title: "Statistika",
      value: findValue(skillData, "Statistika"),
      x: "88%",
      y: "67%",
      align: "right",
    },
    {
      title: "Rasio",
      value: findValue(skillData, "Rasio"),
      x: "50%",
      y: "92%",
    },
    {
      title: "Geometri",
      value: findValue(skillData, "Geometri"),
      x: "10%",
      y: "67%",
      align: "left",
    },
    {
      title: "Pengukuran",
      value: findValue(skillData, "Pengukuran"),
      x: "10%",
      y: "29%",
      align: "left",
    },
  ];

  return (
    <section className="rounded-[22px] border border-[#E5E7EB] bg-white px-[21px] pb-[24px] pt-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] lg:rounded-[24px]">
      <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black lg:text-[24px]">
        Skill Mapping
      </h2>

      <div className="relative mt-[8px] h-[320px] lg:h-[430px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} outerRadius="62%">
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
              fillOpacity={0.13}
              dot={{ r: 4, fill: "#641BFF", strokeWidth: 0 }}
            />
          </RadarChart>
        </ResponsiveContainer>

        {labels.map((item) => (
          <div
            key={item.title}
            className="absolute text-center"
            style={{
              left: item.x,
              top: item.y,
              transform:
                item.align === "left"
                  ? "translateX(-10%)"
                  : item.align === "right"
                  ? "translateX(-90%)"
                  : "translateX(-50%)",
            }}
          >
            <p className="whitespace-pre-line text-[9px] font-bold leading-[1.05] text-black lg:text-[11px]">
              {item.title}
            </p>

            <p className="mt-[3px] text-[15px] font-bold leading-none text-[#641BFF] lg:text-[17px]">
              {item.value}%
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const SkillTab = ({ skillData }) => {
  return (
    <section className="rounded-[22px] border border-[#E5E7EB] bg-white px-[18px] py-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] lg:rounded-[24px] lg:px-[20px]">
      <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black lg:text-[24px]">
        Skill Progress
      </h2>

      <div className="mt-[20px] grid gap-[12px] lg:grid-cols-2">
        {skillData.map((item) => (
          <SkillProgressCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
};

const SkillProgressCard = ({ item }) => {
  const color =
    item.value < 50
      ? "bg-[#FF6B1A]"
      : item.value < 70
      ? "bg-[#F9B700]"
      : "bg-[#18B866]";

  return (
    <div className="rounded-[16px] border border-[#E5E7EB] bg-white px-[18px] py-[16px] transition hover:-translate-y-[2px] hover:border-[#D7C4FF] hover:shadow-[0_10px_24px_rgba(101,29,255,0.08)]">
      <div className="flex items-start justify-between gap-[12px]">
        <div className="min-w-0">
          <h3 className="text-[14px] font-bold text-black">{item.title}</h3>

          <p className="mt-[3px] text-[12px] font-medium text-[#6B7280]">
            {item.desc}
          </p>
        </div>

        <p className="shrink-0 text-[15px] font-bold text-black">
          {item.value}%
        </p>
      </div>

      <div className="mt-[11px] h-[7px] overflow-hidden rounded-full bg-[#D9D9D9]">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${item.value}%` }}
        />
      </div>
    </div>
  );
};

const RemoveStudentModal = ({
  studentName,
  classes,
  selectedClassId,
  setSelectedClassId,
  removing,
  onCancel,
  onRemove,
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 px-[30px]">
      <div className="w-full max-w-[337px] rounded-[18px] bg-white px-[24px] pb-[28px] pt-[24px] text-center shadow-[0_14px_34px_rgba(0,0,0,0.22)]">
        <button
          onClick={onCancel}
          className="ml-auto flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280]"
        >
          <X size={18} />
        </button>

        <div className="mx-auto mt-[8px] flex h-[76px] w-[76px] items-center justify-center rounded-full bg-red-50 text-red-500">
          <Trash2 size={36} />
        </div>

        <h2 className="mt-[20px] text-[20px] font-bold text-black">
          Hapus siswa?
        </h2>

        <p className="mt-[8px] text-[13px] font-medium leading-[1.45] text-[#6B7280]">
          Siswa <span className="font-bold text-black">{studentName}</span> akan
          dihapus dari kelas yang dipilih.
        </p>

        <div className="relative mt-[16px]">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="h-[40px] w-full appearance-none rounded-[10px] border border-[#E5E7EB] px-[12px] pr-[38px] text-[13px] font-bold outline-none"
          >
            {classes.length === 0 ? (
              <option value="">Tidak ada kelas</option>
            ) : (
              classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}
                </option>
              ))
            )}
          </select>

          <ChevronDown
            size={20}
            className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 text-[#6B7280]"
          />
        </div>

        <div className="mt-[22px] grid grid-cols-2 gap-[12px]">
          <button
            onClick={onCancel}
            disabled={removing}
            className="h-[38px] rounded-[10px] border border-[#E5E7EB] text-[13px] font-bold text-black disabled:opacity-60"
          >
            Batal
          </button>

          <button
            onClick={onRemove}
            disabled={removing || !selectedClassId}
            className="h-[38px] rounded-[10px] bg-red-600 text-[13px] font-bold text-white disabled:opacity-60"
          >
            {removing ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

const findValue = (data, title) => {
  return data.find((item) => item.title === title)?.value || 0;
};

export default TeacherStudentDetailPage;