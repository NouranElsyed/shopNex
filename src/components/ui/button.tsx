import Link from "next/link";
import { ReactNode } from "react";
type ButtonProps = {
  children: ReactNode;
  href: string;
  type?: "primary" | "secondary";
  size?: "large" | "small";
  isScroll?: boolean;
};
export default function Button({
  children,
  href,
  type = "primary",
  size = "large",
  isScroll = false,
}: ButtonProps) {
  const base =
    "inline-block whitespace-nowrap font-medium transition duration-300";
  const typeClasses =
    type === "primary"
      ? "bg-cyan-800 text-white hover:bg-cyan-700"
      : `bg-transparent border-2 hover:bg-amber-600 hover:border-amber-600 hover:text-white 
   ${
     isScroll
       ? "border-gray-200/70 text-white"
       : "border-amber-600/70 text-amber-600"
   }`;
  const sizeClasses =
    size === "large"
      ? "px-6 py-3 rounded-xl text-base"
      : "px-3 py-2 rounded-lg text-sm";
  return (
    <Link href={href} className={`${base} ${typeClasses} ${sizeClasses}`}>
      {" "}
      {children}{" "}
    </Link>
  );
}
