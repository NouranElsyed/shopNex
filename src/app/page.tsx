"use client";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import { ICategory, IProduct } from "../interfaces";
import ProductCard from "../components/product/ProductCard";
import Loading from "../components/ui/Loading";

export default function Home() {
  const { data: categories = [], isLoading: isCatLoading } = useCategories();
  const { data: products = [], isLoading: isProdLoading } = useProducts(4);
  console.log(products);
  if (isCatLoading || isProdLoading) return <Loading />;

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-[300px] lg:h-[400px]">
        <Image
          fill
          src="/header1.jpg"
          alt="Shopping"
          className="object-fill md:object-cover"
          priority
        />
      </div>

      {/* Categories */}
      <section className="px-6 md:w-4/5 mx-auto my-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-semibold text-lg">Categories:</h2>
          {categories.map((cat: ICategory) => (
            <span
              key={cat._id}
              className="text-sm px-3 py-1.5 rounded-full bg-[#e8f0db] text-[#79ac31]"
            >
              {cat.name}
            </span>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="w-11/12 md:w-9/10 lg:w-5/6 mx-auto mt-12 mb-24">
        <h2 className="font-bold text-3xl text-[#79ac31] mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 w-3/4 md:w-full mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-8">
          {products?.data?.map((product: IProduct) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="block hover:scale-105 transition-transform duration-300"
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
