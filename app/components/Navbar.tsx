import React from "react";
import Image from "next/image";
import {  ShoppingBag } from "lucide-react";
import { MotionButton } from "@/components/ui/MotionButton";

const Navbar = () => {
  return (
    <nav className="px-5 py-3 flex justify-between">
      <div className="flex gap-1 items-center">
        <Image width={55} height={60} alt={"logo"} src={"/logo.svg"}></Image>
        <h1 className="text-2xl text-[#79ac31] font-bold">ShopNex</h1>
      </div>
    
      <div className="flex gap-3 items-center text-[#79ac31]">
        <ShoppingBag size={32} />
        <MotionButton 
        >
          Login
        </MotionButton>
      </div>
    </nav>
  );
};

export default Navbar;
