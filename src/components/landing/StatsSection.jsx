import { stats } from "../../constants/landingData";

const StatsSection = () => {
  return (
    <section className="mt-[25px] px-[13px] lg:mt-[40px] lg:px-[32px]">
      <div className="grid grid-cols-2 gap-[9px] rounded-[22px] border border-[#E5E1EA] bg-white px-[16px] py-[17px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] sm:grid-cols-4 lg:gap-[14px] lg:rounded-[28px] lg:px-[24px] lg:py-[24px]">
        {stats.map((item) => (
          <div
            key={item.value}
            className="rounded-[14px] border border-[#E8D9FF] bg-[#FAF7FF] px-2 py-[14px] text-center transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(101,29,255,0.08)] lg:rounded-[18px] lg:py-[20px]"
          >
            <h3 className="text-[24px] font-bold leading-none text-[#5B19E8] lg:text-[34px]">
              {item.value}
            </h3>

            <p className="mt-[7px] whitespace-pre-line text-[11px] font-medium leading-[1.15] text-[#6B7280] lg:text-[13px]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;