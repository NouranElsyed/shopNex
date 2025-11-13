
import React from "react";
import Link from "next/link";
import { IProduct } from "../interfaces";
import ProductCard from "./product/ProductCard";

interface ProductGridProps {
  products: IProduct[];
  isLoading: boolean;
  emptyMessage?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  emptyMessage = "No products found.",
}) => {
  if (isLoading) {
    return (
      <div className="col-span-full py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="col-span-full text-center py-20">
        <p className="text-xl text-[#c8e49f]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="hover:scale-105 transition-transform duration-300 block"
        >
          <ProductCard product={product} />
        </Link>
      ))}
    </>
  );
};

export default ProductGrid;
