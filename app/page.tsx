"use client";

import { useQuery } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import Image from "next/image";
import { api } from "@/config/api.config";
import ProductCard from "./components/ProductCard";
import { IProduct } from "@/interfaces";
import Footer from "./components/Footer";
import { Search } from "lucide-react";

export default function Home() {
  // Queries
  const { data: categories, isSuccess: isCatSuccess } = useQuery({
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
  const { data: products, isSuccess: isProdSuccess } = useQuery({
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

  return (
    <header className="max-h-screen">
      <Navbar></Navbar>
      <div className="relative w-full h-[300px]  lg:h-[400px]">
        <Image
          fill
          alt="shopping-img"
          src="/header1.jpg"
          className="object-fill md:object-cover"
          priority
        />
      </div>
      {/* { categories} */}
      <div className="px-6 md:w-4/5 mx-auto my-7 flex flex-wrap gap-5 items-center">
        <p className="font-semibold text-lg">Categories:</p>
        {isCatSuccess &&
          categories.map((category: { name: string; _id: number }) => (
            <p
              key={category._id}
              className="text-lg px-2 py-1 rounded-2xl bg-[#e8f0db]"
            >
              {category.name}
            </p>
          ))}
      </div>

      {/* { products} */}
      <div className="w-5/6 lg:w-3/4 mx-auto mt-10 mb-20 flex flex-col gap-10 items-center">
        <p className="font-semibold text-3xl text-[#98c757] self-start">
          Products:
        </p>
        <div className="w-3/4 mx-auto flex gap-2 items-center rounded-2xl bg-[#e8f0db] px-3 py-2 h-fit">
          <Search className="text-[#79ac31]"></Search>
          <input type="text" placeholder="Search..."  className="focus:outline-none flex-1"/>
        </div>
        <div className="grid grid-cols-1 gap-15 md:grid-cols-2 md:gap-15 lg:grid-cols-3 lg:gap-10 xl:grid-cols-4 xl:gap-10 mx-10 sm:mx-30 md:mx-5 items-stretch">
          {isProdSuccess &&
            products.map((product: IProduct) => (
              <div
                className="hover:scale-105 transition-all duration-300"
                key={product.id}
              >
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </header>
  );
}
