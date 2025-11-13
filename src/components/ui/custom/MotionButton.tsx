"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { buttonVariants } from "../button";
import { cn } from "@/src/lib/utils";

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?:
    | "default"
    | "sm"
    | "lg"
    | "icon"
    | "icon-sm"
    | "icon-lg";
  loading?: boolean;
}

export const AnimatedButton = ({
  children,
  className,
  variant = "default",
  size = "default",
  loading = false,
  disabled = false,
  type = "button",
  ...motionProps
}: AnimatedButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      // Animation
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}

      // Styles
      className={cn(
        buttonVariants({ variant, size }),
        "relative flex items-center justify-center gap-2",
        isDisabled && "cursor-not-allowed opacity-60",
        className
      )}

      disabled={isDisabled}
      type={type}
      {...motionProps}
    >
      {loading && (
        <Loader2 className="absolute h-4 w-4 animate-spin" />
      )}
      <span className={loading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>
    </motion.button>
  );
};