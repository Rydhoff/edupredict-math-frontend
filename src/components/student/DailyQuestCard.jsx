import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";

const formatResetTime = (resetAt) => {
  if (!resetAt) return "00:00:00";

  const now = new Date();
  const resetDate = new Date(resetAt);
  const diff = resetDate.getTime() - now.getTime();

  if (diff <= 0) return "00:00:00";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

const DailyQuestCard = ({ dashboard }) => {
  const dailyQuest = dashboard?.dailyQuest;
  const quests = dailyQuest?.quests || [];

  const [resetTimer, setResetTimer] = useState(() =>
    formatResetTime(dailyQuest?.resetAt)
  );

  useEffect(() => {
    setResetTimer(formatResetTime(dailyQuest?.resetAt));

    const interval = setInterval(() => {
      setResetTimer(formatResetTime(dailyQuest?.resetAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [dailyQuest?.resetAt]);

  const questList = useMemo(() => {
    if (quests.length > 0) return quests;

    return [
      {
        key: "empty",
        title: "Belum ada quest hari ini",
        current: 0,
        target: 1,
        completed: false,
      },
    ];
  }, [quests]);

  return (
    <section className="mt-[16px] rounded-[15px] border border-[#E5E7EB] bg-white px-[17px] py-[20px] shadow-[0_6px_18px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold tracking-[-0.04em] text-black">
          Daily Quest
        </h2>

        <p className="rounded-full bg-[#F8F9FB] px-[10px] py-[5px] text-[12px] font-bold text-[#6B7280]">
          Resets in {resetTimer}
        </p>
      </div>

      <div className="mt-[17px] space-y-[12px]">
        {questList.map((quest) => {
          const progressPercent = quest.target
            ? Math.min((quest.current / quest.target) * 100, 100)
            : 0;

          return (
            <div
              key={quest.key}
              className="flex items-center gap-[10px] rounded-[12px] px-[6px] py-[6px] transition duration-300 hover:bg-[#FAFAFA]"
            >
              <div
                className={`flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full transition duration-300 ${
                  quest.completed
                    ? "bg-[#16B966] shadow-[0_5px_12px_rgba(22,185,102,0.25)]"
                    : "bg-[#D9D9D9]"
                }`}
              >
                <Check size={16} strokeWidth={3} className="text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-bold text-black">
                    {quest.title}
                  </p>

                  <p className="text-[14px] font-bold text-black">
                    {quest.current} / {quest.target}
                  </p>
                </div>

                <div className="mt-[7px] h-[5px] overflow-hidden rounded-full bg-[#D9D9D9]">
                  <div
                    className="h-full rounded-full bg-[#16B966] transition-all duration-700"
                    style={{
                      width: `${progressPercent}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DailyQuestCard;