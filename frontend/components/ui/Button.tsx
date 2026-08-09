import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand/40 text-[15px] cursor-pointer";

  const variants = {
    primary:
      "bg-foreground text-background hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] py-[10px] px-6 shadow-sm",
    secondary:
      "border border-neutral-300 text-foreground hover:bg-neutral-100 hover:border-neutral-400 hover:scale-[1.02] active:scale-[0.98] py-[10px] px-6",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
