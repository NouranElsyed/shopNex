import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/src/services/publicGet.service";

export const useAllProducts = () => {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const all = [];
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
    staleTime: 5 * 60 * 1000,
  });
};
