"use client"
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"
export const MotionButton = ({ children , className , ...props }: { children: string , className?:string}) => {
  return (
    <motion.div
    whileTap={{scale:0.9}}
    transition={{type:"spring",damping: 10 , stiffness: 400}}
    className={`${className} w-fit`}
    >
      <Button {...props} className={`pointer-events-none`}>
        {children}
      </Button>
    </motion.div>
  );
}