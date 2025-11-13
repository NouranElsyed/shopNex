import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/src/services/api.service";

const PAGE_SIZE = 16;

export const useProducts = (page: number) => {
  return useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });
};