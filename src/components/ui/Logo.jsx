import logo from "../../assets/images/logo.png";

const Logo = ({ small = false }) => {
  return (
    <div className="flex items-center gap-[9px]">
      <img
        src={logo}
        alt="EduPredict Math"
        className={small ? "h-[28px] w-auto" : "h-[48px] w-auto"}
      />

      {!small && (
        <h1 className="text-[22px] font-bold tracking-[-0.03em] text-[#101322]">
          EduPredict Math
        </h1>
      )}
    </div>
  );
};

export default Logo;