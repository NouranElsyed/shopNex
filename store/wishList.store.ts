import { IProduct } from "@/interfaces";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface wishListState {
  wishList: { count: number; data: IProduct[] } | null;
  fetchwishList: () => Promise<{ count: number; data: IProduct[] } | null>;
  addToWishList: (productId: string) => Promise<void>;
  removeFromWishList: (productId: string) => Promise<void>;
  toggleWishList: (productId: string) => Promise<void>;
}

export const useWishListStore = create<wishListState>()(
  persist(
    (set, get) => ({
      wishList: null,

      fetchwishList: async () => {
        try {
          const res = await fetch("/api/get-wishlist", { method: "GET" });
          const response = await res.json();

          if (response.status === "success" && response.data) {
            const newState = { count: response.count, data: response.data };
            set({ wishList: newState });
            return newState;
          } else {
            set({ wishList: null });
            return null;
          }
        } catch (error) {
          console.log(error);
          set({ wishList: null });
          return null;
        }
      },

      addToWishList: async (productId) => {
        const { wishList } = get();
        if (!wishList) return;

        const updatedData = [...(wishList.data || [])];
        const exists = updatedData.find((p) => p.id === productId);

        if (!exists) {
          updatedData.push({
            id: productId,
            title: "Loading...",
            imageCover: "",
          } as IProduct);
          set({
            wishList: {
              ...wishList,
              count: wishList.count + 1,
              data: updatedData,
            },
          });
        }

        try {
          const res = await fetch("/api/add-to-wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          });
          const response = await res.json();

          if (response.status !== "success") throw new Error();
          toast.success(`✅ ${response.message}`);

          await get().fetchwishList();
        } catch (error) {
          console.log(error);
          await get().fetchwishList();
          toast.error("❕ Add failed!");
        }
      },

      removeFromWishList: async (productId) => {
        const { wishList } = get();
        if (!wishList) return;

        const updatedData = wishList.data.filter((p) => p.id !== productId);
        set({
          wishList: {
            ...wishList,
            count: wishList.count - 1,
            data: updatedData,
          },
        });

        try {
          const res = await fetch("/api/remove-from-wishlist", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          });
          const response = await res.json();
          console.log(response);
          const isSuccess = response.success === true;
          console.log(isSuccess);
          if (!isSuccess) throw new Error();
          toast.success(`🗑️ ${response.message}`);
        } catch {
          await get().fetchwishList();
          toast.error("❕ Remove failed!");
        }
      },

      toggleWishList: async (productId) => {
        const current = get().wishList;
        const isInList = current?.data?.some((p) => p.id === productId);

        if (isInList) {
          await get().removeFromWishList(productId);
        } else {
          await get().addToWishList(productId);
        }
      },
    }),
    { name: "wishListStore" }
  )
);
