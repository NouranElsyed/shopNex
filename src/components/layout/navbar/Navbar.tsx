import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ListTree, Ribbon, ShoppingCart } from "lucide-react";
import UserMenu from "./UserMenu";

const Navbar = async () => {
  return (
    <nav className="px-5 py-3 flex justify-between items-center">
      <Link
        href="/"
        className="flex gap-1 items-center hover:opacity-90 transition"
      >
        <Image width={40} height={50} alt={"logo"} src={"/logo.svg"}></Image>
        <h1 className="text-xl text-[#79ac31] font-bold">ShopNex</h1>
      </Link>
      <ul className="links hidden  md:flex  md:gap-4  lg:gap-27 text-xs lg:text-sm md:mx-3">
        <li className="flex gap-2 items-center text-[#79ac31] font-semibold hover:text-[#628e24] hover:bg-[#e8f0db] py-1 px-2  lg:py-2 lg:px-3 rounded-3xl transition-all duration-300">
          <ShoppingCart size={18} />
          <Link href="/products">Our products</Link>
        </li>
        <li className="flex gap-2 items-center text-[#79ac31] font-semibold hover:text-[#628e24] hover:bg-[#e8f0db] py-2 px-3 rounded-3xl transition-all duration-300">
          <ListTree size={18} />
          <Link href="/categories">Categories</Link>
        </li>
        <li className="flex gap-2 items-center text-[#79ac31] font-semibold hover:text-[#628e24] hover:bg-[#e8f0db] py-2 px-3 rounded-3xl transition-all duration-300">
          <Ribbon size={18} />
          <Link href="/brands">Brands</Link>
        </li>
      </ul>
      <UserMenu></UserMenu>
    </nav>
  );
};

export default Navbar;
