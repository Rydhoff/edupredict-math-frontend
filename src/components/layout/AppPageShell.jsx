const AppPageShell = ({ children }) => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div
        className="
          min-h-screen w-full max-w-[460px]
          px-[14px] pb-[104px] pt-[49px]
          mx-auto

          lg:mx-0
          lg:ml-[280px]
          lg:w-[calc(100%-280px)]
          lg:max-w-[calc(100%-280px)]
          lg:px-[24px]
          lg:pb-[44px]

          xl:ml-[304px]
          xl:w-[calc(100%-304px)]
          xl:max-w-[calc(100%-304px)]
          xl:px-[32px]

          2xl:max-w-[1180px]
        "
      >
        {children}
      </div>
    </main>
  );
};

export default AppPageShell;