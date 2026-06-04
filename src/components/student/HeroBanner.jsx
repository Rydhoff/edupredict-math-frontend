import { Play } from "lucide-react";
import mascot from "../../assets/images/mascot-dashboard.png";
import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();
  return (
    <section className="mt-[21px] overflow-hidden rounded-[14px] border border-[#E4D3FF] bg-[#F7F0FF] shadow-[0_8px_24px_rgba(101,29,255,0.08)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(101,29,255,0.14)]">
      <div className="relative h-[234px] px-[20px] py-[24px]">
        <div className="relative z-10">
          <h2 className="text-[37px] font-bold leading-[0.78] tracking-[-0.07em] text-[#191A7A]">
            Octa
          </h2>

          <p className="mt-[4px] text-[12px] font-bold text-[#3918D5]">
            si Gurita Pintar
          </p>

          <p className="mt-[19px] w-[155px] text-[17px] font-bold leading-[1.08] tracking-[-0.03em] text-black">
            Siap meningkatkan<br />skill matematika<br />hari ini?
          </p>

          <button
            onClick={() => navigate("/student/quizzes")}
            className="mt-[19px] inline-flex h-[38px] items-center gap-[5px] rounded-[7px] bg-[#8A19FF] px-[15px] text-[20px] font-bold text-white shadow-[0_8px_18px_rgba(138,25,255,0.25)] transition duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Play size={18} fill="white" />
            Start Quiz
          </button>
        </div>

        <div className="absolute right-[-3px] top-[11px] h-[212px] w-[212px] rounded-full bg-[#EEE4FF]" />

        <img
          src={mascot}
          alt="Octa"
          className="absolute bottom-[10px] right-[4px] z-10 w-[214px] object-contain transition duration-300 hover:scale-105"
        />
      </div>
    </section>
  );
};

export default HeroBanner;