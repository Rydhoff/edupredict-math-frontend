import Logo from "../ui/Logo";

const Footer = () => {
  return (
    <footer className="mt-[48px] border-t border-[#F0E7FF] pb-[36px] pt-[24px] text-center">
      <div className="flex justify-center">
        <Logo />
      </div>

      <p className="mt-[12px] text-[12px] font-medium text-[#8A8A92]">
        © 2026 EduPredict Math. All rights reserved.
      </p>

      <p className="mt-[4px] text-[11px] font-medium text-[#B0B0B8]">
        AI-Powered Adaptive Learning Platform
      </p>
    </footer>
  );
};

export default Footer;