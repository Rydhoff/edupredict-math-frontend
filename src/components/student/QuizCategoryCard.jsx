import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const styles = {
  purple: {
    border: "border-[#8A19FF]",
    bg: "bg-[#FBF6FF]",
    title: "text-[#8A19FF]",
    bar: "bg-[#8A19FF]",
    button: "bg-[#8A19FF]",
  },
  green: {
    border: "border-[#C9F1D3]",
    bg: "bg-[#F1FFF5]",
    title: "text-black",
    bar: "bg-[#43CF68]",
    button: "bg-[#43CF68]",
  },
  yellow: {
    border: "border-[#FFE2A3]",
    bg: "bg-[#FFF9ED]",
    title: "text-black",
    bar: "bg-[#FFB000]",
    button: "bg-[#FFB000]",
  },
  blue: {
    border: "border-[#C8DCFF]",
    bg: "bg-[#F1F7FF]",
    title: "text-black",
    bar: "bg-[#246BFF]",
    button: "bg-[#246BFF]",
  },
  pink: {
    border: "border-[#FF95DE]",
    bg: "bg-[#FFF5FB]",
    title: "text-black",
    bar: "bg-[#E018B7]",
    button: "bg-[#E018B7]",
  },
  red: {
    border: "border-[#FF9A90]",
    bg: "bg-[#FFF0EF]",
    title: "text-black",
    bar: "bg-[#FF5A4F]",
    button: "bg-[#FF5A4F]",
  },
  orange: {
    border: "border-[#FFD2A8]",
    bg: "bg-[#FFF6ED]",
    title: "text-black",
    bar: "bg-[#FF8A1F]",
    button: "bg-[#FF8A1F]",
  },
};

const QuizCategoryCard = ({ quiz }) => {
  const navigate = useNavigate();
  const s = styles[quiz.color] || styles.purple;

  const goLibrary = () => {
    navigate(`/student/quizzes/library?category=${quiz.id}`);
  };

  return (
    <section
      className={`relative min-h-[246px] overflow-hidden rounded-[16px] border ${s.border} ${s.bg} px-[21px] py-[22px] shadow-[0_8px_22px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(101,29,255,0.12)]`}
    >
      <div className="relative z-10">
        <h2
          className={`text-[26px] font-bold leading-none tracking-[-0.035em] ${s.title}`}
        >
          {quiz.title}
        </h2>

        <p className="mt-[10px] w-[185px] text-[15px] font-medium leading-[1.05] text-[#66666F]">
          {quiz.description}
        </p>

        <p className="mt-[20px] text-[15px] font-medium text-[#66666F]">
          {quiz.module}
        </p>

        <p className="mt-[16px] text-[22px] font-bold leading-none text-black">
          {quiz.progress}%
        </p>

        <div className="mt-[8px] h-[6px] w-full rounded-full bg-[#D9D9D9]">
          <div
            className={`h-full rounded-full ${s.bar} transition-all duration-700`}
            style={{ width: `${quiz.progress}%` }}
          />
        </div>

        <button
          onClick={goLibrary}
          className={`mt-[20px] flex h-[37px] w-full items-center justify-center gap-[5px] rounded-[7px] text-[20px] font-bold text-white ${s.button} shadow-[0_8px_18px_rgba(0,0,0,0.14)] transition duration-300 hover:scale-[1.02] active:scale-[0.98]`}
        >
          <Play size={18} fill="white" />
          Start Quiz
        </button>
      </div>

      <img
        src={quiz.image}
        alt={quiz.title}
        className="absolute right-[-2px] top-[8px] z-0 w-[170px] object-contain transition duration-300 hover:scale-105"
      />
    </section>
  );
};

export default QuizCategoryCard;