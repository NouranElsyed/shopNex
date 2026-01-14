/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "../services/wishlist.service";
import { IProduct, IWishlist } from "../interfaces";

export function useWishlist() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
    staleTime: 1000 * 60,
  });

  const wishlistIds = new Set(data?.data.map((p:IProduct) => p.id));

  const mutation = useMutation({
    mutationFn: (productId: string) =>
      wishlistIds.has(productId)
        ? wishlistService.removeFromWishlist(productId)
        : wishlistService.addToWishlist(productId),

    onMutate: (productId) => {
      const prev = queryClient.getQueryData<IWishlist>(["wishlist"]);

      if (!prev) return;

      queryClient.setQueryData<IWishlist>(["wishlist"], {
        ...prev,
        count: wishlistIds.has(productId)
          ? prev.count - 1
          : prev.count + 1,
        data: wishlistIds.has(productId)
          ? prev.data.filter(p => p.id !== productId)
          : [{ id: productId } as any, ...prev.data],
      });

      return prev;
    },

    onError: (_e, _id, prev) => {
      if (prev) queryClient.setQueryData(["wishlist"], prev);
    },
  });

  return {
    wishlistIds,
    toggleWishlist: mutation.mutate,
    loadingId: mutation.variables,
    isLoading: mutation.isPending,
  };
}
