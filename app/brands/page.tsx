"use client";
import { api } from "@/config/api.config";
import { IAxiosError, IBrand } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import Loading from "@/components/ui/Loading";
import Link from "next/link";

const Brands = () => {
  const {
    data: brands,
    isSuccess: isBrandsSuccess,
    isLoading: isBrandsLoading,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const { data: res } = await api.get("/brands");
        console.log(res);
        return res.data ?? [];
      } catch (error) {
        const AxiosErr = error as AxiosError<IAxiosError>;
        toast(
          `❕${AxiosErr?.response?.data?.message || "Something went wrong"}`,
          {
            position: "top-right",
            autoClose: 4000,
            theme: "colored",
            style: {
              width: "100%",
              textAlign: "center",
              backgroundColor: "#EF5350",
              color: "white",
              fontWeight: "500",
              margin: "7px 0",
            },
          }
        );
      }
    },
  });
  console.log(brands, isBrandsSuccess, isBrandsLoading);
  if (isBrandsLoading) return <Loading />;
  return (
    <div className="w-7/8 md:w-9/10 lg:w-5/6 mx-auto mt-10 mb-20 flex flex-col gap-10 items-center">
      <p className="font-semibold text-3xl text-[#98c757] self-start">
        Brands:
      </p>
      {
        <>
          <div
            className={`w-5/7 grid grid-cols-1 gap-10 mx-15
              sm:grid-cols-2 sm:gap-5 sm:mx-0 
              md:w-9/10 md:grid-cols-3 md:gap-8 md:mx-0 
              lg:grid-cols-3 lg:gap-10 
              xl:grid-cols-4 xl:gap-10    
              items-stretch`}
          >
            {isBrandsSuccess &&
              brands.map((brand: IBrand) => (
                <Link
                  href={`/brands/${brand._id}`}
                  key={brand._id}
                  className="hover:scale-101 transition-all duration-300"
                >
                  <div className="product relative flex flex-col justify-between rounded-xl overflow-hidden h-full border-1 transition-all duration-500 border-[#79ac318a] hover:shadow-md hover:shadow-[#79ac31] ">
                    <div className="flex flex-col w-full items-center">
                      <div className="relative w-full h-[250px]  overflow-hidden">
                        <Image
                          fill
                          src={`${brand.image}`}
                          alt={brand?.name}
                        ></Image>
                      </div>
                      <h3 className="my-3 font-semibold text-center px-7 text-[#79ac31]">
                        {brand.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </>
      }
    </div>
  );
};

export default Brands;
