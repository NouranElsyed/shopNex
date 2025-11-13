export const addressService = {
  getAddresses: async () => {
    const res = await fetch("/api/addresses", {
      method: "GET",
      credentials: "include",
    });
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
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to add address");
   
    }
    return res.json();
  },

 deleteAddress: async (id: string) => {
  console.log("%c🧨 Calling DELETE /api/addresses/" + id, "color: orange;");
console.log(id)
  const res = await fetch(`/api/addresses/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  console.log("%c📡 Delete response status:", "color: cyan;", res.status);
  let text;
  try {
    text = await res.text();
    console.log("%c📨 Delete raw response text:", "color: violet;", text);
  } catch (err) {
    console.error("⚠️ Failed to read response text", err);
  }

  if (!res.ok) {
    console.error("%c❌ DELETE failed:", "color: red;", res.statusText);
    throw new Error("Failed to delete address");
  }

  try {
    return JSON.parse(text!);
  } catch {
    return {};
  }
},
};