"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MouseEventHandler } from "react";

const MotionButton = motion(Button);

export const AnimatedButton = ({
  children,
  className,
  onClick,
  type = "button",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?:MouseEventHandler<HTMLButtonElement>
}) => {
  return (
    <MotionButton
      whileTap={{ scale: 0.8 }}
      transition={{ type: "spring", damping: 10, stiffness: 400 }}
      className={`${className} w-fit cursor-pointer`}
      type={type}
      {...props}
      onClick={onClick}
    >
      {children}
    </MotionButton>
  );
};
