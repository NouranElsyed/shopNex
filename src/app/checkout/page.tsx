"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Check, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/src/hooks/useCart";
import { useAddresses } from "@/src/hooks/useAddresses";
import { useCheckout } from "@/src/hooks/useCheckout";
import { useAuthRedirect } from "@/src/hooks/useAuthRedirect";
import { AnimatedButton } from "@/src/components/ui/custom/MotionButton";
import { formatPrice } from "@/src/utils/formatPrice";
import { IProductCart, ShippingAddress } from "@/src/interfaces";
import Loading from "@/src/components/ui/Loading";

export default function CheckoutPage() {
  useAuthRedirect({ requireAuth: true, redirectTo: "/login" });

  const { cart, isLoading: cartLoading } = useCart();
  const {
    addresses,
    isLoading: addrLoading,
    addAddress,
    isAdding,
    deleteAddress,
  } = useAddresses();
  const { checkout, isCheckingOut } = useCheckout();
  const router = useRouter();

  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentMethod] = useState<"cash" | "online">("cash");
  const [newAddress, setNewAddress] = useState({
    name: "",
    details: "",
    phone: "",
    city: "",
  });
  console.log(addresses);
  const products = cart?.products ?? [];
  const totalPrice = cart?.totalCartPrice ?? 0;
const handleAddAddress = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("%c🟢 Submitting new address:", "color: lime;", newAddress);

  addAddress(newAddress, {
    onSuccess: (res) => {
      console.log("%c✅ Add success callback triggered:", "color: green;", res);
      const newAddr = res.data;
      if (!newAddr) {
        console.warn("⚠️ No newAddr in response:", res);
      } else {
        console.log("%c📦 New address object:", "color: cyan;", newAddr);
      }

      setSelectedAddress(newAddr?._id || "");
      setShowAddForm(false);
      setNewAddress({ name: "", details: "", phone: "", city: "" });
    },
    onError: (err) => {
      console.error("%c❌ Add address failed:", "color: red;", err);
    },
  });
};
  const handleCheckout = () => {
    if (!selectedAddress || !cart?._id) return;

    const address = addresses.find(
      (a: ShippingAddress) => a._id === selectedAddress
    );
    const returnUrl = `${window.location.origin}/order-success`;

    checkout(
      { cartId: cart._id, shippingAddress: address, returnUrl },
      {
        onSuccess: (data) => {
          if (paymentMethod === "online" && data.session?.url) {
            window.location.href = data.session.url;
          } else {
            router.push(`/order-success?orderId=${data.order?._id}`);
          }
        },
      }
    );
  };

  if (cartLoading || addrLoading) {
    return (
      <div className="flex justify-center w-full flex-1">
        <Loading />
      </div>
    );
  }

  if (!cart || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-500">Your cart is empty</p>
        <button
          onClick={() => router.push("/cart")}
          className="mt-4 text-green-600 underline"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 mb-20 p-6 bg-white rounded-2xl shadow-lg border border-green-100">
      <h1 className="text-2xl font-bold text-green-700 mb-8 flex items-center gap-2">
        <MapPin size={28} /> Checkout
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Addresses */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Shipping Address</h2>
              <AnimatedButton onClick={() => setShowAddForm(true)} size="sm">
                <span className="flex items-center gap-2">
                  <Plus size={16} />
                  <span> Add New</span>
                </span>
              </AnimatedButton>
            </div>

            {addresses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No saved addresses
              </p>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {addresses.map((addr: ShippingAddress) => (
                    <motion.div
                      key={addr._id}
                      layout
                      className={`relative p-4 border rounded-xl cursor-pointer transition-all  duration-200 
                              ${
                                selectedAddress === addr._id
                                  ? "border-green-600 bg-green-50 shadow-sm ring-2 ring-green-200 ring-opacity-50"
                                  : "border-gray-300 hover:border-green-400 hover:shadow-sm "
                              }`}
                      onClick={() => setSelectedAddress(addr._id)}
                    >
                      {/* Checkbox Custom */}
                      <div className="absolute top-4 left-4 ">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all 
                              ${
                                selectedAddress === addr._id
                                  ? "border-green-600 bg-green-600"
                                  : "border-gray-400 bg-white"
                              }`}
                        >
                          {selectedAddress === addr._id && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>

                      {/* Address Info */}
                      <div className="pl-12 pr-10">
                        <p className="font-semibold text-gray-900">
                          {addr.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {addr.details}
                        </p>
                        <p className="text-sm text-gray-600">
                          {addr.city} • {addr.phone}
                        </p>
                      </div>

                      {/* Delete Button (only on selected) */}
                      {selectedAddress === addr._id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAddress(addr._id);
                            setSelectedAddress("")
                          }}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors "
                          aria-label="Delete address"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Add Address */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="border-t pt-6"
              >
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <input
                    placeholder="Name (e.g. Home)"
                    required
                    value={newAddress.name}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    placeholder="Details"
                    required
                    value={newAddress.details}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, details: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="City"
                      required
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="px-4 py-2 border rounded-lg"
                    />
                    <input
                      placeholder="Phone"
                      required
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                      className="px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <AnimatedButton type="submit" disabled={isAdding}>
                      {isAdding ? "Saving..." : "Save"}
                    </AnimatedButton>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-red-600 border border-red-600 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-6 rounded-xl h-fit">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
            {products.map((item: IProductCart) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.product.title} × {item.count}
                </span>
                <span>{formatPrice(item.price)} EGP</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-green-600">
                {formatPrice(totalPrice)} EGP
              </span>
            </div>
          </div>
          <AnimatedButton
            onClick={handleCheckout}
            disabled={!selectedAddress || isCheckingOut}
            className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg disabled:opacity-50"
          >
            {isCheckingOut ? "Processing..." : "Confirm Order"}
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
