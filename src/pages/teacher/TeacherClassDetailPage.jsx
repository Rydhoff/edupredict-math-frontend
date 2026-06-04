import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  ChevronRight,
  FileText,
  Target,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import PageState from "../../components/ui/PageState";
import TeacherBottomNav from "../../components/teacher/TeacherBottomNav";
import TeacherDesktopNav from "../../components/teacher/TeacherDesktopNav";
import AppPageShell from "../../components/layout/AppPageShell";

const normalizeMastery = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }

  const numberValue = Number(value);

  return numberValue <= 1
    ? Math.round(numberValue * 100)
    : Math.round(numberValue);
};

const getStudentAverageMastery = (categoryMastery = {}) => {
  const values = Object.values(categoryMastery)
    .filter((value) => value !== null && value !== undefined)
    .map(Number)
    .filter((value) => !Number.isNaN(value));

  if (values.length === 0) return null;

  const averageRaw =
    values.reduce((sum, value) => sum + value, 0) / values.length;

  return averageRaw <= 1
    ? Math.round(averageRaw * 100)
    : Math.round(averageRaw);
};

const getClassAverageMastery = (students = []) => {
  const studentMasteries = students
    .map((item) => getStudentAverageMastery(item.categoryMastery || {}))
    .filter((value) => value !== null);

  if (studentMasteries.length === 0) return 0;

  return Math.round(
    studentMasteries.reduce((sum, value) => sum + value, 0) /
      studentMasteries.length
  );
};

