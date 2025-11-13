import { ReactNode } from "react";

interface EntityListProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const EntityList = ({ title, children, className = "" }: EntityListProps) => {
  return (
    <section className="w-11/12 md:w-9/10 lg:w-5/6 mx-auto mt-10 mb-20 flex flex-col gap-10 items-center">
      <h2 className="font-semibold text-3xl text-[#98c757] self-start">
        {title}
      </h2>
      <div
        className={`
          w-full grid grid-cols-1 gap-8 mx-4
          sm:grid-cols-2 sm:gap-6 sm:mx-0 
          md:grid-cols-3 md:gap-8 
          lg:grid-cols-3 lg:gap-10 
          xl:grid-cols-4 xl:gap-10
          items-stretch ${className}
        `}
      >
        {children}
      </div>
    </section>
  );
};

export default EntityList;
