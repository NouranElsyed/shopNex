"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Loading from "@/src/components/ui/Loading";
import EntityDetails from "@/src/components/common/EntityDetails";
import { fetchBrandById } from "@/src/services/api.service";
import { api } from "@/src/config/api.config";

const BrandDetailsPage = () => {
  const { id } = useParams();


  const {
    data: brand,
    isLoading: brandLoading,
    isError: brandError,
  } = useQuery({
    queryKey: ["brand", id],
    queryFn: () => fetchBrandById(id as string),
    enabled: !!id,
  });

  const {
    data: productsRes,
    isLoading: prodLoading,
  } = useQuery({
    queryKey: ["products", "brand", id],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: "1",
        limit: "12",
        "brand[in]": id as string, 
      });
      const { data } = await api.get(`/products?${params}`);
      return data;
    },
    enabled: !!id,
  });


  if (brandLoading || prodLoading) return <Loading />;


  if (brandError || !brand) {
    toast.error("Brand not found");
    return (
      <div className="text-center py-20 text-xl text-[#c8e49f]">
        Brand not found
      </div>
    );
  }

  const products = productsRes?.data ?? [];
  const totalProducts = productsRes?.results ?? 0;

  return (
    <EntityDetails
      name={brand.name}
      image={brand.image || "/placeholder.png"}
      products={products}
      totalProducts={totalProducts}
      backLink="/brands"
      backText="Back to Brands"
      notFoundMessage="No products in this brand yet."
    />
  );
};

export default BrandDetailsPage;