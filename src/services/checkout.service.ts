/* eslint-disable @typescript-eslint/no-explicit-any */
export const checkoutService = {
  createSession: async ({
    cartId,
    shippingAddress,
    returnUrl,
  }: {
    cartId: string;
    shippingAddress: any;
    returnUrl: string;
  }) => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId, shippingAddress, returnUrl }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Checkout failed");
    }
    return res.json();
  },
};
