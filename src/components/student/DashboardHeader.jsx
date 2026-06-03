import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import NotificationBell from "../shared/NotificationBell";
import { Player } from "@lottiefiles/react-lottie-player";
import fireAnimation from "../../assets/lottie/fire.json";

const DashboardHeader = ({ dashboard }) => {
  const navigate = useNavigate();

  const student = dashboard?.student;
  const name = student?.fullName?.split(" ")[0] || "Student";
  const streak = student?.streak || 0;

  return (
    <header>
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-[9px]">
          <img src={logo} alt="EduPredict Math" className="h-[48px] w-auto" />

          <h1 className="text-[22px] font-bold tracking-[-0.03em] text-[#101322]">
            EduPredict Math
          </h1>
        </div>

        <NotificationBell to="/student/notifications" size={27} />
      </div>

      <div className="mt-[26px] flex items-start justify-between lg:mt-0">
        <div>
          <h2 className="text-[25px] font-bold leading-none tracking-[-0.04em] text-[#080A14]">
            Hai, {name}! 👋
          </h2>

          <p className="mt-[9px] text-[14px] font-medium text-[#77777F]">
            Yuk tingkatkan skill matematika hari ini!
          </p>
        </div>

        <div className="relative mt-[-9px] flex h-[64px] w-[88px] flex-col items-center justify-center rounded-[12px] border border-[#FFE3B3] bg-white shadow-[0_8px_18px_rgba(255,122,0,0.08)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_12px_24px_rgba(255,122,0,0.15)]">
          <div className="flex items-center gap-[8px]">
            <Player
              autoplay
              loop
              src={fireAnimation}
              style={{
                width: 38,
                height: 38,
              }}
            />

            <span className="relative text-[24px] left-[-10px] top-[2px] font-bold leading-none text-black">
              {streak}
            </span>
          </div>

          <p className="mt-[2px] text-[10px] font-bold text-[#FF7A00]">
              Day Streak
            </p>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;