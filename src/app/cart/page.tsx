"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/src/hooks/useCart";
import { AnimatedButton } from "@/src/components/ui/custom/MotionButton";
import { formatPrice } from "@/src/utils/formatPrice";
import { useAuthRedirect } from "@/src/hooks/useAuthRedirect";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  useAuthRedirect({ requireAuth: true, redirectTo: "/login" });

  const {
    cart,
    isLoading,
    updateCount,
    deleteItem,
    clearCart,
    isClearing,
    isPendingForProduct,
  } = useCart();

  const products = cart?.products ?? [];
  const isEmpty = products.length === 0;

  const totalPrice =
    isLoading ||
    cart?.totalCartPrice == null ||
    Number.isNaN(cart.totalCartPrice)
      ? "... EGP"
      : `${formatPrice(cart.totalCartPrice)} EGP`;

  // 🔍 debug log
  console.log("🛒 Cart Debug Info");
  console.log("Products count:", products.length);
  console.log("Cart data:", cart);
  console.log("-----------------------------------");

  return (
    <div className="w-10/12 lg:w-full max-w-4xl mx-auto mt-10 mb-20 p-6 bg-white rounded-2xl shadow-lg border border-[#79ac3123]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="font-bold text-2xl text-[#659226] flex items-center gap-2">
          <ShoppingCart size={28} />
          Cart Total:{" "}
          <span className="text-[#79ac31] text-xl">{totalPrice}</span>
          {isLoading && (
            <span className="text-sm text-gray-500 ml-2 animate-pulse">
              (Loading...)
            </span>
          )}
        </h1>

        {!isEmpty && (
          <div className="flex gap-3 mt-4 md:mt-0">
            <AnimatedButton
              onClick={() => router.push("/checkout")}
              className="px-6 py-2.5 font-medium rounded-lg transition-all"
              whileTap={{ scale: 0.95 }}
            >
              Checkout
            </AnimatedButton>

            <AnimatedButton
              onClick={() => clearCart()}
              disabled={isClearing}
              whileTap={isClearing ? {} : { scale: 0.95 }}
              className="px-6 py-2.5  border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isClearing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-red text-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Clearing...
                </span>
              ) : (
                "Clear Cart"
              )}
            </AnimatedButton>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-2 text-[#79ac31]">
            <div className="w-5 h-5 border-2 border-[#79ac31] border-t-transparent rounded-full animate-spin" />
            <span className="text-lg">Loading your cart...</span>
          </div>
        </div>
      ) : isEmpty ? (
        <div className="text-center py-16">
          <ShoppingCart size={64} className="mx-auto text-[#79ac31b8] mb-4" />
          <p className="text-xl text-[#79ac31] font-medium">
            Your cart is empty
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Add some products to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {products.map(
              (item: {
                _id: string;
                count: number;
                price: number;
                product: {
                  id: string;
                  title: string;
                  imageCover: string;
                  category?: { name: string };
                };
              }) => {
                const { _id, count, product, price } = item;
                const isPending = isPendingForProduct(product.id);
                console.log("Product:", product.title);
                console.log(" - product.id:", product.id);
                console.log(" - item._id:", _id);
                console.log(" - count:", count);
                console.log(" - isPending:", isPending);
                console.log("-----------------------------------");

                const unitPrice = price / count;
                const itemTotal = unitPrice * count;
                const formattedItemTotal = formatPrice(itemTotal);

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      x: -100,
                      transition: { duration: 0.2 },
                    }}
                    className="border-b border-gray-200 pb-6 last:border-b-0  flex flex-col justify-center items-center "
                  >
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center  w-full ">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <div className="w-35 h-50 sm:w-28 sm:h-28 md:w-24 md:h-24 border-2 border-green-800/15 rounded-lg overflow-hidden">
                          <Image
                            src={product.imageCover}
                            alt={product.title}
                            width={120}
                            height={120}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      {/* Details */}
                      <div className="flex-1  flex items-center justify-center flex-col  md:items-start">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 text-center">
                          {product.title}
                        </h3>
                        {product.category?.name && (
                          <p className="text-sm text-[#79ac31] mt-1">
                            {product.category.name}
                          </p>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-center gap-3 mt-3">
                          <motion.button
                            whileTap={
                              isPending || count === 1 ? {} : { scale: 0.85 }
                            }
                            disabled={isPending || count === 1}
                            onClick={() => {
                              console.log(
                                "🟠 Minus clicked for:",
                                product.title
                              ); // 🔍
                              updateCount({
                                productId: product.id,
                                count,
                                action: "minus",
                              });
                            }}
                            className={`p-1.5 rounded-lg border transition-all ${
                              count > 1 && !isPending
                                ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white cursor-pointer"
                                : "border-gray-300 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <Minus size={16} />
                          </motion.button>

                          <span
                            className={`font-bold text-lg w-10 text-center ${
                              isPending ? "text-gray-400" : "text-gray-900"
                            }`}
                          >
                            {isPending ? "..." : count}
                          </span>

                          <motion.button
                            whileTap={isPending ? {} : { scale: 0.85 }}
                            disabled={isPending}
                            onClick={() => {
                              console.log(
                                "🟢 Plus clicked for:",
                                product.title
                              ); // 🔍
                              updateCount({
                                productId: product.id,
                                count,
                                action: "plus",
                              });
                            }}
                            className={`p-1.5 rounded-lg transition-all border ${
                              !isPending
                                ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white cursor-pointer"
                                : "border-gray-300 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <Plus size={16} />
                          </motion.button>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex flex-col items-center lg:items-end gap-2">
                        <div className="lg:text-right">
                          <p className="text-sm text-[#79ac31] font-medium">
                            EGP{" "}
                            <span className="font-bold text-lg">
                              {formattedItemTotal}
                            </span>
                          </p>
                        </div>

                        <AnimatedButton
                          onClick={() => {
                            console.log(
                              "❌ Remove clicked for:",
                              product.title
                            ); // 🔍
                            deleteItem(product.id);
                          }}
                          disabled={isPending}
                          whileTap={isPending ? {} : { scale: 0.9 }}
                          className="px-3 py-1.5 border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-sm rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isPending ? (
                            <span className="flex gap-2 items-center">
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Removing...
                            </span>
                          ) : (
                            <span className="flex gap-2 items-center">
                              <Trash2 size={14} />
                              Remove
                            </span>
                          )}
                        </AnimatedButton>
                      </div>
                    </div>
                  </motion.div>
                );
              }
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
