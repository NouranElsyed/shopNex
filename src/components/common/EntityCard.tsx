import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface EntityCardProps {
  href: string;
  image: string;
  title: string;
  children?: ReactNode;
}

const EntityCard = ({ href, image, title, children }: EntityCardProps) => {
  return (
    <Link
      href={href}
      className="group block transition-all duration-300 h-full"
    >
      <div className="relative flex flex-col justify-between rounded-xl overflow-hidden h-full border border-[#79ac318a] transition-all duration-500 hover:shadow-md hover:shadow-[#79ac31]">
        <div className="flex flex-col w-full items-center">
          <div className="relative w-full h-[250px] overflow-hidden">
            <Image
              fill
              src={image}
              alt={title}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h3 className="my-3 font-semibold text-center px-7 text-[#79ac31]">
            {title}
          </h3>
          {children}
        </div>
      </div>
    </Link>
  );
};

export default EntityCard;
