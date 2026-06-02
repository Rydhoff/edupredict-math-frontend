import { useMemo, useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../../services/api";
import PageState from "../../components/ui/PageState";
import StudentBottomNav from "../../components/student/StudentBottomNav";
import QuizListItem from "../../components/student/QuizListItem";
import { quizCategories, quizLibrary } from "../../data/quizData";
import mascot from "../../assets/images/mascot-dashboard.png";

const categoryMap = {
  campuran: "Campuran Soal",
  statistika: "Statistika",
  geometri: "Geometri",
  pengukuran: "Pengukuran",
  bilangan: "Bilangan",
  rasio: "Rasio",
  aljabar: "Aljabar",
};

const QuizLibraryPage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const initialCategory = params.get("category") || "all";

  const [category, setCategory] = useState(initialCategory);
  const [level, setLevel] = useState("all");
  const [search, setSearch] = useState("");

  const [startingQuizId, setStartingQuizId] = useState(null);
  const [error, setError] = useState("");

  const filteredQuizzes = useMemo(() => {
    return quizLibrary.filter((quiz) => {
      const matchCategory =
        category === "all"
          ? true
          : quiz.category === category;

      const matchLevel = level === "all" || quiz.level.toLowerCase() === level;

      const matchSearch = quiz.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchCategory && matchLevel && matchSearch;
    });
  }, [category, level, search]);

  const handleCategory = (value) => {
    setCategory(value);
    setParams(value === "all" ? {} : { category: value });
  };

  const handleStartQuiz = async (quiz) => {
    try {
      setError("");
      setStartingQuizId(quiz.id);

      const apiCategory = categoryMap[quiz.category] || "Mixed";

      const { data } = await api.post("/quiz/start", {
        category: apiCategory,
        mode: "learning",
        limit: 10,
      });

      navigate(`/student/quiz/play?sessionId=${data.quizSessionId}`, {
        state: {
          quizSessionId: data.quizSessionId,
          questions: data.questions,
          category: apiCategory,
          title: quiz.title,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memulai quiz");
    } finally {
      setStartingQuizId(null);
    }
  };
  
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] bg-white px-[10px] pb-[108px] pt-[38px]">
        <button
          onClick={() => navigate("/student/quizzes")}
          className="ml-[2px] text-[#6B7280]"
        >
          <ArrowLeft size={23} />
        </button>

        <section className="mt-[20px] mb-[12px] flex h-[136px] items-center overflow-hidden rounded-[14px] border border-[#E4D3FF] bg-[#F7F0FF] px-[13px] shadow-[0_8px_22px_rgba(101,29,255,0.08)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(101,29,255,0.14)]">
          <img
            src={mascot}
            alt="Octa"
            className="h-[126px] w-[145px] object-contain transition duration-300 hover:scale-105"
          />

          <div className="ml-[8px]">
            <div className="mb-[10px] inline-flex rounded-[6px] bg-[#EFE1FF] px-[10px] py-[5px] text-[11px] font-bold text-[#8A19FF]">
              Hai, pejuang ilmu! 👋
            </div>

            <h2 className="text-[20px] font-bold leading-tight text-black">
              Siap kuis hari ini?
            </h2>

            <p className="mt-[4px] text-[12px] font-medium text-[#6B7280]">
              Latihan makin seru bareng Octa!
            </p>
          </div>
        </section>

        <section className="rounded-b-[13px] rounded-t-[10px] border border-[#E5E7EB] bg-white px-[13px] pb-[18px] pt-[17px]">
          <h1 className="text-[23px] font-bold leading-none tracking-[-0.04em] text-black">
            Library Quiz
          </h1>

          <p className="mt-[7px] text-[12px] font-medium text-[#6B7280]">
            Yuk pilih quiz untuk melatih kemampuanmu
          </p>

          <div className="relative mt-[15px] h-[40px] rounded-[10px] border border-[#E5E7EB] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus-within:border-[#651DFF] focus-within:shadow-[0_6px_18px_rgba(101,29,255,0.12)]">
            <Search
              size={18}
              className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#6B7280]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari quiz..."
              className="h-full w-full rounded-[7px] pl-[38px] pr-[12px] text-[13px] font-medium outline-none placeholder:text-[#8A8A92]"
            />
          </div>

          <div className="mt-[16px] flex gap-[11px]">
            <div className="relative">
            <select
              value={category}
              onChange={(e) => handleCategory(e.target.value)}
              className="h-[32px] w-[124px] rounded-[7px] appearance-none border border-[#E5D8FF] px-[10px] text-[12px] font-bold text-[#77777F] outline-none"
            >
              <option value="all">Semua Topik</option>
              {quizCategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
            <ChevronDown
                size={13}
                className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#77777F]"
              />
            </div>

            <div className="relative">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="h-[32px] w-[116px] appearance-none rounded-[7px] border border-[#E5E7EB] bg-white px-[12px] text-[12px] font-bold text-[#77777F] outline-none"
              >
                <option value="all">Semua Level</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="adaptive">Adaptive</option>
              </select>

              <SlidersHorizontal
                size={13}
                className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#77777F]"
              />
            </div>
          </div>

          {error && (
            <div className="mt-[14px]">
              <PageState
                type="error"
                title="Gagal memulai quiz"
                message={error}
              />
            </div>
          )}

          <p className="mt-[17px] text-[11px] font-medium text-[#77777F]">
            {filteredQuizzes.length} quiz tersedia
          </p>

          <div className="mt-[12px] space-y-[10px]">
            {filteredQuizzes.length === 0 ? (
              <PageState
                type="empty"
                title="Quiz tidak ditemukan"
                message="Coba ubah filter atau kata kunci pencarian."
              />
            ) : (
              filteredQuizzes.map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="animate-[fadeIn_.35s_ease-out]"
                    style={{
                      animationDelay: `${index * 60}ms`,
                    }}
                  >
                    <QuizListItem
                      key={quiz.id}
                      quiz={quiz}
                      loading={startingQuizId === quiz.id}
                      onStart={handleStartQuiz}
                    />
                  </div>
              ))
            )}
          </div>
        </section>
      </div>

      <StudentBottomNav />
    </main>
  );
};

export default QuizLibraryPage;