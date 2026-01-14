"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

type AnimatedButtonProps = {
  children: ReactNode;
  type?: "primary" | "secondary";
  size?: "large" | "small";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
} & HTMLMotionProps<"button">;

export  function AnimatedButton({
  children,
  size = "large",
  loading = false,
  disabled = false,
  className = "",
  ...props
}: AnimatedButtonProps) {
  const isDisabled = disabled || loading;

  const base =
    "relative inline-flex items-center justify-center font-medium transition";

  // const typeClasses =
  //   type === "primary"
  //     ? "bg-cyan-800 text-white hover:bg-cyan-700"
  //     : "bg-transparent border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white";

  const sizeClasses =
    size === "large"
      ? "px-6 py-3 rounded-xl text-base"
      : "px-3 py-2 rounded-lg text-sm";

  return (
    <motion.button
      whileHover={{ scale: isDisabled ? 1 : 1.03 }}
      whileTap={{ scale: isDisabled ? 1 : 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      disabled={isDisabled}
      className={`${base}  ${sizeClasses} ${
        isDisabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    >
      {loading && (
        <Loader2 className="absolute h-4 w-4 animate-spin" />
      )}

      <span className={loading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>
    </motion.button>
  );
}
