import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Target,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import PageState from "../../components/ui/PageState";
import TeacherBottomNav from "../../components/teacher/TeacherBottomNav";
import TeacherDesktopNav from "../../components/teacher/TeacherDesktopNav";
import useCachedFetch from "../../hooks/useCachedFetch";
import AppPageShell from "../../components/layout/AppPageShell";

const filters = [
  "Semua",
  "Aman",
  "Butuh Pendampingan",
  "Butuh Intervensi",
];
const cacheKey = "teacher_students";

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

  if (values.length === 0) return 0;

  const averageRaw =
    values.reduce((sum, value) => sum + value, 0) / values.length;

  return averageRaw <= 1
    ? Math.round(averageRaw * 100)
    : Math.round(averageRaw);
};

const TeacherStudentsPage = () => {
  const navigate = useNavigate();

  const [selectedClassId, setSelectedClassId] = useState("all");
  const [students, setStudents] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState("");

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

  const classes = dashboard?.classMonitoring || [];

  useEffect(() => {
    if (!loading && classes.length > 0 && selectedClassId === "all") {
      fetchAllStudents(classes, false);
    }

    if (!loading && classes.length === 0) {
      setStudents([]);
    }
  }, [loading, classes.length]);

  const fetchClassStudents = async (classId) => {
    try {
      setStudentsLoading(true);
      setStudentsError("");

      const { data } = await api.get(`/teacher/classes/${classId}/analytics`);

      const className =
        classes.find((item) => item.id === classId)?.className || "Kelas";

      const mappedStudents = (data.students || []).map((item) => ({
        ...item,
        classId,
        className,
      }));

      setStudents(mappedStudents);
    } catch (err) {
      setStudentsError(
        err.response?.data?.message || "Gagal memuat siswa kelas"
      );
    } finally {
      setStudentsLoading(false);
    }
  };

  const fetchAllStudents = async (classList = classes) => {
  try {

    sessionStorage.removeItem(cacheKey);
      setStudentsLoading(true);
      setStudentsError("");

      const results = await Promise.all(
        classList.map(async (classItem) => {
          const { data } = await api.get(
            `/teacher/classes/${classItem.id}/analytics`
          );

          return (data.students || []).map((item) => ({
            ...item,
            classId: classItem.id,
            className: classItem.className,
          }));
        })
      );

      const flatStudents = results.flat();
      const uniqueMap = new Map();

      flatStudents.forEach((item) => {
        const studentId = item.student?.id;

        if (!studentId) return;

        if (!uniqueMap.has(studentId)) {
          uniqueMap.set(studentId, {
            ...item,
            classNames: [item.className],
          });
        } else {
          const existing = uniqueMap.get(studentId);

          uniqueMap.set(studentId, {
            ...existing,
            classNames: [...new Set([...existing.classNames, item.className])],
          });
        }
      });

      const finalStudents = [...uniqueMap.values()];

      setStudents(finalStudents);
      sessionStorage.setItem(cacheKey, JSON.stringify(finalStudents));
    } catch (err) {
      setStudentsError(
        err.response?.data?.message || "Gagal memuat semua siswa"
      );
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleChangeClass = async (e) => {
    const classId = e.target.value;

    setSelectedClassId(classId);
    setSearch("");
    setActiveFilter("Semua");

    if (classId === "all") {
      await fetchAllStudents();
      return;
    }

    if (classId) {
      await fetchClassStudents(classId);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((item) => {
      const student = item.student || {};
      const riskLabelMap = {
        Low: "Aman",
        Medium: "Butuh Pendampingan",
        Hard: "Butuh Intervensi",
      };

      const riskLabel =
        riskLabelMap[item.riskLevel] || "Tidak Diketahui";

      const matchRisk = activeFilter === "Semua" || riskLabel === activeFilter;

      const keyword = search.toLowerCase();

      const matchSearch =
        student.fullName?.toLowerCase().includes(keyword) ||
        student.email?.toLowerCase().includes(keyword) ||
        item.className?.toLowerCase().includes(keyword) ||
        item.classNames?.join(" ")?.toLowerCase().includes(keyword);

      return matchRisk && matchSearch;
    });
  }, [students, activeFilter, search]);

  const totalStudents = students.length;

  const hardRiskCount = students.filter(
    (item) => item.riskLevel === "Hard"
  ).length;

  const averageMastery =
    students.length > 0
      ? Math.round(
          students.reduce(
            (sum, item) =>
              sum + getStudentAverageMastery(item.categoryMastery || {}),
            0
          ) / students.length
        )
      : 0;

  return (
    <>
      <AppPageShell>
        <header>
          <div className="flex items-start justify-between gap-[14px]">
            <div>
              <h1 className="text-[26px] font-bold leading-none tracking-[-0.04em] text-black lg:text-[32px] lg:font-extrabold">
                Siswa
              </h1>

              <p className="mt-[8px] text-[15px] font-medium text-[#6B7280]">
                Pantau tingkat kemahiran siswa dari semua kelas
              </p>
            </div>

            <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[14px] bg-[#F7F0FF] text-[#651DFF]">
              <Users size={22} />
            </div>
          </div>
        </header>

        <section className="mt-[20px] grid grid-cols-3 gap-[8px] lg:gap-[14px]">
          <MiniStatCard
            icon={<Users size={18} />}
            value={totalStudents}
            label="Total Siswa"
            color="text-[#651DFF]"
            bg="bg-[#F7F0FF]"
          />

          <MiniStatCard
            icon={<Target size={18} />}
            value={`${averageMastery}%`}
            label="Rata-rata Kemahiran"
            color="text-[#16B966]"
            bg="bg-[#E8F8EE]"
          />

          <MiniStatCard
            icon={<TriangleAlert size={18} />}
            value={hardRiskCount}
            label="Butuh Intervensi"
            color="text-[#EF4444]"
            bg="bg-[#FFE1E1]"
          />
        </section>

        <div className="mt-[18px] lg:grid lg:items-start lg:gap-[22px]">
          <aside className="mt-[18px] rounded-[22px] border border-[#E4D3FF] bg-gradient-to-br from-[#F8F2FF] to-white px-[18px] py-[18px] shadow-[0_10px_26px_rgba(101,29,255,0.08)] lg:sticky lg:top-[32px] lg:mt-0 lg:rounded-[24px]">
            <h2 className="text-[21px] font-bold tracking-[-0.04em] text-black">
              Filter Kelas
            </h2>

            <div className="relative mt-[16px]">
              <select
                value={selectedClassId}
                onChange={handleChangeClass}
                className="h-[44px] w-full appearance-none rounded-[14px] border border-[#E4D3FF] bg-white px-[14px] pr-[40px] text-[14px] font-bold text-[#101348] outline-none"
              >
                <option value="all">Semua Kelas</option>

                {classes.length === 0 ? (
                  <option value="" disabled>
                    Belum ada kelas
                  </option>
                ) : (
                  classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.className}
                    </option>
                  ))
                )}
              </select>

              <ChevronDown
                size={22}
                className="pointer-events-none absolute right-[13px] top-1/2 -translate-y-1/2 text-[#651DFF]"
              />
            </div>
          </aside>

          <section>
            <div className="relative h-[44px] rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_5px_18px_rgba(0,0,0,0.03)] transition focus-within:border-[#651DFF]">
              <Search
                size={20}
                className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#6B7280]"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari siswa, email, atau kelas..."
                className="h-full w-full rounded-[14px] pl-[43px] pr-[12px] text-[15px] font-medium outline-none placeholder:text-[#8A8A92]"
              />
            </div>

            <div className="mt-[13px] flex gap-[8px] overflow-x-auto pb-[3px] lg:flex-wrap lg:overflow-visible">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`h-[32px] shrink-0 rounded-full border px-[14px] text-[13px] font-bold transition duration-300 active:scale-95 ${
                    activeFilter === filter
                      ? "border-[#B88CFF] bg-[#F7F0FF] text-[#651DFF] shadow-[0_5px_14px_rgba(101,29,255,0.12)]"
                      : "border-[#E5E7EB] bg-white text-[#6B7280]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <section className="mt-[15px] rounded-[22px] border border-[#E5E7EB] bg-white px-[16px] py-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] lg:rounded-[24px] lg:px-[18px]">
              {loading || studentsLoading ? (
                <PageState type="loading" title="Memuat siswa..." />
              ) : error || studentsError ? (
                <PageState
                  type="error"
                  title="Gagal memuat siswa"
                  message={error || studentsError}
                  action={
                    <button
                      onClick={() => {
                        sessionStorage.removeItem(cacheKey);
                        fetchDashboard({ forceLoading: true });
                        fetchAllStudents(classes, true);
                      }}
                      className="rounded-[8px] bg-[#651DFF] px-[16px] py-[8px] text-[13px] font-bold text-white"
                    >
                      Coba Lagi
                    </button>
                  }
                />
              ) : classes.length === 0 ? (
                <PageState
                  type="empty"
                  title="Belum ada kelas"
                  message="Buat kelas terlebih dahulu untuk melihat daftar siswa."
                />
              ) : filteredStudents.length === 0 ? (
                <PageState
                  type="empty"
                  title="Siswa tidak ditemukan"
                  message={
                    search
                      ? "Tidak ada siswa yang cocok dengan pencarian."
                      : "Belum ada siswa pada filter ini."
                  }
                />
              ) : (
                <div className="grid gap-[10px] lg:grid-cols-2">
                  {filteredStudents.map((item, index) => (
                    <StudentItem
                      key={`${item.student.id}-${index}`}
                      rank={index + 1}
                      item={item}
                      onClick={() =>
                        navigate(`/teacher/students/${item.student.id}`)
                      }
                    />
                  ))}
                </div>
              )}
            </section>
          </section>
        </div>
      </AppPageShell>

      <TeacherDesktopNav />
      <TeacherBottomNav />
    </>
  );
};

const MiniStatCard = ({ icon, value, label, color, bg }) => {
  return (
    <div className="rounded-[14px] border border-[#E5E7EB] bg-white px-[8px] py-[12px] text-center shadow-[0_5px_18px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] lg:rounded-[18px] lg:py-[16px]">
      <div
        className={`mx-auto flex h-[28px] w-[28px] items-center justify-center rounded-[9px] ${bg} ${color} lg:h-[34px] lg:w-[34px] lg:rounded-[11px]`}
      >
        {icon}
      </div>

      <p className={`mt-[8px] text-[20px] font-bold leading-none ${color}`}>
        {value}
      </p>

      <p className="mt-[7px] text-[11px] font-medium leading-none text-[#6B7280]">
        {label}
      </p>
    </div>
  );
};

const StudentItem = ({ item, rank, onClick }) => {
  const student = item.student || {};
  const riskLevel = item.riskLevel || "Unknown";
  const mastery = getStudentAverageMastery(item.categoryMastery || {});

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

  const classText = item.classNames?.length
    ? item.classNames.join(", ")
    : item.className || "Kelas";

  return (
    <button
      onClick={onClick}
      className="group flex min-h-[76px] w-full items-center rounded-[16px] border border-[#E5E7EB] bg-white px-[14px] text-left transition hover:-translate-y-[2px] hover:border-[#D7C4FF] hover:shadow-[0_10px_24px_rgba(101,29,255,0.08)] active:scale-[0.99]"
    >
      <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#F7F0FF] text-[14px] font-bold text-[#651DFF]">
        {rank}
      </div>

      <div className="ml-[12px] min-w-0 flex-1">
        <div className="flex items-center gap-[7px]">
          <h3 className="truncate text-[15px] font-bold leading-tight text-black">
            {student.fullName}
          </h3>

          <span
            className={`shrink-0 rounded-[7px] px-[7px] py-[3px] text-[10px] font-bold ${
              riskStyle[riskLevel] || riskStyle.Unknown
            }`}
          >
            {riskLevel}
          </span>
        </div>

        <p className="mt-[3px] truncate text-[11px] font-medium leading-tight text-[#9CA3AF]">
          {classText}
        </p>

        <div className="mt-[3px] flex gap-[13px] text-[12px] font-medium leading-tight text-[#6B7280]">
          <p>
            Kemahiran{" "}
            <span className={`font-bold ${masteryColor}`}>{mastery}%</span>
          </p>
        </div>
      </div>

      <ChevronRight
        size={22}
        className="ml-[8px] shrink-0 text-[#6B7280] transition duration-300 group-hover:translate-x-[3px] group-hover:text-[#651DFF]"
      />
    </button>
  );
};

export default TeacherStudentsPage;