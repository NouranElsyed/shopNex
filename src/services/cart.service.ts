
export const cartService = {
  getCart: async () => {
    const res = await fetch("/api/cart", {
      method: "GET",
      credentials: "include", 
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to fetch cart");
    return res.json();
  },

getCount: async () => {
  const res = await fetch("/api/cart", {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch cart count");

  const data = await res.json();
  console.log("Hellllo",data.numOfCartItems)
  return data.numOfCartItems; 
},

  addCart: async (productId: string) => {
    const res = await fetch("/api/cart/add-to-cart", {
      method: "POST",
      credentials: "include", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) throw new Error("Add failed");
    return res.json();
  },

  deleteItemFromCart: async (productId: string) => {
    const res = await fetch("/api/cart/delete-itemcart", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) throw new Error("Delete failed");
    return res.json();
  },

  clearCart: async () => {
    const res = await fetch("/api/cart/clear-cart", {
      method: "DELETE",
      credentials: "include", 
    });
    if (!res.ok) throw new Error("Clear failed");
    return res.json();
  },

  updateCount: async (productId: string, currentCount: number, action: "plus" | "minus") => {
    const newCount = action === "plus" ? currentCount + 1 : Math.max(1, currentCount - 1);

    const res = await fetch("/api/cart/update-count", {
      method: "PUT",
      credentials: "include", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, count: newCount }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Update failed");
    }

    return res.json();
  },
  
}
