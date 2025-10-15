import { ICart } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";

interface CartState {
  cart: ICart | null;
  setCart: (cart: ICart) => void;
  updateCount: (
    productId: string,
    count: number,
    action: "plus" | "minus"
  ) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearCart: () => Promise<void>;
  deleteItem: (productId: string) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      setCart: (cart) => set({ cart }),

      updateCount: async (productId, currentCount, action) => {
        const { cart } = get();
        if (!cart?.data?.products) return;

        const products = [...cart.data.products];
        const productIndex = products.findIndex(
          (p) => p.product.id === productId
        );
        if (productIndex === -1) return;

        const newCount =
          action === "plus" ? currentCount + 1 : currentCount - 1;
        if (newCount < 1) return;

        products[productIndex].count = newCount;

        
        const newTotal = products.reduce(
          (sum, p) => sum + p.price * p.count,
          0
        );

        set({
          cart: {
            ...cart,
            data: {
              ...cart.data,
              products,
              totalCartPrice: newTotal,
            },
          },
        });

        
        try {
          const res = await fetch("/api/update-count", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, count: newCount, action }),
          });
          const response = await res.json();

          if (response.status !== "success") throw new Error();
          toast.success(action === "plus" ? " Added!" : " Removed!");
        } catch (error) {
          console.log(error)
          await get().fetchCart();
          toast.error("❕ Update failed!");
        }
      },

      fetchCart: async () => {
        try {
          const res = await fetch("/api/get-cart", { method: "GET" });
          const data = await res.json();
          if (data?.status === "success") {
            set({ cart: data });
          }
        } catch (error) {
          console.log(error);
        }
      },

      clearCart: async () => {
        
        set({ cart: null });

        try {
          const res = await fetch("/api/clear-cart", { method: "DELETE" });
          const response = await res.json();
          if (!response.success) throw new Error();
          toast.success("🛒 Cart cleared!");
        } catch {
          await get().fetchCart();
          toast.error("❕ Clear failed!");
        }
      },

      deleteItem: async (productId) => {
        const { cart } = get();
        if (!cart?.data?.products) return;

        const products = cart.data.products.filter(
          (p) => p.product.id !== productId
        );
        const newTotal = products.reduce(
          (sum, p) => sum + p.price * p.count,
          0
        );

        set({
          cart: {
            ...cart,
            data: {
              ...cart.data,
              products,
              totalCartPrice: newTotal,
            },
          },
        });

        try {
          const res = await fetch("/api/delete-itemcart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          });
          const response = await res.json();
          if (!response.success) throw new Error();
          toast.success("🗑️ Deleted!");
        } catch {
          await get().fetchCart();
          toast.error("❕ Delete failed!");
        }
      },
    }),
    { name: "cartStore" }
  )
);
