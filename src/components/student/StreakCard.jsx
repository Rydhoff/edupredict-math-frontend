import { Player } from "@lottiefiles/react-lottie-player";
import fireAnimation from "../../assets/lottie/fire.json";

const defaultDays = [
  { day: "M", active: false },
  { day: "T", active: false },
  { day: "W", active: false },
  { day: "T", active: false },
  { day: "F", active: false },
  { day: "S", active: false },
  { day: "S", active: false },
];

const StreakCard = ({ dashboard }) => {
  const weeklyStreak = dashboard?.weeklyStreak || defaultDays;

  const days = weeklyStreak.map((item) => ({
    day: item.day,
    active: item.active,
    fire: item.today && item.active,
  }));

  return (
    <section className="mt-[17px] rounded-[15px] border border-[#E5E7EB] bg-white px-[22px] py-[16px] shadow-[0_6px_18px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black">
          Your Streak
        </h2>

        <p className="rounded-full bg-[#FFF1E3] px-[10px] py-[5px] text-[12px] font-bold text-[#FF7A00]">
          Keep it up!
        </p>
      </div>

      <div className="mt-[19px] flex justify-between px-[18px]">
        {days.map((item, index) => (
          <div
            key={`${item.day}-${index}`}
            className="text-center transition duration-300 hover:-translate-y-[2px]"
          >
            <p className="text-[12px] font-bold text-black">{item.day}</p>

            <div className="mt-[8px] flex h-[30px] w-[30px] items-center justify-center">
              {item.fire ? (
                <Player
                  autoplay
                  loop
                  src={fireAnimation}
                  style={{ height: 40, width: 40 }}
                />
              ) : (
                <span
                  className={`block rounded-full transition duration-300 ${
                    item.active
                      ? "h-[16px] w-[16px] bg-[#6D22F3] shadow-[0_5px_12px_rgba(109,34,243,0.25)]"
                      : "h-[14px] w-[14px] bg-[#D9D9D9]"
                  }`}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StreakCard;