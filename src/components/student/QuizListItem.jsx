import { Clock, Play } from "lucide-react";

const levelStyle = {
  Adaptive: "bg-[#F3E8FF] text-[#8A19FF]",
  Easy: "bg-[#DFFBEA] text-[#0FA85D]",
  Medium: "bg-[#FFF1D6] text-[#D88B00]",
  Hard: "bg-[#FFE1E1] text-[#EF4444]",
};

const QuizListItem = ({ quiz, onStart, loading }) => {
  return (
    <div className="flex min-h-[100px] items-center rounded-[15px] border border-[#E5E7EB] bg-white px-[12px] py-[10px] shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-[2px] hover:border-[#E4D3FF] hover:shadow-[0_10px_24px_rgba(101,29,255,0.08)]">
      <img
        src={quiz.image}
        alt={quiz.title}
        className="h-[68px] w-[68px] shrink-0 rounded-[14px] object-cover"
      />

      <div className="ml-[12px] min-w-0 flex-1">
        <div className="flex items-center gap-[7px]">
          <span
            className={`rounded-[7px] px-[8px] py-[4px] text-[10px] font-bold ${
              levelStyle[quiz.level] || levelStyle.Adaptive
            }`}
          >
            {quiz.level}
          </span>

        </div>

        <h3 className="mt-[8px] truncate text-[16px] font-bold leading-tight text-[#101348]">
          {quiz.title}
        </h3>

        <div className="mt-[6px] flex items-center gap-[10px] text-[11px] font-medium leading-none text-[#8A8A92]">
          <span>{quiz.questions} soal</span>

          <span className="flex items-center gap-[3px]">
            <Clock size={12} />
            {quiz.minutes} menit
          </span>
        </div>
      </div>

     <div className="flex flex-col text-right gap-4">
      <p className="truncate text-[10px] mr-2 font-medium leading-none text-[#8A8A92]">
            {quiz.categoryLabel}
          </p>

      <button
        onClick={() => onStart?.(quiz)}
        disabled={loading}
        className="ml-[8px] flex h-[34px] shrink-0 items-center gap-[4px] rounded-full border border-[#E9D8FF] bg-white px-[12px] text-[11px] font-bold text-[#8A19FF] shadow-[0_4px_12px_rgba(138,25,255,0.12)] transition duration-300 hover:scale-[1.03] hover:bg-[#F9F4FF] active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="h-[11px] w-[11px] animate-spin rounded-full border-2 border-[#8A19FF] border-t-transparent" />
            Loading
          </>
        ) : (
          <>
            <Play size={12} fill="#8A19FF" />
            Mulai Kuis
          </>
        )}
      </button>
      </div> 
          
    </div>
  );
};

export default QuizListItem;