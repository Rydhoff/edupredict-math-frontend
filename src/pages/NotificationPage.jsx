import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Flame,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import PageState from "../components/ui/PageState";

import StudentBottomNav from "../components/student/StudentBottomNav";
import StudentDesktopNav from "../components/student/StudentDesktopNav";
import TeacherBottomNav from "../components/teacher/TeacherBottomNav";
import TeacherDesktopNav from "../components/teacher/TeacherDesktopNav";

const iconMap = {
  achievement: Trophy,
  streak: Flame,
  recommendation: Sparkles,
  quiz: BookOpen,
  class: Users,
  system: Bell,
};

const styleMap = {
  achievement: {
    bg: "bg-[#FFF6E5]",
    color: "text-[#F5A400]",
  },
  streak: {
    bg: "bg-[#FFF1E3]",
    color: "text-[#FF7A00]",
  },
  recommendation: {
    bg: "bg-[#F7F0FF]",
    color: "text-[#651DFF]",
  },
  quiz: {
    bg: "bg-[#EAF2FF]",
    color: "text-[#2478FF]",
  },
  class: {
    bg: "bg-[#E8F8EE]",
    color: "text-[#16B966]",
  },
  system: {
    bg: "bg-[#F3F4F6]",
    color: "text-[#6B7280]",
  },
};

const NotificationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const role = user?.role || "student";
  const isTeacher = role === "teacher";

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/notifications");
      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat notifikasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (notification) => {
    if (notification.isRead) return;

    try {
      await api.put(`/notifications/${notification._id}/read`);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id ? { ...item, isRead: true } : item
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membaca notifikasi");
    }
  };

  const handleReadAll = async () => {
    try {
      setMarkingAll(true);
      setError("");

      await api.put("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membaca semua notifikasi");
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] px-[14px] pb-[104px] pt-[49px] lg:ml-[304px] lg:max-w-[1100px] lg:px-[32px] lg:pb-[44px]">
        <header className="flex items-start justify-between gap-[14px]">
          <div className="flex min-w-0 items-start gap-[12px]">
            <button
              onClick={() => navigate(-1)}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] bg-white text-[#6B7280] shadow-sm transition hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="min-w-0">
              <h1 className="text-[26px] font-bold leading-none tracking-[-0.04em] text-black lg:text-[32px] lg:font-extrabold">
                Notification
              </h1>

              <p className="mt-[8px] text-[15px] font-medium text-[#6B7280]">
                {unreadCount > 0
                  ? `${unreadCount} notifikasi belum dibaca`
                  : "Semua notifikasi sudah dibaca"}
              </p>
            </div>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={handleReadAll}
              disabled={markingAll || unreadCount === 0}
              className="shrink-0 rounded-[10px] bg-[#F7F0FF] px-[12px] py-[8px] text-[12px] font-bold text-[#651DFF] transition hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {markingAll ? "..." : "Read All"}
            </button>
          )}
        </header>

        {error && (
          <div className="mt-[16px] rounded-[12px] bg-red-50 px-[13px] py-[10px] text-[13px] font-semibold text-red-600">
            {error}
          </div>
        )}

        <section className="mt-[24px] rounded-[22px] border border-[#E5E7EB] bg-white px-[16px] py-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] lg:rounded-[24px] lg:px-[20px]">
          {loading ? (
            <PageState type="loading" title="Memuat notifikasi..." />
          ) : notifications.length === 0 ? (
            <PageState
              type="empty"
              title="Belum ada notifikasi"
              message="Notifikasi dari sistem, teacher, dan AI akan muncul di sini."
            />
          ) : (
            <div className="grid gap-[12px] lg:grid-cols-2">
              {notifications.map((item) => (
                <NotificationItem
                  key={item._id}
                  item={item}
                  onClick={() => handleRead(item)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {isTeacher ? (
        <>
          <TeacherDesktopNav />
          <TeacherBottomNav />
        </>
      ) : (
        <>
          <StudentDesktopNav />
          <StudentBottomNav />
        </>
      )}
    </main>
  );
};

const NotificationItem = ({ item, onClick }) => {
  const Icon = iconMap[item.type] || Bell;
  const style = styleMap[item.type] || styleMap.system;

  const time = new Date(item.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <button
      onClick={onClick}
      className={`flex min-h-[92px] w-full rounded-[16px] border border-[#E5E7EB] bg-white px-[16px] py-[14px] text-left transition hover:-translate-y-[2px] hover:border-[#D7C4FF] hover:shadow-[0_10px_24px_rgba(101,29,255,0.08)] active:scale-[0.99] ${
        !item.isRead ? "shadow-[0_3px_12px_rgba(0,0,0,0.04)]" : "opacity-80"
      }`}
    >
      <div
        className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] ${style.bg} ${style.color}`}
      >
        <Icon size={24} />
      </div>

      <div className="ml-[13px] min-w-0 flex-1">
        <div className="flex items-start justify-between gap-[8px]">
          <h3 className="text-[15px] font-bold leading-tight text-black">
            {item.title}
          </h3>

          {!item.isRead && (
            <span className="mt-[5px] h-[8px] w-[8px] shrink-0 rounded-full bg-[#651DFF]" />
          )}
        </div>

        <p className="mt-[5px] text-[12px] font-medium leading-[1.35] text-[#6B7280]">
          {item.message}
        </p>

        <p className="mt-[7px] text-[11px] font-medium text-[#9CA3AF]">
          {time}
        </p>
      </div>
    </button>
  );
};

export default NotificationPage;