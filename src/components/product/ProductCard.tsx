'use client';

import { IProduct } from "@/src/interfaces";
import { Heart, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import RatingStars from "../ui/RatingStars";
import { truncateText } from "@/src/utils/truncateText";
import AddToCart from "../ui/custom/AddToCart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/src/hooks/useCart";
import { useWishlist } from "@/src/hooks/useWishlist"; 

interface IProps {
  product: IProduct;
}

const ProductCard = ({ product }: IProps) => {
  const {
    id,
    imageCover,
    title,
    description,
    price,
    ratingsAverage,
    ratingsQuantity,
  } = product;

  const { data: session, status } = useSession();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const { addToCart, isAddingToCart } = useCart();
  const {
    isInWishlist,
    toggleWishlist,
    isToggling,
  } = useWishlist(); 

  const handleAddToCart = () => {
    if (status === "loading") return;

    if (!session?.user) {
      toast.info("You must be logged in to add items to the cart.", {
        position: "top-right",
      });
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(location.pathname)}`);
      return;
    }

    addToCart(id);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === "loading") return;

    if (!session?.user) {
      toast.info("Please log in to manage your wishlist.", {
        position: "top-right",
      });
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(location.pathname)}`);
      return;
    }

    toggleWishlist(id);
  };

  const isWishlistLoading = isToggling(id);

  return (
    <div className="group block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white h-full dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <article className="flex flex-col h-full">
      
        <div className="relative aspect-square bg-gray-50 dark:bg-gray-900 overflow-hidden">
          <Image
            src={imageCover}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
{session?.user &&
        
          <button
            onClick={handleWishlistClick}
            disabled={isWishlistLoading}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all z-10
              ${
                isInWishlist(id)
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-white"
              }
              ${isWishlistLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-110"}
              backdrop-blur-sm
            `}
          >
            <Heart
              size={20}
              fill={isInWishlist(id) ? "currentColor" : "none"}
              className={`transition-all ${isWishlistLoading ? "animate-pulse" : ""}`}
            />
          </button>}
        </div>

        <div className="flex flex-col flex-1 p-4 space-y-3">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#79ac31] transition-colors">
            {title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isExpanded ? description : truncateText(description, 60)}
            {description.length > 60 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsExpanded(v => !v);
                }}
                className="ml-1 text-[#79ac31] font-medium text-xs hover:underline inline-flex items-center gap-1"
              >
                {isExpanded ? "less" : "more"}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-[#79ac31]">${price}</span>
          </div>

          <div className="flex items-center justify-between">
            <RatingStars rating={ratingsAverage} ratingsQuantity={ratingsQuantity} />
          </div>

       
          <div className="mt-auto pt-2">
            <AddToCart
              productId={id}
              isLoading={isAddingToCart(id)}
              onAdd={handleAddToCart}
              disabled={status !== "authenticated"}
            
            />
          </div>
        </div>
      </article>
    </div>
  );
};

export default ProductCard;