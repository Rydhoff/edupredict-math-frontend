import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const NotificationBell = ({ to, size = 27 }) => {
  const navigate = useNavigate();

  const cacheKey = useMemo(() => {
    return to?.includes("/teacher")
      ? "teacher_unread_notification_count"
      : "student_unread_notification_count";
  }, [to]);

  const [count, setCount] = useState(() => {
    const cached = sessionStorage.getItem(cacheKey);
    return cached ? Number(cached) || 0 : 0;
  });

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get("/notifications/unread-count");
      const unreadCount = data.count || 0;

      setCount(unreadCount);
      sessionStorage.setItem(cacheKey, String(unreadCount));
    } catch {
      const cached = sessionStorage.getItem(cacheKey);
      setCount(cached ? Number(cached) || 0 : 0);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [cacheKey]);

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="relative flex h-[32px] w-[32px] items-center justify-center text-[#111827]"
    >
      <Bell size={size} />

      <span
        className={`absolute right-[-3px] top-[-4px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-500 px-[4px] text-[10px] font-bold leading-none text-white transition-opacity duration-200 ${
          count > 0 ? "opacity-100" : "opacity-0"
        }`}
      >
        {count > 9 ? "9+" : count}
      </span>
    </button>
  );
};

export default NotificationBell;