const TeacherClassDetailPage = () => {
  const navigate = useNavigate();
  const { classId } = useParams();

  const [tab, setTab] = useState("overview");
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState("");

  const fetchClassAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(`/teacher/classes/${classId}/analytics`);

      setClassData(data.class);
      setSummary(data.summary);
      setStudents(data.students || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat detail kelas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassAnalytics();
  }, [classId]);

  const averageMastery = useMemo(() => {
    const summaryValue =
      summary?.averageMastery ?? summary?.averageProgress ?? null;

    if (summaryValue !== null && summaryValue !== undefined) {
      return normalizeMastery(summaryValue) || 0;
    }

    return getClassAverageMastery(students);
  }, [summary, students]);

  const topicData = useMemo(() => {
    const categoryMap = {};

    students.forEach((item) => {
      Object.entries(item.categoryMastery || {}).forEach(([category, value]) => {
        const masteryValue = normalizeMastery(value);
        if (masteryValue === null) return;

        if (!categoryMap[category]) {
          categoryMap[category] = [];
        }

        categoryMap[category].push(masteryValue);
      });
    });

    return Object.entries(categoryMap).map(([title, values]) => {
      const average =
        values.reduce((sum, value) => sum + value, 0) / values.length;

      return {
        title,
        desc: "Rata-rata tingkat kemahiran siswa pada kategori ini",
        value: Math.round(average),
      };
    });
  }, [students]);

  const strengthTopics = topicData.filter((item) => item.value >= 70);
  const weakTopics = topicData.filter((item) => item.value < 70);

  const handleDeleteClass = async () => {
    try {
      setDeleting(true);
      setError("");

      await api.delete(`/classes/${classId}`);
      navigate("/teacher/classes");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menghapus kelas");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <HeaderSkeleton onBack={() => navigate("/teacher/classes")} />
        <div className="mt-[18px]">
          <PageState type="loading" title="Memuat detail kelas..." />
        </div>
      </PageLayout>
    );
  }

  if (error && !classData) {
    return (
      <PageLayout>
        <HeaderSkeleton onBack={() => navigate("/teacher/classes")} />
        <div className="mt-[18px]">
          <PageState
            type="error"
            title="Gagal memuat detail kelas"
            message={error}
            action={
              <button
                onClick={fetchClassAnalytics}
                className="rounded-[8px] bg-[#651DFF] px-[16px] py-[8px] text-[13px] font-bold text-white"
              >
                Coba Lagi
              </button>
            }
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <AppPageShell role="teacher">
        <header>
          <div className="flex items-start justify-between gap-[14px]">
            <div className="flex min-w-0 items-start gap-[12px]">
              <button
                onClick={() => navigate("/teacher/classes")}
                className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] bg-white text-[#6B7280] shadow-sm transition hover:scale-105 active:scale-95"
              >
                <ArrowLeft size={23} />
              </button>

              <div className="min-w-0">
                <h1 className="truncate text-[26px] font-bold leading-none tracking-[-0.04em] text-black lg:text-[32px] lg:font-extrabold">
                  {classData?.className || "Class Detail"}
                </h1>

                <p className="mt-[8px] text-[15px] font-medium text-[#6B7280]">
                  {classData?.totalStudents || 0} siswa
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
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

        <div className="mt-[20px] lg:grid lg:grid-cols-[360px_1fr] lg:items-start lg:gap-[22px]">
          <aside className="lg:sticky lg:top-[32px]">
            <section className="rounded-[22px] border border-[#E4D3FF] bg-gradient-to-br from-[#F8F2FF] to-white px-[18px] py-[18px] shadow-[0_10px_26px_rgba(101,29,255,0.08)] lg:rounded-[24px] lg:px-[20px] lg:py-[20px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-bold text-[#651DFF]">
                    Kode Kelas
                  </p>

                  <h2 className="mt-[4px] text-[22px] font-bold text-[#101348]">
                    {classData?.classCode || "-"}
                  </h2>
                </div>
              </div>

              <div className="mt-[16px] h-[8px] overflow-hidden rounded-full bg-[#D9D9D9]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#981DFF] to-[#5A16E8] transition-all duration-700"
                  style={{ width: `${averageMastery}%` }}
                />
              </div>

              <p className="mt-[9px] text-[12px] font-medium text-[#6B7280]">
                Rata-rata kemahiran kelas:{" "}
                <span className="font-bold text-[#101348]">
                  {averageMastery}%
                </span>
              </p>
            </section>

            <div className="mt-[16px] grid grid-cols-2 rounded-[16px] bg-[#F8F9FB] p-[4px]">
              <TabButton
                active={tab === "overview"}
                onClick={() => setTab("overview")}
              >
                Ringkasan
              </TabButton>

              <TabButton
                active={tab === "students"}
                onClick={() => setTab("students")}
              >
                Daftar Siswa
              </TabButton>
            </div>
          </aside>

          <section className="mt-[18px] lg:mt-0">
            {tab === "overview" ? (
              <OverviewTab
                summary={summary}
                averageMastery={averageMastery}
                strengthTopics={strengthTopics}
                weakTopics={weakTopics}
              />
            ) : (
              <StudentListTab students={students} />
            )}
          </section>
        </div>
      </AppPageShell>

      <TeacherDesktopNav />
      <TeacherBottomNav />

      {showDeleteModal && (
        <DeleteClassModal
          className={classData?.className}
          deleting={deleting}
          onCancel={() => setShowDeleteModal(false)}
          onDelete={handleDeleteClass}
        />
      )}
    </>
  );
};

const PageLayout = ({ children }) => {
  return (
    <>
      <AppPageShell role="teacher">{children}</AppPageShell>
      <TeacherDesktopNav />
      <TeacherBottomNav />
    </>
  );
};

