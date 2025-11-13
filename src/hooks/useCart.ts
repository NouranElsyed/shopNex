import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ICart, IProduct } from "../interfaces";
import { cartService } from "../services/cart.service";

export function useCart() {
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    staleTime: 1000 * 30,
  });
const updateCountMutation = useMutation({
  mutationFn: ({
    productId,
    count,
    action,
  }: {
    productId: string;
    count: number;
    action: "plus" | "minus";
  }) => cartService.updateCount(productId, count, action),

  onMutate: async ({ productId, count, action }) => {
    await queryClient.cancelQueries({ queryKey: ["cart"] });

    const previous = queryClient.getQueryData<ICart>(["cart"]);
    if (!previous?.data) return { previous };

    const productItem = previous.data.products.find(
      (p) => p.product.id === productId
    );
    if (!productItem) return { previous };

    const price = productItem.product.price;

    const newCount =
      action === "plus" ? count + 1 : Math.max(1, count - 1);

    const priceChange = action === "plus" ? price : -price;

    queryClient.setQueryData(["cart"], {
      ...previous,
      data: {
        ...previous.data,
        products: previous.data.products.map((p) =>
          p.product.id === productId
            ? { ...p, count: newCount }
            : p
        ),
        totalCartPrice:
          previous.data.totalCartPrice + priceChange,
      },
    });

    return { previous, newCount };
  },

  onError: (_err, _vars, context) => {
    if (context?.previous) {
      queryClient.setQueryData(["cart"], context.previous);
    }
  },

  onSuccess: async(data, vars, ctx) => {
    if (data?.data) {
      queryClient.setQueryData(["cart"], (old: ICart | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            products: old.data.products.map((p) =>
              p.product.id === vars.productId
                ? { ...p, count: ctx?.newCount ?? p.count }
                : p
            ),
          },
        };
      });
    }

  await queryClient.invalidateQueries({ queryKey: ["cart"] });
  },
});
  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => cartService.addCart(productId),

    onMutate: async (productId): Promise<{ previous: ICart | undefined }> => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<ICart>(["cart"]);

      if (!previousCart?.data) {
        return { previous: previousCart };
      }

      const productCache = queryClient.getQueryData<IProduct>([
        "product",
        productId,
      ]);
      const productPrice = productCache?.price ?? 0;

      const existingProduct = previousCart.data.products.find(
        (p) => p.product.id === productId
      );

      const newProducts = existingProduct
        ? previousCart.data.products.map((p) =>
            p.product.id === productId ? { ...p, count: p.count + 1 } : p
          )
        : [
            ...previousCart.data.products,
            {
              product: {
                id: productId,
                name: "",
                price: productPrice,
                images: [],
              },
              count: 1,
            },
          ];

      const addedPrice = existingProduct
        ? existingProduct.product.price
        : productPrice;

      queryClient.setQueryData(["cart"], {
        ...previousCart,
        data: {
          ...previousCart.data,
          products: newProducts,
          totalCartPrice: previousCart.data.totalCartPrice + addedPrice,
        },
      });

      return { previous: previousCart };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["cart"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (productId: string) =>
      cartService.deleteItemFromCart(productId),

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<ICart>(["cart"]);

      if (previous) {
        const productToRemove = previous.data.products.find(
          (p) => p.product.id === productId
        );
        queryClient.setQueryData(["cart"], {
          ...previous,
          data: {
            ...previous.data,
            products: previous.data.products.filter(
              (p) => p.product.id !== productId
            ),
            totalCartPrice:
              previous.data.totalCartPrice -
              (productToRemove
                ? productToRemove.count * productToRemove.product.price
                : 0),
          },
        });
      }

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["cart"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<ICart>(["cart"]);
      return { previous };
    },

    onSuccess: () => {
      queryClient.setQueryData(["cart"], {
        data: { products: [], totalCartPrice: 0 },
      });
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["cart"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  

  return {
    cart: cart?.data,
    isLoading,
    isCartEmpty: (cart?.data?.products?.length ?? 0) === 0,


    updateCount: updateCountMutation.mutate,
    isUpdatingCount: updateCountMutation.isPending,

 
    addToCart: addToCartMutation.mutate,
    isAddingToCart: (productId: string): boolean =>
      addToCartMutation.isPending && addToCartMutation.variables === productId,

    deleteItem: deleteItemMutation.mutate,
    isDeletingItem: deleteItemMutation.isPending,


    clearCart: clearCartMutation.mutate,
    isClearing: clearCartMutation.isPending,


    isPendingForProduct: (productId: string): boolean => {
      return (
        (updateCountMutation.variables?.productId === productId &&
          updateCountMutation.isPending) ||
        (deleteItemMutation.variables === productId &&
          deleteItemMutation.isPending) ||
        (addToCartMutation.variables === productId &&
          addToCartMutation.isPending)
      );
    },
  };
}
