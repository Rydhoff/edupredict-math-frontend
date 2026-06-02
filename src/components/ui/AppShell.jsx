const AppShell = ({ children, bottomNav = null, className = "" }) => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#EEF4FF] via-[#F8F2FF] to-white">
      <div className="mx-auto flex min-h-screen w-full justify-center lg:items-center lg:px-[24px] lg:py-[32px]">
        <div
          className={`relative min-h-screen w-full bg-white shadow-none lg:min-h-[860px] lg:max-h-[92vh] lg:max-w-[460px] lg:overflow-y-auto lg:rounded-[32px] lg:border lg:border-[#E5E7EB] lg:shadow-[0_24px_70px_rgba(17,24,39,0.14)] ${className}`}
        >
          {children}
          {bottomNav}
        </div>
      </div>
    </main>
  );
};

export default AppShell;