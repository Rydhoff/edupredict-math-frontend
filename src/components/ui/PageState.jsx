import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react";

const PageState = ({
  type = "empty",
  title = "",
  message = "",
  action = null,
  overlay = false,
}) => {
  const config = {
    loading: {
      icon: <LoaderCircle size={46} className="animate-spin text-[#651DFF]" />,
      bg: "bg-[#F7F0FF]",
      defaultTitle: "Memuat data...",
      defaultMessage: "Tunggu sebentar ya.",
    },
    empty: {
      icon: <Inbox size={46} className="text-[#651DFF]" />,
      bg: "bg-[#F7F0FF]",
      defaultTitle: "Belum ada data",
      defaultMessage: "Data akan tampil di sini.",
    },
    error: {
      icon: <AlertTriangle size={46} className="text-[#EF4444]" />,
      bg: "bg-[#FFF1F1]",
      defaultTitle: "Terjadi kesalahan",
      defaultMessage: "Silakan coba lagi.",
    },
  };

  const current = config[type] || config.empty;

  const content = (
    <div className="flex w-full max-w-[330px] flex-col items-center rounded-[22px] border border-[#E5E7EB] bg-white px-[24px] py-[34px] text-center shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
      <div
        className={`flex h-[86px] w-[86px] items-center justify-center rounded-full ${current.bg}`}
      >
        {current.icon}
      </div>

      <h3 className="mt-[18px] text-[22px] font-bold tracking-[-0.03em] text-black">
        {title || current.defaultTitle}
      </h3>

      <p className="mt-[8px] max-w-[260px] text-[14px] font-medium leading-[1.45] text-[#6B7280]">
        {message || current.defaultMessage}
      </p>

      {action && <div className="mt-[20px]">{action}</div>}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 px-[24px] backdrop-blur-[2px]">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[260px] items-center justify-center px-[10px]">
      {content}
    </div>
  );
};

export default PageState;