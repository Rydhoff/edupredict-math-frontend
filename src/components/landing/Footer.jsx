import Logo from "../ui/Logo";

const Footer = () => {
  return (
    <footer className="mt-[48px] border-t border-[#F0E7FF] px-[18px] pb-[36px] pt-[24px] text-center lg:mt-[72px] lg:px-[32px] lg:pb-[44px] lg:pt-[32px]">
      <div className="flex justify-center">
        <Logo />
      </div>

      <p className="mt-[12px] text-[12px] font-medium text-[#8A8A92] lg:text-[13px]">
        © 2026 EduPredict Math. All rights reserved.
      </p>

      <p className="mt-[4px] text-[11px] font-medium text-[#B0B0B8] lg:text-[12px]">
        AI-Powered Adaptive Learning Platform
      </p>
    </footer>
  );
};

export default Footer;