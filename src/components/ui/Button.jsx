import { Link } from "react-router-dom";

const Button = ({ children, to, className = "", ...props }) => {
  const classes = `
    inline-flex items-center justify-center gap-2
    rounded-[8px]
    bg-gradient-to-r from-[#981DFF] to-[#5A16E8]
    px-6 py-[13px]
    text-[20px] font-bold text-white
    shadow-[0_8px_18px_rgba(108,33,255,0.20)]
    transition active:scale-[0.98]
    ${className}
  `;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;