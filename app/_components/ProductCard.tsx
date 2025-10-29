"use client";

import AddToCart from "@/components/ui/customButton/AddToCart";
import RatingStars from "@/components/ui/RatingStars";
import { IProduct } from "@/interfaces";
import { useWishListStore } from "@/store/wishList.store";
import { truncateText } from "@/utils/truncateText";
import { Heart, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

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

  const { toggleWishList, wishList } = useWishListStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const inWishList = useMemo(
    () => wishList?.data?.some((item) => item.id === id),
    [wishList, id]
  );

  return (
    <Link
      href={`/products/${id}`}
      className="group block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      aria-label={`View details of ${title}`}
    >
      <article className="flex flex-col h-full">
        <div className="relative aspect-square bg-gray-50 dark:bg-gray-900 overflow-hidden">
          <Image
            src={imageCover}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishList(id);
            }}
            aria-label={inWishList ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all z-10"
          >
            <Heart
              size={20}
              className={`transition-all ${
                inWishList
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-600 dark:text-gray-300 hover:text-red-500"
              }`}
            />
          </button>
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
                  setIsExpanded(!isExpanded);
                }}
                className="ml-1 text-[#79ac31] font-medium text-xs hover:underline inline-flex items-center gap-1"
                aria-label={isExpanded ? "Show less" : "Show more"}
              >
                {isExpanded ? "less" : "more"}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#79ac31]">${price}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <RatingStars
              rating={ratingsAverage}
              ratingsQuantity={ratingsQuantity}
            />
          </div>

          <div className="mt-auto pt-2 text-center">
            <AddToCart productId={id} />
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
