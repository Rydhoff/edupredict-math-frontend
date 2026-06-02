import { ArrowRight } from "lucide-react";
import mascotCta from "../../assets/images/mascot-cta.png";

const CTASection = () => {
  return (
    <section className="mt-[36px] px-[17px]">
      <div className="flex h-[170px] items-center overflow-hidden rounded-[22px] border border-[#E4D3FF] bg-[#F7F0FF] px-[12px] py-[15px] shadow-[0_14px_34px_rgba(101,29,255,0.10)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_18px_38px_rgba(101,29,255,0.16)]">
        <div className="flex w-[45%] justify-center">
          <img
            src={mascotCta}
            alt="Octa Mascot"
            className="w-[128px] scale-[1.2] object-contain drop-shadow-[0_15px_25px_rgba(101,29,255,0.12)] transition duration-300 hover:scale-[1.25]"
          />
        </div>

        <div className="w-[55%] pl-[8px] text-left">
          <h2 className="text-[21px] font-bold leading-[1.05] tracking-[-0.035em] text-[#090B14]">
            Let’s unlock your math potential!
          </h2>

          <p className="mt-[9px] text-[12px] font-medium leading-snug text-[#7B7B83]">
            Setiap langkah kecil hari ini, bawa kamu ke hasil yang besar
          </p>

          <a
            href="/register"
            className="mt-[12px] inline-flex items-center gap-2 rounded-full bg-[#8424FF] px-[16px] py-[8px] text-[14px] font-bold text-white shadow-[0_10px_22px_rgba(132,36,255,0.25)] transition hover:scale-105 active:scale-95"
          >
            You got this!
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;