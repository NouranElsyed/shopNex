"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, MoveLeft } from "lucide-react";
import { useState } from "react";
import Loading from "@/src/components/ui/Loading";
import { IProduct } from "@/src/interfaces";
import { api } from "@/src/config/api.config";
import { useWishlist } from "@/src/hooks/useWishlist";
import { useCart } from "@/src/hooks/useCart";
import AddToCart from "@/src/components/ui/custom/AddToCart";
import { useSession } from "next-auth/react";
import { AnimatedButton } from "@/src/components/ui/custom/MotionButton";

const ProductDetails = () => {
  const { id } = useParams();
  const [selectedImg, setSelectedImg] = useState(0);

  const { status } = useSession();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isTogglingWishlist,
  } = useWishlist();
  const { addToCart, isAddingToCart } = useCart();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<IProduct>({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <Loading />;
  if (isError || !product)
    return <div className="text-center py-20">Product not found</div>;

  const images = [product.imageCover, ...(product.images || [])];
  const inWish = isInWishlist(id as string);

  const handleAddToCart = () => addToCart(id as string);
  const handleToggleWishlist = () =>
    inWish ? removeFromWishlist(id as string) : addToWishlist(id as string);

  return (
    <div className="w-10/12 md:w-8/10 lg:w-4/6 mx-auto mt-10 mb-20">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-[#79ac31] hover:underline mb-6 text-sm"
      >
        <MoveLeft /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative h-96 rounded-xl overflow-hidden shadow-lg bg-gray-50">
            <Image
              fill
              src={images[selectedImg]}
              alt={product.title}
              className="object-contain p-4"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImg === i ? "border-green-600" : "border-gray-200"
                  }`}
                >
                  <Image fill src={img} alt="" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              {product.title}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.ratingsAverage)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600">
                {product.ratingsAverage} ({product.ratingsQuantity} reviews)
              </span>
            </div>
            <div className="text-3xl font-bold text-[#79ac31] mb-6">
              ${product.price}
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong className="text-[#79ac31]">Available:</strong>{" "}
              {product.quantity} in stock
            </p>
          </div>

          <div className="space-y-3">
            <AddToCart
              className="w-full bg-[#79ac31] text-base text-white py-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:text-[#79ac31] hover:bg-white border-2 hover:border-[#79ac31] transition"
              iconSize={25}
              productId={product.id}
              isLoading={isAddingToCart(product.id)}
              onAdd={handleAddToCart}
              disabled={status !== "authenticated"}
            />
            <AnimatedButton
              onClick={handleToggleWishlist}
              disabled={
                status !== "authenticated" || isTogglingWishlist(id as string)
              }
              className={`
    w-full border py-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
    ${
      inWish
        ? "border-red-500 text-red-500 bg-red-50 hover:border-red-500 hover:text-red-500 hover:bg-white"
        : "border-gray-300 hover:border-[#79ac31] hover:text-[#79ac31] hover:bg-white"
    }
    ${
      status !== "authenticated" || isTogglingWishlist(id as string)
        ? "opacity-60 cursor-not-allowed"
        : ""
    }
  `}
              whileTap={{
                scale:
                  status !== "authenticated" || isTogglingWishlist(id as string)
                    ? 1
                    : 0.95,
              }}
            >
              {isTogglingWishlist(id as string) ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {inWish ? "Adding..." : "Removing..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Heart size={25} className={inWish ? "fill-red-500" : ""} />
                  {inWish ? "Remove from Wishlist" : "Add to Wishlist"}
                </span>
              )}
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
