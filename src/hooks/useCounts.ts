// src/hooks/useCounts.ts
import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/src/services/cart.service";

export function useCounts() {
  const { data: wishlistCount = 0 } = useQuery({
    queryKey: ["wishlist", "count"],
    queryFn: async () => {
      const res = await fetch("/api/wishlist", { credentials: "include" });
      if (!res.ok) return 0;
      const data = await res.json();
      return data.count || 0;
    },
    staleTime: 1000 * 30,
  });

const { data: cartData } = useQuery({
  queryKey: ["cart", "count"],
  queryFn: cartService.getCount,
  staleTime: 1000 * 30,
});

const cartCount = cartData || 0; 

  return { wishlistCount, cartCount };
}