"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { api } from "@/src/config/api.config";
import { IAxiosError, IBrand } from "@/src/interfaces";
import Loading from "@/src/components/ui/Loading";

const fetchBrands = async (): Promise<IBrand[]> => {
  try {
    const { data: res } = await api.get("/brands");
    return res.data ?? [];
  } catch (error) {
    const AxiosErr = error as AxiosError<IAxiosError>;
    const message = AxiosErr?.response?.data?.message || "Something went wrong";
    toast.error(`Error: ${message}`, {
      position: "top-right",
      autoClose: 4000,
      theme: "colored",
      style: {
        backgroundColor: "#EF5350",
        color: "white",
        fontWeight: 500,
      },
    });
    throw error; 
  }
};

const Brands = () => {
  const {
    data: brands,
    isLoading,
    isSuccess,
  } = useQuery<IBrand[]>({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    staleTime: 5 * 60 * 1000, 
  });

  if (isLoading) return <Loading />;

  return (
    <div className="w-7/8 md:w-9/10 lg:w-5/6 mx-auto mt-10 mb-20 flex flex-col gap-10 items-center">
      <p className="font-semibold text-3xl text-[#98c757] self-start">
        Brands:
      </p>

      <div
        className={`
          w-5/7 grid grid-cols-1 gap-10 mx-4
          sm:grid-cols-2 sm:gap-5 sm:mx-0 
          md:w-9/10 md:grid-cols-3 md:gap-8 md:mx-0 
          lg:grid-cols-3 lg:gap-10 
          xl:grid-cols-4 xl:gap-10    
          items-stretch
        `}
      >
        {isSuccess &&
          brands?.map((brand) => (
            <Link
              href={`/brands/${brand._id}`}
              key={brand._id}
              className="group block transition-all duration-300"
            >
              <div className="relative flex flex-col justify-between rounded-xl overflow-hidden h-full border border-[#79ac318a] transition-all duration-500 hover:shadow-md hover:shadow-[#79ac31]">
                <div className="flex flex-col w-full items-center">
                  <div className="relative w-full h-[250px] overflow-hidden">
                    <Image
                      fill
                      src={brand.image!}
                      alt={brand.name}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="my-3 font-semibold text-center px-7 text-[#79ac31]">
                    {brand.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Brands;