"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { api } from "@/config/api.config";
import ProductCard from "./components/ProductCard";
import { IProduct } from "@/interfaces";
import { Search } from "lucide-react";
import Loading from "@/components/ui/Loading";
import {
  SearchIcon,
} from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function Home() {
  // Queries
  const {
    data: categories,
    isSuccess: isCatSuccess,
    isLoading: isCatLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data: res } = await api.get("/categories");
        console.log("categories");
        console.log(res.data);
        return res.data ?? [];
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });
  const {
    data: products,
    isSuccess: isProdSuccess,
    isLoading: isProdLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const { data: res } = await api.get("/products?limit=12");
        console.log("products");
        console.log(res);
        return res.data ?? [];
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });
  if (isCatLoading || isProdLoading) return <Loading />;

  return (
    <header className="">
      {((isCatLoading || isProdLoading) && <Loading />) || (
        <>
          <div className="relative w-full h-[300px]  lg:h-[400px]">
            <Image
              fill
              alt="shopping-img"
              src="/header1.jpg"
              className="object-fill md:object-cover"
              priority
            />
          </div>

          <div className="px-6 md:w-4/5 mx-auto my-7 flex flex-wrap gap-5 items-center">
            <p className="font-semibold text-lg">Categories:</p>
            {isCatSuccess &&
              categories.map((category: { name: string; _id: number }) => (
                <p
                  key={category._id}
                  className="text-sm px-2 py-1 rounded-2xl bg-[#e8f0db]"
                >
                  {category.name}
                </p>
              ))}
          </div>

          <div className="w-7/8 md:w-9/10 lg:w-5/6 mx-auto mt-10 mb-20 flex flex-col gap-10 items-center">
            <p className="font-semibold text-3xl text-[#98c757] self-start">
              Products:
            </p>
            <div className="w-5/6 md:w-3/4 mx-auto flex gap-2 items-center rounded-lg bg-[#e8f0db] h-fit">
              <InputGroup>
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>
            </div>
            {
              <div className=
              {`w-5/7 grid grid-cols-1 gap-10 mx-15
              sm:grid-cols-2 sm:gap-5 sm:mx-0 
              md:w-9/10 md:grid-cols-3 md:gap-8 md:mx-0 
              lg:grid-cols-3 lg:gap-10 
              xl:grid-cols-4 xl:gap-10    
              items-stretch`}>
                {isProdSuccess &&
                  products.map((product: IProduct) => (
                    <div
                      className="hover:scale-101 transition-all duration-300"
                      key={product.id}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
              </div>
            }
          </div>
        </>
      )}
    </header>
  );
}
