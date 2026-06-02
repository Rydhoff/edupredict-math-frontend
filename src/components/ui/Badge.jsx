const Badge = ({ children }) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
      {children}
    </div>
  );
};

export default Badge;