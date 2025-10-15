"use client";
import { useCartStore } from "@/store/cart.store";
import React, { Fragment } from "react";
import Image from "next/image";
import { IProduct } from "@/interfaces";
import { AnimatedButton } from "@/components/ui/customButton/MotionButton";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const Cart = () => {
  //& get cart data and action from store
  const { cart, updateCount, clearCart, deleteItem } = useCartStore();
  //^ get products and check if cart is empty or not
  const products = cart?.data?.products;
  const isEmpty = !products?.length;

  const handleUpdateCount = async (productId: string, action: "plus" | "minus") => {
    const count = products?.find((p) => p.product.id === productId)?.count;

    if (!count || count! < 1 || (count == 1 && action === "minus")) return;
    updateCount(productId, count, action);
  };

  return (
    <div className="w-7/8 md:w-8/10 lg:w-4/6 mx-auto mt-10 mb-20 flex flex-col gap-5 items-center rounded-2xl border-[#79ac318a] px-8 py-8 shadow-md shadow-[#79ac31]">
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-5">
        {" "}
        <h5 className="font-bold text-xl md:text-2xl text-[#639222] flex gap-3 items-center">
          <ShoppingCart size={27} /> Your cart total is $
          {cart?.data?.totalCartPrice}
        </h5>
        {!isEmpty && (
          <>
            <div className="flex  gap-3">
              <AnimatedButton className="px-2 md:px-3">Checkout</AnimatedButton>
              <AnimatedButton
                className="bg-red-700 px-2 md:px-3"
                onClick={clearCart}
              >
                Clear cart
              </AnimatedButton>
            </div>
          </>
        )}
      </div>
      {(isEmpty && (
        <p className="text-xl text-[#c8e49f] my-15">the cart is empty</p>
      )) ||
        (products &&
          products.map(
            ({
              _id,
              count,
              price,
              product,
            }: {
              _id: string;
              count: number;
              price: number;
              product: IProduct;
            }) => (
              <Fragment key={_id}>
                <div className="w-full border-b border-neutral-300 mt-5 "></div>
                <div className="flex flex-col md:flex-row justify-between w-full items-center ">
                  <div className="w-full my-2 flex gap-3 justify-start">
                    <div className="overflow-hidden border-2 border-b-emerald-800 ">
                      <Image
                        width={80}
                        height={90}
                        src={`${product?.imageCover}`}
                        alt={product?.title}
                      ></Image>
                    </div>
                    <div className="flex-1 min-h-20">
                      <p className="font-semibold">{product?.title}</p>
                      <p className="text-xs text-emerald-600">
                        {product?.category?.name}
                      </p>
                      <p className="text-xs  text-emerald-600">
                        {product?.brand?.name}
                      </p>
                      <div className="flex gap-2 items-center my-3">
                        <motion.span
                          whileTap={count > 1 ? { scale: 0.8 } : undefined}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                          className={` border-2  ${
                            count > 1
                              ? "text-[#79ac31] border-[#79ac31]"
                              : "text-[#9c9c9c] border-[#9c9c9c] cursor-not-allowed"
                          }`}
                          onClick={() => {
                            if (count > 1)
                              handleUpdateCount(product.id, "minus");
                          }}
                        >
                          <Minus size={13} />
                        </motion.span>
                        <span className="">{count}</span>
                        <motion.span
                          whileTap={{ scale: 0.8 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                          className="text-[#79ac31] border-2 border-[#79ac31]"
                          onClick={() => {
                            handleUpdateCount(product.id, "plus");
                          }}
                        >
                          <Plus size={13} />
                        </motion.span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 items-center">
                    <div className=" min-w-20">
                      <p className="font-semibold text-[#79ac31]">
                        price: <span className="text-black">{price}</span>
                        <span className="text-amber-300">$</span>
                      </p>
                    </div>
                    <AnimatedButton
                      className="bg-red-700 px-2"
                      onClick={() => deleteItem(product.id)}
                    >
                      delete
                    </AnimatedButton>
                  </div>
                </div>
              </Fragment>
            )
          ))}
    </div>
  );
};

export default Cart;
