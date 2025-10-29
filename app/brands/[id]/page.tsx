
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/config/api.config";
import {  IBrand, IProduct } from "@/interfaces";
import { toast } from "react-toastify";
import Image from "next/image";

import Loading from "@/components/ui/Loading";
import Link from "next/link";
import ProductCard from "@/app/_components/ProductCard";

const BrandDetails = () => {
  const { id } = useParams();


  const {
    data: brand,
    isLoading: brandLoading,
    isError: brandError,
  } = useQuery({
    queryKey: ["brand", id],
    queryFn: async (): Promise<IBrand> => {
      const { data } = await api.get(`/brands/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  const { data: productsRes, isLoading: prodLoading } = useQuery({
    queryKey: ["products", "brand", id],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: "12",
        page: "1",
        brand: id as string,
      });
      const { data } = await api.get(`/products?${params}`);
      return data;
    },
    enabled: !!id,
  });

  const products: IProduct[] = productsRes?.data ?? [];
  const totalProducts = productsRes?.results ?? 0;

  if (brandLoading || prodLoading) return <Loading />;

  if (brandError || !brand) {
    toast.error("Brand not found");
    return <div className="text-center py-20 text-xl text-[#c8e49f]" >Brand not found</div>;
  }

  return (
    <div className="w-11/12 md:w-9/10 lg:w-5/6 mx-auto mt-10 mb-20">
   
      <Link
        href="/brands"
        className="inline-flex items-center gap-2 text-[#98c757] hover:underline mb-6"
      >
        Back to Brands
      </Link>

   
      <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
        <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-[#98c757]/20">
          <Image
            fill
            src={brand.image || "/placeholder.png"}
            alt={brand.name}
            className="object-contain p-4"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-[#98c757] mb-2">
            {brand.name}
          </h1>
          <p className="text-gray-600">
            {totalProducts} {totalProducts === 1 ? "product" : "products"}{" "}
            available
          </p>
        </div>
      </div>

     
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20rounded-lg">
          <p className=" text-xl text-[#c8e49f]">
            No products for this brand yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default BrandDetails;
