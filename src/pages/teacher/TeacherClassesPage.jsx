import {
  ChevronRight,
  Copy,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import TeacherBottomNav from "../../components/teacher/TeacherBottomNav";
import TeacherDesktopNav from "../../components/teacher/TeacherDesktopNav";
import CreateClassModal from "../../components/teacher/CreateClassModal";
import PageState from "../../components/ui/PageState";

import mascotSmall from "../../assets/images/mascot-small.png";
import useCachedFetch from "../../hooks/useCachedFetch";
import { clearTeacherCache } from "../../utils/cache";

const TeacherClassesPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");

  const {
    data: dashboard,
    loading,
    error,
    refetch: fetchClasses,
  } = useCachedFetch({
    cacheKey: "teacher_dashboard",
    fetcher: async () => {
      const { data } = await api.get("/teacher/dashboard");
      return data.dashboard;
    },
  });

  const classes = useMemo(() => {
    return (dashboard?.classMonitoring || []).map((item) => ({
      id: item.id,
      name: item.className,
      code: item.classCode,
      students: item.totalStudents || 0,
      progress: item.averageProgress || 0,
    }));
  }, [dashboard]);

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword)
      );
    });
  }, [search, classes]);

  const handleCreateSuccess = () => {
    clearTeacherCache();
    setShowCreateModal(false);
    fetchClasses({ forceLoading: true });
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 1500);
    } catch {
      setCopiedCode("");
    }
  };

  const totalStudents = classes.reduce((sum, item) => sum + item.students, 0);

  const averageProgress =
    classes.length > 0
      ? Math.round(
          classes.reduce((sum, item) => sum + (item.progress || 0), 0) /
            classes.length
        )
      : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] px-[14px] pb-[104px] pt-[49px] lg:ml-[304px] lg:max-w-[1100px] lg:px-[32px] lg:pb-[44px]">
        <header className="flex items-start justify-between gap-[14px]">
          <div>
            <h1 className="text-[26px] font-bold leading-none tracking-[-0.04em] text-black lg:text-[32px] lg:font-extrabold">
              Classes
            </h1>

            <p className="mt-[8px] text-[15px] font-medium text-[#6B7280]">
              Kelola kelas dan kode join siswa
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="group flex h-[40px] shrink-0 items-center gap-[7px] rounded-[12px] bg-gradient-to-r from-[#981DFF] to-[#5A16E8] px-[14px] text-[14px] font-bold text-white shadow-[0_10px_22px_rgba(108,33,255,0.25)] transition duration-300 hover:scale-[1.03] active:scale-[0.98] lg:h-[44px] lg:px-[18px]"
          >
            <Plus
              size={18}
              strokeWidth={3}
              className="transition duration-300 group-hover:rotate-90"
            />
            Tambah
          </button>
        </header>

        <section className="mt-[22px] grid grid-cols-3 gap-[8px] lg:gap-[14px]">
          <MiniStatCard
            value={classes.length}
            label="Total Kelas"
            color="text-[#651DFF]"
          />
          <MiniStatCard
            value={totalStudents}
            label="Total Siswa"
            color="text-[#16B966]"
          />
          <MiniStatCard
            value={`${averageProgress}%`}
            label="Avg Progress"
            color="text-[#F59E0B]"
          />
        </section>

        <div className="mt-[18px] lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-[22px]">
          <div>
            <div className="relative h-[44px] rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_5px_18px_rgba(0,0,0,0.03)] transition focus-within:border-[#651DFF]">
              <Search
                size={20}
                className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#6B7280]"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kelas atau kode..."
                className="h-full w-full rounded-[14px] pl-[43px] pr-[12px] text-[15px] font-medium outline-none placeholder:text-[#8A8A92]"
              />
            </div>

            <section className="mt-[17px]">
              {loading ? (
                <PageState type="loading" title="Memuat kelas..." />
              ) : error ? (
                <PageState
                  type="error"
                  title="Gagal memuat kelas"
                  message={error}
                  action={
                    <button
                      onClick={() => fetchClasses({ forceLoading: true })}
                      className="rounded-[8px] bg-[#651DFF] px-[16px] py-[8px] text-[13px] font-bold text-white"
                    >
                      Coba Lagi
                    </button>
                  }
                />
              ) : filteredClasses.length === 0 ? (
                <PageState
                  type="empty"
                  title={search ? "Kelas tidak ditemukan" : "Belum ada kelas"}
                  message={
                    search
                      ? "Coba gunakan kata kunci atau kode kelas lain."
                      : "Buat kelas pertama untuk mulai monitoring siswa."
                  }
                  action={
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="rounded-[10px] bg-[#651DFF] px-[16px] py-[9px] text-[13px] font-bold text-white"
                    >
                      + Tambah Kelas
                    </button>
                  }
                />
              ) : (
                <div className="grid gap-[12px] lg:grid-cols-2">
                  {filteredClasses.map((item) => (
                    <ClassCard
                      key={item.id || item.code}
                      item={item}
                      copiedCode={copiedCode}
                      onCopy={() => handleCopyCode(item.code)}
                      onClick={() => navigate(`/teacher/classes/${item.id}`)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          <section className="mt-[17px] flex min-h-[150px] items-center overflow-hidden rounded-[22px] border border-[#E4D3FF] bg-gradient-to-br from-[#F8F2FF] to-white px-[16px] shadow-[0_10px_26px_rgba(101,29,255,0.08)] lg:sticky lg:top-[32px] lg:mt-0 lg:min-h-[260px] lg:flex-col lg:items-start lg:justify-between lg:px-[22px] lg:py-[22px]">
            <div className="flex items-center lg:w-full lg:flex-col lg:items-start">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#EEE4FF] blur-[10px]" />

                <img
                  src={mascotSmall}
                  alt="Octa"
                  className="relative ml-[-3px] h-[100px] w-[100px] object-contain transition duration-300 hover:scale-105 lg:ml-0 lg:h-[120px] lg:w-[120px]"
                />
              </div>

              <div className="ml-[13px] flex-1 lg:ml-0 lg:mt-[14px]">
                <h2 className="text-[18px] font-bold leading-none text-[#5A16E8] lg:text-[22px]">
                  Cara siswa bergabung
                </h2>

                <p className="mt-[7px] text-[13px] font-medium leading-[1.35] text-black lg:text-[14px]">
                  Bagikan kode kelas agar siswa bisa join dan mulai belajar.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                classes[0]?.code ? handleCopyCode(classes[0].code) : null
              }
              className="mt-[10px] hidden h-[38px] w-full items-center justify-between rounded-[12px] border border-[#E5E7EB] bg-white px-[12px] transition duration-300 hover:border-[#D7C4FF] hover:bg-[#FCFAFF] lg:flex"
            >
              <p className="truncate text-[13px] font-bold text-black">
                {classes[0]?.code || "Contoh: EP7K9M"}
              </p>

              <Copy size={17} className="text-[#651DFF]" />
            </button>
          </section>
        </div>
      </div>

      <TeacherDesktopNav />
      <TeacherBottomNav />

      {showCreateModal && (
        <CreateClassModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </main>
  );
};

const MiniStatCard = ({ value, label, color }) => {
  return (
    <div className="rounded-[14px] border border-[#E5E7EB] bg-white px-[8px] py-[12px] text-center shadow-[0_5px_18px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] lg:rounded-[18px] lg:py-[16px]">
      <p className={`text-[20px] font-bold leading-none ${color} lg:text-[25px]`}>
        {value}
      </p>

      <p className="mt-[7px] text-[11px] font-medium leading-none text-[#6B7280] lg:text-[12px]">
        {label}
      </p>
    </div>
  );
};

const ClassCard = ({ item, onClick, onCopy, copiedCode }) => {
  const progress = Math.min(item.progress || 0, 100);

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-[18px] border border-[#E5E7EB] bg-white px-[18px] py-[15px] text-left shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:border-[#D7C4FF] hover:shadow-[0_12px_28px_rgba(101,29,255,0.08)] active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-[12px]">
        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-bold leading-none text-[#101348]">
            {item.name}
          </h3>

          <div className="mt-[9px] flex items-center gap-[7px]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCopy();
              }}
              className="flex max-w-[170px] items-center gap-[6px] rounded-[8px] bg-[#F7F0FF] px-[9px] py-[5px] text-[11px] font-bold text-[#651DFF]"
            >
              <Copy size={13} />

              <span className="truncate">
                {copiedCode === item.code ? "Copied!" : item.code}
              </span>
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-[5px] rounded-full bg-[#F8F9FB] px-[9px] py-[5px] text-[12px] font-bold text-[#101348]">
          <Users size={14} />
          {item.students}
        </div>
      </div>

      <div className="mt-[15px] flex items-center justify-between">
        <p className="text-[12px] font-medium text-[#6B7280]">
          Rata-rata progress
        </p>

        <p className="text-[15px] font-bold text-[#101348]">{progress}%</p>
      </div>

      <div className="mt-[7px] h-[7px] overflow-hidden rounded-full bg-[#D9D9D9]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#18C964] to-[#46E28A] transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-[13px] flex items-center justify-between">
        <p className="text-[11px] font-medium text-[#9CA3AF]">
          Klik untuk detail monitoring
        </p>

        <ChevronRight
          size={22}
          className="text-[#6B7280] transition duration-300 group-hover:translate-x-[3px] group-hover:text-[#651DFF]"
        />
      </div>
    </button>
  );
};

export default TeacherClassesPage;