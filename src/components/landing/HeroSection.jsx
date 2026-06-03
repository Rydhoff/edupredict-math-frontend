import { Rocket, Sparkles } from "lucide-react";
import Button from "../ui/Button";
import mascot from "../../assets/images/mascot-landing.png";

const HeroSection = () => {
  return (
    <section className="px-[18px] pt-[34px] text-center lg:grid lg:grid-cols-[1fr_480px] lg:items-center lg:gap-[40px] lg:px-[32px] lg:pt-[72px] lg:text-left">
      <div className="lg:pb-[40px]">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#DEC8FF] bg-[#F7F0FF] px-[14px] py-[6px] text-[13px] font-bold text-[#651DFF] shadow-[0_6px_18px_rgba(101,29,255,0.08)] transition duration-300 hover:scale-[1.03] lg:text-[14px]">
          <Sparkles size={14} />
          AI-Powered Adaptive Learning
        </div>

        <h1 className="mt-[26px] text-[38px] font-bold leading-[1.05] tracking-[-0.045em] text-[#080A14] sm:text-[46px] lg:mt-[30px] lg:text-[68px] lg:leading-[0.98]">
          Master Math,
          <br />
          <span className="text-[#8424FF]">Smarter with AI</span>
        </h1>

        <p className="mx-auto mt-[17px] max-w-[320px] text-[17px] font-medium leading-[1.42] text-[#70717A] lg:mx-0 lg:mt-[22px] lg:max-w-[500px] lg:text-[20px]">
          Belajar jadi lebih personal, fun, dan efektif bareng AI yang ngerti
          kamu ✨
        </p>

        <div className="mt-[27px] px-0 lg:mt-[34px] lg:max-w-[300px]">
          <Button
            to="/login"
            className="h-[50px] w-full shadow-[0_12px_25px_rgba(101,29,255,0.25)] transition hover:scale-[1.02] active:scale-[0.98] lg:h-[54px]"
          >
            <Rocket size={23} />
            Start Learning Now
          </Button>
        </div>
      </div>

      <div className="mt-[27px] flex justify-center lg:mt-0">
        <img
          src={mascot}
          alt="Octa Mascot"
          className="w-[365px] max-w-full object-contain drop-shadow-[0_18px_35px_rgba(101,29,255,0.15)] transition duration-500 hover:scale-[1.04] lg:w-[500px]"
        />
      </div>
    </section>
  );
};

export default HeroSection;