import { NavLink } from "react-router-dom";
import { BarChart3, Brain, Home, Trophy, User } from "lucide-react";

import logo from "../../assets/images/logo.png";
import NotificationBell from "../shared/NotificationBell";

const items = [
  { label: "Dashboard", to: "/student", icon: Home },
  { label: "Quizzes", to: "/student/quizzes", icon: Brain },
  { label: "Progress", to: "/student/progress", icon: BarChart3 },
  { label: "Rewards", to: "/student/rewards", icon: Trophy },
  { label: "Profile", to: "/student/profile", icon: User },
];

const StudentDesktopNav = () => {
  return (
    <aside className="fixed left-[32px] top-[32px] hidden h-[calc(100vh-64px)] w-[252px] rounded-[28px] border border-[#E8E3F4] bg-white/85 px-[18px] py-[20px] shadow-[0_18px_50px_rgba(31,41,55,0.08)] backdrop-blur-xl lg:flex lg:flex-col">
      <div className="flex items-center gap-[10px] px-[6px]">
        <img src={logo} alt="EduPredict" className="h-[43px]" />

        <div>
          <h2 className="text-[17px] font-bold leading-none text-[#101348]">
            EduPredict
          </h2>
          <p className="mt-[4px] text-[11px] font-medium text-[#8A8A92]">
            Math Learning
          </p>
        </div>
      </div>

      <nav className="mt-[32px] space-y-[7px]">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/student"}
              className={({ isActive }) =>
                `group flex h-[47px] items-center gap-[12px] rounded-[16px] px-[14px] text-[14px] font-bold transition duration-300 ${
                  isActive
                    ? "border border-[#E4D3FF] bg-[#F7F0FF] text-[#651DFF] shadow-[0_8px_20px_rgba(101,29,255,0.08)]"
                    : "text-[#6B7280] hover:bg-[#FAF7FF] hover:text-[#651DFF]"
                }`
              }
            >
              <Icon
                size={20}
                className="transition duration-300 group-hover:scale-105"
              />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      

      <div className="mt-auto flex items-center justify-between rounded-[18px] border border-[#EEE7FF] px-[14px] py-[12px]">
        <div>
          <p className="text-[13px] font-bold text-[#101348]">
            Notifications
          </p>
          <p className="mt-[3px] text-[11px] font-medium text-[#8A8A92]">
            Lihat update belajar
          </p>
        </div>

        <NotificationBell to="/student/notifications" size={25} />
      </div>

    </aside>
  );
};

export default StudentDesktopNav;