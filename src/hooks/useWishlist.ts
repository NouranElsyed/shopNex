import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IWishlist, IProduct } from "../interfaces";
import { wishlistService } from "../services/wishlist.service";

export function useWishlist() {
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
    staleTime: 1000 * 60,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) => wishlistService.addToWishlist(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previous = queryClient.getQueryData<IWishlist>(["wishlist"]);

  
      const productCache = queryClient.getQueryData<IProduct>([
        "product",
        productId,
      ]);

      if (previous && productCache) {
        queryClient.setQueryData(["wishlist"], {
          ...previous,
          count: previous.count + 1,
          data: [productCache, ...previous.data],
        });
      }

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["wishlist"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

const isTogglingWishlist = (productId: string) =>
  (addToWishlistMutation.isPending && addToWishlistMutation.variables === productId) ||
  (removeFromWishlistMutation.isPending && removeFromWishlistMutation.variables === productId);

  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: string) => wishlistService.removeFromWishlist(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previous = queryClient.getQueryData<IWishlist>(["wishlist"]);

      if (previous) {
        queryClient.setQueryData(["wishlist"], {
          ...previous,
          count: previous.count - 1,
          data: previous.data.filter((p) => p.id !== productId),
        });
      }

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["wishlist"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const toggleWishlist = (productId: string) => {
    const isInWishlist = wishlist?.data.some((p:IProduct) => p.id === productId);
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId);
    }
  };

  return {
    wishlist: wishlist?.data || [],
    count: wishlist?.count || 0,
    isLoading,
    isEmpty: (wishlist?.count || 0) === 0,

    addToWishlist: addToWishlistMutation.mutate,
    isAdding: addToWishlistMutation.isPending,

    removeFromWishlist: removeFromWishlistMutation.mutate,
    isRemoving: removeFromWishlistMutation.isPending,
isTogglingWishlist,
    toggleWishlist,
    isToggling: (productId: string) =>
      (addToWishlistMutation.isPending &&
        addToWishlistMutation.variables === productId) ||
      (removeFromWishlistMutation.isPending &&
        removeFromWishlistMutation.variables === productId),

    isInWishlist: (productId: string) =>
      wishlist?.data.some((p:IProduct) => p.id === productId) || false,
  };
}