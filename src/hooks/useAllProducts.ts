/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/src/services/api.service";

export const useAllProducts = () => {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const all: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await fetchProducts(page, 100);
        all.push(...res.data);
        hasMore = res.data.length === 100;
        page++;
      }

      return all;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};