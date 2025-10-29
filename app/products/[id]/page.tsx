"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/config/api.config";
import { IProduct } from "@/interfaces";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/components/ui/Loading";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useCartStore } from "@/store/cart.store";
import { useWishListStore } from "@/store/wishList.store";

const ProductDetails = () => {
  const { id } = useParams();
  const [selectedImg, setSelectedImg] = useState(0);

  // Zustand Stores
  const { addToWishList, removeFromWishList, wishList, fetchwishList } = useWishListStore();
  const { updateCount, fetchCart } = useCartStore();


  useEffect(() => {
    fetchwishList();
    fetchCart();
  }, [fetchwishList, fetchCart]);

  const inWishList = useMemo(
    () => wishList?.data?.some((p) => p.id === id),
    [wishList, id]
  );

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<IProduct> => {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <Loading />;

  if (isError || !product) {
    toast.error("Product not found");
    return <div className="text-center py-20">Product not found</div>;
  }

  const images = [product.imageCover, ...(product.images || [])];

  // Add to Cart
  const handleAddToCart = async () => {
    try {
      await updateCount(id as string, 0, "plus");
   
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  // Toggle Wishlist
  const handleToggleWishlist = async () => {
    try {
      if (inWishList) {
        await removeFromWishList(id as string);
      } else {
        await addToWishList(id as string);
      }
    } catch {
      toast.error("Wishlist update failed");
    }
  };

  return (
    <div className="w-11/12 md:w-9/10 lg:w-5/6 mx-auto mt-10 mb-20">
      {/* Back */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-[#98c757] hover:underline mb-6 text-sm"
      >
        Back to Products
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
                    selectedImg === i ? "border-[#98c757]" : "border-gray-200"
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
              <div className="flex">
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
              </div>
              <span className="text-sm text-gray-600">
                {product.ratingsAverage} ({product.ratingsQuantity} reviews)
              </span>
            </div>

           
            <div className="mb-6">
              <span className="text-3xl font-bold text-[#98c757]">
                ${product.price}
              </span>
            </div>

          
            <div className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </div>

          
            <p className="text-sm text-gray-500 mb-4">
              <strong>Available:</strong> {product.quantity} in stock
            </p>

           
            <div className="flex flex-wrap gap-4 mb-6">
              {product.brand && (
                <Link
                  href={`/brands/${product.brand._id}`}
                  className="flex items-center gap-2 text-[#98c757] hover:underline"
                >
                  <Image
                    src={product.brand.image || "/placeholder.png"}
                    alt={product.brand.name!}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span>{product.brand.name}</span>
                </Link>
              )}
              {product.category && (
                <Link
                  href={`/categories/${product.category._id}`}
                  className="text-[#98c757] hover:underline"
                >
                  {product.category.name}
                </Link>
              )}
            </div>
          </div>

          
          <div className="space-y-3">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#98c757] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#85b046] transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>

            {/* Wishlist */}
            <button
              onClick={handleToggleWishlist}
              className={`w-full border py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                inWishList
                  ? "border-red-500 text-red-500 bg-red-50"
                  : "border-gray-300 text-gray-700 hover:border-[#98c757] hover:text-[#98c757]"
              }`}
            >
              <Heart
                size={20}
                className={`transition-all ${inWishList ? "fill-red-500" : ""}`}
              />
              {inWishList ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;