const HeaderSkeleton = ({ onBack }) => {
  return (
    <div className="flex items-center gap-[12px]">
      <button
        onClick={onBack}
        className="flex h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-white text-[#6B7280] shadow-sm"
      >
        <ArrowLeft size={24} />
      </button>

      <h1 className="text-[26px] font-bold tracking-[-0.04em] text-black lg:text-[32px] lg:font-extrabold">
        Detail Kelas
      </h1>
    </div>
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

const OverviewTab = ({ summary, averageMastery, strengthTopics, weakTopics }) => {
  return (
    <div className="space-y-[17px]">
      <section className="rounded-[22px] border border-[#E5E7EB] bg-white px-[18px] py-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] lg:rounded-[24px] lg:px-[20px] lg:py-[20px]">
        <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black lg:text-[24px]">
          Rangkuman kelas
        </h2>

        <div className="mt-[16px] grid grid-cols-2 gap-[9px] lg:gap-[12px]">
          <SummaryBox
            icon={<BarChart3 size={27} />}
            value={`${averageMastery}%`}
            label="Rata-rata Kemahiran"
            bg="bg-[#E8F8EE]"
            color="text-[#16B966]"
          />

          <SummaryBox
            icon={<Target size={27} />}
            value={`${summary?.lowRiskStudents || 0}`}
            label="Aman"
            bg="bg-[#F3E8FF]"
            color="text-[#651DFF]"
          />

          <SummaryBox
            icon={<TriangleAlert size={27} />}
            value={`${summary?.hardRiskStudents || 0}`}
            label="Butuh Intervensi"
            bg="bg-[#FFF1E3]"
            color="text-[#FF9A1F]"
          />

          <SummaryBox
            icon={<FileText size={27} />}
            value={`${summary?.mediumRiskStudents || 0}`}
            label="Butuh Pendampingan"
            bg="bg-[#EAF2FF]"
            color="text-[#2478FF]"
          />
        </div>
      </section>

      <TopicSection
        title="Topik kekuatan"
        emptyTitle="Belum ada topik kekuatan"
        emptyMessage="Data akan muncul setelah siswa menyelesaikan quiz dan AI prediction."
        topics={strengthTopics}
      />

      <TopicSection
        title="Topik yang perlu ditingkatkan"
        emptyTitle="Belum ada topik lemah"
        emptyMessage="Data akan muncul setelah siswa mengerjakan quiz."
        topics={weakTopics}
      />
    </div>
  );
};

const TopicSection = ({ title, emptyTitle, emptyMessage, topics }) => {
  return (
    <section className="rounded-[22px] border border-[#E5E7EB] bg-white px-[18px] py-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] lg:rounded-[24px] lg:px-[20px]">
      <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black lg:text-[24px]">
        {title}
      </h2>

      <div className="mt-[16px] space-y-[12px]">
        {topics.length === 0 ? (
          <PageState type="empty" title={emptyTitle} message={emptyMessage} />
        ) : (
          topics.map((item) => <TopicCard key={item.title} item={item} />)
        )}
      </div>
    </section>
  );
};

const StudentListTab = ({ students }) => {
  const navigate = useNavigate();

  return (
    <section className="rounded-[22px] border border-[#E5E7EB] bg-white px-[18px] py-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] lg:rounded-[24px] lg:px-[20px]">
      <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black lg:text-[24px]">
        Semua siswa
      </h2>

      <div className="mt-[16px] space-y-[10px]">
        {students.length === 0 ? (
          <PageState
            type="empty"
            title="Belum ada siswa"
            message="Bagikan kode kelas agar siswa bisa bergabung."
          />
        ) : (
          students.map((item, index) => (
            <StudentItem
              key={item.student.id}
              rank={index + 1}
              item={item}
              onClick={() => navigate(`/teacher/students/${item.student.id}`)}
            />
          ))
        )}
      </div>
    </section>
  );
};

const SummaryBox = ({ icon, value, label, bg, color }) => {
  return (
    <div className="flex min-h-[86px] items-center rounded-[16px] border border-[#E5E7EB] bg-white px-[13px] transition hover:-translate-y-[2px] hover:shadow-[0_10px_22px_rgba(0,0,0,0.06)]">
      <div
        className={`flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[12px] ${bg} ${color}`}
      >
        {icon}
      </div>

      <div className="ml-[11px] min-w-0">
        <p className="text-[23px] font-bold leading-none text-black">
          {value}
        </p>

        <p className="mt-[4px] text-[10px] font-medium leading-[1.1] text-[#6B7280] lg:text-[11px]">
          {label}
        </p>
      </div>
    </div>
  );
};

const TopicCard = ({ item }) => {
  const barColor =
    item.value < 50
      ? "bg-[#FF6B1A]"
      : item.value < 70
      ? "bg-[#F9B700]"
      : "bg-[#16B966]";

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
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${item.value}%` }}
        />
      </div>
    </div>
  );
};

const StudentItem = ({ item, rank, onClick }) => {
  const student = item.student;
  const stats = item.statistics || {};
  const riskLevel = item.riskLevel || "Unknown";
  const mastery = getStudentAverageMastery(item.categoryMastery || {}) || 0;

  const riskLabelMap = {
    Low: "Aman",
    Medium: "Butuh Pendampingan",
    Hard: "Butuh Intervensi",
    Unknown: "Tidak Diketahui",
  };

  const riskStyle = {
    Low: "bg-[#DFFBEA] text-[#0FA85D]",
    Medium: "bg-[#FFF1D6] text-[#D88B00]",
    Hard: "bg-[#FFE1E1] text-[#EF4444]",
    Unknown: "bg-[#F3F4F6] text-[#6B7280]",
  };

  const masteryColor =
    mastery < 50
      ? "text-[#EF4444]"
      : mastery < 70
      ? "text-[#D88B00]"
      : "text-[#16B966]";

  return (
    <button
      onClick={onClick}
      className="group flex min-h-[74px] w-full items-center rounded-[16px] border border-[#E5E7EB] bg-white px-[14px] text-left transition hover:-translate-y-[2px] hover:border-[#D7C4FF] hover:shadow-[0_10px_24px_rgba(101,29,255,0.08)] active:scale-[0.99]"
    >
      <p className="w-[28px] shrink-0 text-[16px] font-bold text-black">
        {rank}
      </p>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[16px] font-bold leading-none text-black">
          {student.fullName}
        </h3>

        <div className="mt-[7px] flex flex-wrap gap-x-[14px] gap-y-[4px] text-[12px] font-medium text-[#6B7280]">
          <p>
            Kemahiran{" "}
            <span className={`font-bold ${masteryColor}`}>{mastery}%</span>
          </p>

          <p>
            Quiz selesai{" "}
            <span className="font-bold text-[#651DFF]">
              {stats.completedQuizzes || 0}
            </span>
          </p>
        </div>
      </div>

      <div className="ml-[8px] flex shrink-0 items-center gap-[6px]">
        <span
          className={`rounded-[8px] px-[9px] py-[6px] text-[11px] font-bold ${
            riskStyle[riskLevel] || riskStyle.Unknown
          }`}
        >
          {riskLabelMap[riskLevel] || riskLabelMap.Unknown}
        </span>

        <ChevronRight
          size={21}
          className="hidden text-[#6B7280] transition group-hover:translate-x-[3px] group-hover:text-[#651DFF] sm:block"
        />
      </div>
    </button>
  );
};

const DeleteClassModal = ({ className, deleting, onCancel, onDelete }) => {
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
          Hapus kelas?
        </h2>

        <p className="mt-[8px] text-[13px] font-medium leading-[1.45] text-[#6B7280]">
          Kelas <span className="font-bold text-black">{className}</span> akan
          dihapus dari daftar monitoring teacher.
        </p>

        <div className="mt-[22px] grid grid-cols-2 gap-[12px]">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="h-[38px] rounded-[10px] border border-[#E5E7EB] text-[13px] font-bold text-black disabled:opacity-60"
          >
            Batal
          </button>

          <button
            onClick={onDelete}
            disabled={deleting}
            className="h-[38px] rounded-[10px] bg-red-600 text-[13px] font-bold text-white disabled:opacity-60"
          >
            {deleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherClassDetailPage;