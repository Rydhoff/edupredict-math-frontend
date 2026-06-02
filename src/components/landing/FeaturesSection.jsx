import { features } from "../../constants/landingData";

const colorClass = {
  violet: "bg-[#F4EAFE] text-[#6817F6]",
  green: "bg-[#EAFBF1] text-[#13B65B]",
  pink: "bg-[#FFEAF6] text-[#F22691]",
  orange: "bg-[#FFF2DE] text-[#F59A13]",
};

const FeaturesSection = () => {
  return (
    <section className="mt-[38px] px-[17px]">
      <h2 className="text-center text-[24px] font-bold tracking-[-0.03em] text-[#090B14]">
        Why you’ll love EduPredict Math
      </h2>

      <div className="mt-[22px] space-y-[9px]">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={`${feature.title}-${index}`}
              className="group flex items-center gap-[13px] rounded-[18px] border border-[#E3E3E7] bg-white px-[14px] py-[13px] shadow-[0_4px_14px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:border-[#D8C2FF] hover:shadow-[0_12px_24px_rgba(101,29,255,0.08)]"
            >
              <div
                className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] transition duration-300 group-hover:scale-110 ${colorClass[feature.color]}`}
              >
                <Icon size={21} />
              </div>

              <div className="text-left">
                <h3 className="text-[15px] font-bold leading-tight text-[#101348]">
                  {feature.title}
                </h3>

                <p className="mt-[3px] text-[12px] font-medium leading-snug text-[#7B7B83]">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;