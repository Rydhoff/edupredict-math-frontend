import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const NotificationBell = ({ to, size = 27 }) => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get("/notifications/unread-count");
      setCount(data.count || 0);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return (
    <button onClick={() => navigate(to)} className="relative">
      <Bell size={size} className="text-bold" />

      {count > 0 && (
        <span className="absolute right-[-5px] top-[-6px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-500 px-[4px] text-[10px] font-bold leading-none text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;