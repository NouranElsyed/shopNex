import React from "react";
import { AnimatedButton } from "./MotionButton";
import { toast } from "react-toastify";
import { useCartStore } from "@/store/cart.store";
// import { api } from "@/config/api.config";

const AddToCart = ({ productId }: { productId?: string }) => {
    const { fetchCart } = useCartStore();
  const handleAddToCart = async () => {
    try {
      const res = await fetch("/api/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      console.log(res);
      const response = await res.json();
      console.log(response);
      await fetchCart();
      toast(`✅${response.message}`, {
        position: "bottom-right",
        autoClose: 1500,
        theme: "colored",
        style: {
          width: "100%",
          textAlign: "center",
          backgroundColor: "#79ac31",
          color: "white",
          fontWeight: "500",
          margin: "7px 0px ",
        },
      });
    } catch (error) {
      toast(`❕${error || "Something went wrong"}`, {
        position: "top-right",
        autoClose: 4000,
        theme: "colored",
        style: {
          width: "100%",
          textAlign: "center",
          backgroundColor: "#EF5350",
          color: "white",
          fontWeight: "500",
          margin: "7px 0px ",
        },
      });
    }
  };
  return (
    <AnimatedButton className="self-center my-5" onClick={handleAddToCart}>
      Add to cart
    </AnimatedButton>
  );
};

export default AddToCart;
