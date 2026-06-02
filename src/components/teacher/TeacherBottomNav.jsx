import { BookOpen, Home, User, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const menus = [
  { name: "Home", path: "/teacher", icon: Home },
  { name: "Classes", path: "/teacher/classes", icon: BookOpen },
  { name: "Students", path: "/teacher/students", icon: Users },
  { name: "Profile", path: "/teacher/profile", icon: User },
];

const TeacherBottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-transparent px-[10px] pb-[20px]">
      <div className="mx-auto max-w-[460px] rounded-[12px] border border-[#E5E7EB] bg-white px-[24px] py-[9px] shadow-[0_-4px_18px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                end={menu.path === "/teacher"}
                className={({ isActive }) =>
                  `flex w-[58px] flex-col items-center gap-[2px] text-[11px] font-bold ${
                    isActive ? "text-[#6D22F3]" : "text-[#6B7280]"
                  }`
                }
              >
                <Icon size={22} strokeWidth={2.4} />
                <span>{menu.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TeacherBottomNav;