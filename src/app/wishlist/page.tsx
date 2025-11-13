"use client";

import React, { useState, useMemo } from "react";
import { SearchIcon } from "lucide-react";
import { useAuthRedirect } from "@/src/hooks/useAuthRedirect";
import { IProduct } from "@/src/interfaces";
import ProductCard from "@/src/components/product/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { wishlistService } from "@/src/services/wishlist.service";

const Wishlist = () => {
  useAuthRedirect({ requireAuth: true, redirectTo: "/login" });

  const [searchQuery, setSearchQuery] = useState("");

  const { data: wishlist, isLoading, error } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
  });

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!wishlist?.data) return [];
    if (!searchQuery.trim()) return wishlist.data;

    const query = searchQuery.toLowerCase();
    return wishlist.data.filter((product: IProduct) =>
      product.title.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  }, [wishlist?.data, searchQuery]);

  if (isLoading) return <div className="text-center py-10 text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {(error as Error).message}</div>;
  if (!wishlist?.data?.length) return <div className="text-center py-10 text-xl text-[#79ac31b0]  flex flex-1 items-center justify-center">Your wishlist is empty</div>;

  return (
    <div className="w-11/12 md:w-9/10 lg:w-5/6 mx-auto mt-10 mb-20 flex flex-col gap-10 items-center">
      {/* Title */}
      <p className="font-semibold text-3xl text-[#98c757] self-start">
        Wishlist ({wishlist.count})
      </p>

      {/* Search Bar */}
      <div className="w-full md:w-3/4 mx-auto">
        <div className="relative flex items-center bg-[#e8f0db] rounded-lg h-12 shadow-sm">
          <input
            type="text"
            placeholder="Search in wishlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 pl-12 text-base bg-transparent outline-none placeholder:text-gray-500"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
            <SearchIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product: IProduct) => (
          <div
            key={product.id}
            className="hover:scale-105 transition-transform duration-300"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredProducts.length === 0 && searchQuery && (
        <p className="text-center text-gray-500 text-lg mt-10">
          No results found for {searchQuery}
        </p>
      )}
    </div>
  );
};

export default Wishlist;