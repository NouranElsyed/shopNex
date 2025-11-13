
export const wishlistService = {
  getWishlist: async () => {
    const res = await fetch("/api/wishlist", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
    });
    if (!res.ok) throw new Error("Failed to fetch wishlist");
    return res.json();
  },

  addToWishlist: async (productId: string) => {
    const res = await fetch("/api/wishlist/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
      credentials: "include", 
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Add failed");
    }
    return res.json();
  },

  removeFromWishlist: async (productId: string) => {
    const res = await fetch("/api/wishlist/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
      credentials: "include",
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Remove failed");
    }
    return res.json();
  },
};