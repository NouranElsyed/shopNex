export const addressService = {
  getAddresses: async () => {
    const res = await fetch("/api/addresses", {
      method: "GET",
      credentials: "include",
    });
    console.log("getAddresses ===>(in address Service)", res);
    if (!res.ok) throw new Error("Failed to fetch addresses");
    return res.json();
  },

  addAddress: async (address: {
    name: string;
    details: string;
    phone: string;
    city: string;
  }) => {
    const res = await fetch("/api/addresses", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });
    console.log("addAddress ===>( in address Service)", res);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to add address");
    }
    return res.json();
  },

  deleteAddress: async (id: string) => {
    const res = await fetch(`/api/addresses/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    console.log("deleteAddress res ===>(in address Service)", res);

    if (!res.ok) {
      console.error(
        "%c❌ DELETE failed:(deleteAddress-in address Service)",
        "color: red;",
        res.statusText
      );
      throw new Error("Failed to delete address");
    }
    return res.json();
  },
};
