import { Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import api from "../../services/api";
import PageState from "../../components/ui/PageState";
import StudentBottomNav from "../../components/student/StudentBottomNav";
import QuizCategoryCard from "../../components/student/QuizCategoryCard";
import { quizCategories } from "../../data/quizData";
import useCachedFetch from "../../hooks/useCachedFetch";

const getProgressByCategory = (dashboard, categoryTitle) => {
  const key = categoryTitle === "Campuran Soal" ? "Healthy Mix" : categoryTitle;

  return dashboard?.categoryProgress?.[key]?.progress || 0;
};

const QuizzesPage = () => {
  const [search, setSearch] = useState("");

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

  const categories = useMemo(() => {
    return quizCategories.map((quiz) => ({
      ...quiz,
      progress: getProgressByCategory(dashboard, quiz.title),
    }));
  }, [dashboard]);

  const filteredCategories = useMemo(() => {
    const keyword = search.toLowerCase();

    return categories.filter((quiz) => {
      return (
        quiz.title.toLowerCase().includes(keyword) ||
        quiz.description.toLowerCase().includes(keyword)
      );
    });
  }, [categories, search]);

  const averageProgress =
    categories.length > 0
      ? Math.round(
          categories.reduce((sum, item) => sum + (item.progress || 0), 0) /
            categories.length
        )
      : 0;

  if (loading) {
    return (
      <PageLayout>
        <PageState type="loading" title="Memuat quiz..." />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <PageState
          type="error"
          title="Gagal memuat quiz"
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
      </PageLayout>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] px-[16px] pb-[104px] pt-[49px]">
        <header>
          <h1 className="text-[26px] font-bold leading-none tracking-[-0.04em] text-black">
            Quizzes
          </h1>

          <p className="mt-[8px] text-[15px] font-medium text-[#6B7280]">
            Pilih quiz dan mulai tantanganmu hari ini!
          </p>
        </header>

        <div className="relative mt-[16px] h-[42px] rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_5px_18px_rgba(0,0,0,0.03)] focus-within:border-[#651DFF]">
          <Search
            size={20}
            className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#6B7280]"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari topik quiz..."
            className="h-full w-full rounded-[12px] pl-[43px] pr-[12px] text-[15px] font-medium outline-none placeholder:text-[#8A8A92]"
          />
        </div>

        <p className="mt-[13px] text-[12px] font-medium text-[#6B7280]">
          {filteredCategories.length} topik tersedia
        </p>

        <div className="mt-[14px] space-y-[16px]">
          {filteredCategories.length === 0 ? (
            <PageState
              type="empty"
              title="Topik tidak ditemukan"
              message="Coba gunakan kata kunci lain."
            />
          ) : (
            filteredCategories.map((quiz) => (
              <div
                key={quiz.id}
                className="transition duration-300 hover:-translate-y-[2px]"
              >
                <QuizCategoryCard quiz={quiz} />
              </div>
            ))
          )}
        </div>
      </div>

      <StudentBottomNav />
    </main>
  );
};

const PageLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] px-[16px] pb-[104px] pt-[49px]">
        {children}
      </div>

      <StudentBottomNav />
    </main>
  );
};

export default QuizzesPage;