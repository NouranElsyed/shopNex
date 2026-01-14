"use client";

import EntityList from "../common/EntityList";
import EntityCard from "../common/EntityCard";
import Loading from "../ui/Loading";
import { useApiQuery } from "@/src/hooks/useApiQuery";
import { fetchCategories } from "@/src/services/publicGet.service";
import { ICategory } from "@/src/interfaces";

const Categories = () => {
  const { data: categories = [], isLoading } = useApiQuery<ICategory[]>(
    ["categories"],
    fetchCategories
  );

  if (isLoading) return <Loading />;

  return (
    <EntityList title="Categories">
      {categories.map((category) => (
        <EntityCard
          key={category._id}
          href={`/categories/${category._id}`}
          image={category.image!}
          title={category.name}
        />
      ))}
    </EntityList>
  );
};

export default Categories;
