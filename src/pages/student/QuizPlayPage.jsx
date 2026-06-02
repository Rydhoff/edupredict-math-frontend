import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flag,
  Sparkles,
  Timer,
  X,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import api from "../../services/api";
import PageState from "../../components/ui/PageState";
import { clearStudentCache } from "../../utils/cache";

const formatQuizTime = (ms = 0) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

const formatAIHtml = (html = "") => {
  let formatted = html
    .replace(/\\n/g, "<br/>")
    .replace(/\n/g, "<br/>")
    .replace(/<br\s*\/?>/gi, "<br/>")
    .trim();

  // Hanya format angka list jika muncul berurutan dari 1.
  const hasOrderedSteps = /(^|<br\/>|\s)1\.\s/i.test(formatted);

  if (hasOrderedSteps) {
    formatted = formatted.replace(
      /(^|<br\/>|\s)([1-9]\d*)\.\s/g,
      "<br/><br/><strong>$2. </strong>"
    );
  }

  return formatted.replace(/^(<br\/>)+/, "").trim();
};

const QuizPlayPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const category = params.get("category") || "Mixed";

  const [quizSessionId, setQuizSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [answeredMap, setAnsweredMap] = useState({});

  const [showAI, setShowAI] = useState(false);
  const [aiIntervention, setAiIntervention] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [startedAt, setStartedAt] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length || 0;
  const questionNumber = currentIndex + 1;

  const resetQuestionTimer = () => {
    setStartedAt(Date.now());
    setElapsedTime(0);
  };

  const startQuiz = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.post("/quiz/start", {
        category,
        mode: "learning",
        limit: 10,
      });

      setQuizSessionId(data.quizSessionId);
      setQuestions(data.questions || []);
      resetQuestionTimer();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memulai quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.quizSessionId && location.state?.questions) {
      setQuizSessionId(location.state.quizSessionId);
      setQuestions(location.state.questions);
      resetQuestionTimer();
      setLoading(false);
      return;
    }

    startQuiz();
  }, []);

  useEffect(() => {
    if (!currentQuestion || answerStatus || showAI || loading) return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startedAt);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, startedAt, answerStatus, showAI, loading]);

  const syncQuestionState = (index) => {
    const question = questions[index];

    if (!question) return;

    const savedAnswer = answeredMap[question.id];

    if (savedAnswer) {
      setSelectedAnswer(savedAnswer.selectedAnswer);
      setAnswerStatus(savedAnswer.isCorrect ? "correct" : "wrong");
      setCorrectAnswer(savedAnswer.correctAnswer);
      setElapsedTime(savedAnswer.responseTime || 0);
    } else {
      setSelectedAnswer(null);
      setAnswerStatus(null);
      setCorrectAnswer(null);
      resetQuestionTimer();
    }
  };

  const handleSelect = async (index) => {
    if (answerStatus || submitting || answeredMap[currentQuestion?.id]) return;

    const responseTime = Date.now() - startedAt;

    setSelectedAnswer(index);
    setSubmitting(true);
    setError("");
    setElapsedTime(responseTime);

    try {
      const { data } = await api.post("/quiz/submit-answer", {
        quizSessionId,
        questionId: currentQuestion.id,
        selectedAnswer: index,
        responseTime,
      });

      const savedAnswer = {
        selectedAnswer: index,
        isCorrect: data.isCorrect,
        correctAnswer: data.correctAnswer,
        aiIntervention: data.aiIntervention || null,
        responseTime,
      };

      setAnswerStatus(data.isCorrect ? "correct" : "wrong");
      setCorrectAnswer(data.correctAnswer);

      setAnsweredMap((prev) => ({
        ...prev,
        [currentQuestion.id]: savedAnswer,
      }));

      if (data.aiIntervention) {
        setAiIntervention(data.aiIntervention);
        setShowAI(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengirim jawaban");
      setSelectedAnswer(null);
      setElapsedTime(Date.now() - startedAt);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (showAI) {
      setShowAI(false);
      setAiIntervention(null);
    }

    if (currentIndex + 1 >= questions.length) {
      finishQuiz();
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    setTimeout(() => {
      syncQuestionState(nextIndex);
    }, 0);
  };

  const handlePrevious = () => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(prevIndex);

    setTimeout(() => {
      syncQuestionState(prevIndex);
    }, 0);
  };

  const finishQuiz = async () => {
    try {
      setLoading(true);

      const { data } = await api.post("/quiz/finish", {
        quizSessionId,
      });

      clearStudentCache();

      navigate("/student/quiz/result", {
        state: {
          ...data.result,
          category,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyelesaikan quiz");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <PageState type="loading" title="Memuat quiz..." />
      </PageLayout>
    );
  }

  if (error && !currentQuestion) {
    return (
      <PageLayout>
        <PageState
          type="error"
          title="Gagal memuat quiz"
          message={error}
          action={
            <button
              onClick={startQuiz}
              className="rounded-[8px] bg-[#651DFF] px-[16px] py-[8px] text-[13px] font-bold text-white"
            >
              Coba Lagi
            </button>
          }
        />
      </PageLayout>
    );
  }

  if (!currentQuestion) {
    return (
      <PageLayout>
        <PageState
          type="empty"
          title="Quiz tidak tersedia"
          message="Belum ada soal untuk quiz ini."
        />
      </PageLayout>
    );
  }

  if (showAI) {
    return (
      <PageLayout>
        <TopQuizBar
          elapsedTime={elapsedTime}
          onClose={() => navigate("/student/quizzes")}
        />

        <section className="mt-[70px] rounded-[18px] border border-[#ECECEC] bg-white px-[27px] py-[28px]">
          <div className="flex items-center gap-[10px]">
            <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[8px] bg-[#F3E8FF] text-[#6D22F3]">
              <Sparkles size={20} />
            </div>

            <h1 className="text-[21px] font-bold tracking-[-0.03em] text-black">
              AI Intervention
            </h1>
          </div>

          <p className="mt-[25px] text-[14px] font-medium text-[#6B7280]">
            Konsep yang kamu temui:
          </p>

          <span className="mt-[8px] inline-flex rounded-[8px] bg-[#F4EAFE] px-[11px] py-[5px] text-[13px] font-bold text-[#651DFF]">
            {aiIntervention?.concept || currentQuestion.category || "Matematika"}
          </span>

          <p className="mt-[22px] text-[14px] font-medium text-[#6B7280]">
            Penjelasan untuk kamu
          </p>

          <div className="mt-[8px] rounded-[8px] border border-[#E4D3FF] bg-[#FCFAFF] px-[16px] py-[14px]">
            <div
              className="
                text-[14px]
                font-medium
                leading-[1.8]
                text-black
                [&_em]:not-italic
                [&_em]:text-black
                [&_strong]:font-bold
                [&_strong]:text-black
                [&_b]:font-bold
                [&_br]:block
              "
              dangerouslySetInnerHTML={{
                __html: formatAIHtml(
                  aiIntervention?.explanation ||
                    "AI belum memberikan penjelasan detail untuk soal ini."
                ),
              }}
            />
          </div>
        </section>

        <button
          onClick={handleNext}
          className="mt-[19px] flex h-[52px] w-full items-center justify-center gap-[10px] rounded-[8px] border-2 border-[#00B8FF] bg-gradient-to-r from-[#7B2CFF] to-[#4F1DE8] text-[16px] font-bold text-white"
        >
          Lanjut ke Soal
          <ArrowRight size={23} />
        </button>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <TopQuizBar
        elapsedTime={elapsedTime}
        onClose={() => navigate("/student/quizzes")}
      />

      {error && (
        <div className="mt-[18px] rounded-[8px] bg-red-50 px-[12px] py-[9px] text-[12px] font-medium text-red-600">
          {error}
        </div>
      )}

      <section className="mt-[70px] rounded-[18px] border border-[#ECECEC] bg-white px-[24px] py-[22px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(101,29,255,0.10)]">
        <div className="flex justify-center">
          <span className="rounded-[8px] bg-[#F6EFFF] px-[16px] py-[6px] text-[13px] font-bold text-[#651DFF]">
            Pertanyaan {questionNumber} dari {totalQuestions}
          </span>
        </div>

        <h1 className="mt-[30px] text-[21px] font-bold leading-[1.45] tracking-[-0.03em] text-black">
          {currentQuestion.question}
        </h1>

        <div className="mt-[25px] space-y-[10px]">
          {currentQuestion.choices.map((choice, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = answerStatus && index === correctAnswer;
            const isWrong = answerStatus === "wrong" && isSelected;

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={submitting || Boolean(answeredMap[currentQuestion.id])}
                className={`relative flex min-h-[44px] w-full items-center rounded-[8px] border px-[13px] py-[10px] text-left transition duration-300 hover:scale-[1.01] hover:shadow-[0_6px_14px_rgba(0,0,0,0.05)] active:scale-[0.99] disabled:opacity-70 ${
                  isCorrect
                    ? "border-[#641BFF] bg-[#F7F0FF]"
                    : isWrong
                    ? "border-[#EF0000] bg-[#FFF1F1]"
                    : isSelected
                    ? "border-[#641BFF] bg-[#F7F0FF]"
                    : "border-[#E5E7EB] bg-white"
                }`}
              >
                <span
                  className={`flex h-[24px] w-[24px] items-center justify-center rounded-full border text-[13px] font-bold ${
                    isWrong
                      ? "border-[#D90000] bg-[#D90000] text-white"
                      : isCorrect || isSelected
                      ? "border-[#641BFF] bg-[#641BFF] text-white"
                      : "border-[#D1D5DB] bg-white text-black"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="ml-[11px] text-[15px] font-medium text-black">
                  {choice}
                </span>

                {isCorrect && (
                  <span className="absolute right-[13px] flex h-[24px] w-[24px] items-center justify-center rounded-full border-2 border-[#22C55E] text-[#22C55E]">
                    <Check size={17} strokeWidth={3} />
                  </span>
                )}

                {isWrong && (
                  <span className="absolute right-[13px] flex h-[24px] w-[24px] items-center justify-center rounded-full border-2 border-[#EF0000] text-[#EF0000]">
                    <X size={17} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-[28px] flex items-center justify-between px-[8px]">
        <button
          disabled={currentIndex === 0}
          onClick={handlePrevious}
          className="flex h-[39px] items-center gap-[6px] rounded-[8px] border border-[#E5E7EB] px-[14px] text-[15px] font-bold text-[#6B7280] transition duration-300 hover:scale-[1.03] hover:bg-[#F8F9FB] active:scale-[0.98] disabled:opacity-50"
        >
          <ArrowLeft size={20} />
          Sebelumnya
        </button>

        <button
          disabled={!answerStatus}
          onClick={handleNext}
          className="flex h-[39px] min-w-[145px] items-center justify-center gap-[8px] rounded-[8px] bg-gradient-to-r from-[#7B2CFF] to-[#4F1DE8] px-[18px] text-[16px] font-bold text-white shadow-[0_8px_18px_rgba(101,29,255,0.25)] transition duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50"
        >
          {currentIndex + 1 >= questions.length ? "Finish" : "Selanjutnya"}
          {currentIndex + 1 < questions.length && <ArrowRight size={22} />}
        </button>
      </div>
    </PageLayout>
  );
};

const PageLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] px-[18px] pt-[22px]">
        {children}
      </div>
    </main>
  );
};

const TopQuizBar = ({ onClose, elapsedTime }) => {
  return (
    <div className="flex items-center justify-between">
      <button onClick={onClose} className="text-[#6B7280]">
        <X size={24} />
      </button>

      <div className="flex h-[29px] items-center gap-[6px] rounded-full border border-[#E5E7EB] bg-white px-[13px] text-[13px] font-medium text-black shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <Timer size={16} />
        {formatQuizTime(elapsedTime)}
      </div>

      <button className="text-[#6B7280]">
        <Flag size={22} />
      </button>
    </div>
  );
};

export default QuizPlayPage;