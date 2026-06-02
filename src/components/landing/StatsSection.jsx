import { stats } from "../../constants/landingData";

const StatsSection = () => {
  return (
    <section className="mt-[25px] px-[13px]">
      <div className="grid grid-cols-4 gap-[7px] rounded-[18px] border border-[#E5E1EA] bg-white px-[16px] py-[17px] shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
        {stats.map((item) => (
          <div
            key={item.value}
            className="rounded-[12px] border border-[#E8D9FF] bg-[#FAF7FF] px-1 py-[12px] text-center transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(101,29,255,0.08)]"
          >
            <h3 className="text-[21px] font-bold leading-none text-[#5B19E8]">
              {item.value}
            </h3>

            <p className="mt-[7px] whitespace-pre-line text-[10px] font-medium leading-[1.05] text-[#6B7280]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;