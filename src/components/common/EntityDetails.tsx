"use client";

import Image from "next/image";
import Link from "next/link";
import ProductCard from "../product/ProductCard";
import { IProduct } from "@/src/interfaces";

interface EntityDetailsProps {
  name: string;
  image: string;
  products: IProduct[];
  totalProducts: number;
  backLink: string;
  backText: string;
  notFoundMessage: string;
}

const EntityDetails = ({
  name,
  image,
  products,
  totalProducts,
  backLink,
  backText,
  notFoundMessage,
}: EntityDetailsProps) => {
  if (!name) {
    return (
      <div className="text-center py-20 text-xl text-[#c8e49f]">
        {notFoundMessage}
      </div>
    );
  }

  return (
    <div className="w-11/12 md:w-9/10 lg:w-5/6 mx-auto mt-10 mb-20">
      <Link
        href={backLink}
        className="inline-flex items-center gap-2 text-[#98c757] hover:underline mb-6"
      >
        ← {backText}
      </Link>

      <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
        <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-[#98c757]/20">
          <Image
            fill
            src={image}
            alt={name}
            className="object-contain p-4"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-[#98c757] mb-2">{name}</h1>
          <p className="text-gray-600">
            {totalProducts} {totalProducts === 1 ? "product" : "products"}{" "}
            available
          </p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-[#c8e49f]">
            No products {backText.includes("Brand") ? "for this brand" : "in this category"} yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default EntityDetails;