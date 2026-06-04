import { NavLink } from "react-router-dom";
import { Bell, BookOpen, Home, User, Users } from "lucide-react";

import logo from "../../assets/images/logo.png";
import NotificationBell from "../shared/NotificationBell";

const items = [
  { label: "Dashboard", to: "/teacher", icon: Home },
  { label: "Classes", to: "/teacher/classes", icon: BookOpen },
  { label: "Students", to: "/teacher/students", icon: Users },
  { label: "Profile", to: "/teacher/profile", icon: User },
];

const TeacherDesktopNav = () => {
  return (
    <aside
  className="
    fixed left-[20px] top-[20px]
    hidden h-[calc(100vh-40px)] w-[240px]
    rounded-[28px] border border-[#E8E3F4]
    bg-white/85 px-[18px] py-[20px]
    shadow-[0_18px_50px_rgba(31,41,55,0.08)]
    backdrop-blur-xl

    lg:flex lg:flex-col

    xl:left-[32px]
    xl:top-[32px]
    xl:h-[calc(100vh-64px)]
    xl:w-[252px]
  "
>
      <div className="flex items-center gap-[10px] px-[6px]">
        <img src={logo} alt="EduPredict" className="h-[43px]" />

        <div>
          <h2 className="text-[17px] font-bold leading-none text-[#101348]">
            EduPredict
          </h2>

          <p className="mt-[4px] text-[11px] font-medium text-[#8A8A92]">
            Teacher Panel
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
              end={item.to === "/teacher"}
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

      <div className="mt-auto rounded-[20px] border border-[#EEE7FF] bg-gradient-to-br from-[#F7F0FF] to-white px-[14px] py-[14px]">
        <div className="flex items-center gap-[10px]">

          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-[#101348]">
              Notifications
            </p>
          </div>

          <NotificationBell to="/teacher/notifications" size={24} />
        </div>
      </div>
    </aside>
  );
};

export default TeacherDesktopNav;