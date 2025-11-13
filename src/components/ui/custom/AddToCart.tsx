
'use client';

import { ShoppingCart } from "lucide-react";
import { AnimatedButton } from "./MotionButton";

interface AddToCartProps {
  productId: string;
  isLoading?: boolean;
  onAdd: () => void;
  disabled?: boolean;
  className?:string
  iconSize?: number
}

const AddToCart = ({
  isLoading = false,
  onAdd,
  disabled = false,
  className,
  iconSize=18
}: AddToCartProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isLoading) onAdd();
  };

  return (
    <AnimatedButton
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`w-full py-2.5 px-4 bg-[#79ac31] hover:bg-[#6a9a2a] text-white font-medium rounded-lg  items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
    >
      {isLoading ? (
        <span className="flex gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex gap-3" />
          Adding...
       </span>
      ) : (
        <span className="flex gap-2">
          <ShoppingCart size={iconSize} />
          Add to Cart
        </span>
      )}
    </AnimatedButton>
  );
};

export default AddToCart;