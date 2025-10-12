"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

export const AnimatedButton = ({
  children,
  className,
  type = "button",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}) => {
  return (
    <MotionButton
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", damping: 10, stiffness: 400 }}
      className={`${className} w-fit cursor-pointer`}
      type={type}
      {...props}
    >
      {children}
    </MotionButton>
  );
};
