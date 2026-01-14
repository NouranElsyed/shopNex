"use client";

import EntityList from "../common/EntityList";
import EntityCard from "../common/EntityCard";
import Loading from "../ui/Loading";
import { useApiQuery } from "@/src/hooks/useApiQuery";
import { fetchBrands } from "@/src/services/publicGet.service";
import { IBrand } from "@/src/interfaces";

const Brands = () => {
  const { data: brands = [], isLoading } = useApiQuery<IBrand[]>(
    ["brands"],
    fetchBrands
  );

  if (isLoading) return <Loading />;

  return (
    <EntityList title="Brands">
      {brands.map((brand) => (
        <EntityCard
          key={brand._id}
          href={`/brands/${brand._id}`}
          image={brand.image!}
          title={brand.name}
        />
      ))}
    </EntityList>
  );
};

export default Brands;
