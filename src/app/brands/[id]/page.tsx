"use client"
import { useParams } from "next/navigation";
import Loading from "@/src/components/ui/Loading";
import EntityDetails from "@/src/components/common/EntityDetails";
import { useApiQuery } from "@/src/hooks/useApiQuery";
import { fetchBrandById, fetchProducts } from "@/src/services/api.service";

const BrandDetailsPage = () => {
  const { id } = useParams();
  const { data: brand, isLoading: brandLoading } = useApiQuery(
    ["brand", id],
    () => fetchBrandById(id as string),
    { enabled: !!id }
  );

  const { data: productsRes, isLoading: prodLoading } = useApiQuery(
    ["products", "brand", id],
    () =>
      fetchProducts(1, 12, {
        brand: id as string,
      }),
    { enabled: !!id }
  );

  if (brandLoading || prodLoading) return <Loading />;

  return (
    <EntityDetails
      name={brand?.name || ""}
      image={brand?.image || "/placeholder.png"}
      products={productsRes?.data ?? []}
      totalProducts={productsRes?.results ?? 0}
      backLink="/brands"
      backText="Back to Brands"
      notFoundMessage="Brand not found"
    />
  );
};

export default BrandDetailsPage;