"use client";

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import {  IProduct } from '@/src/interfaces';
import { api } from '@/src/config/api.config';
import Loading from '@/src/components/ui/Loading';
import ProductCard from '@/src/components/product/ProductCard';

const CategoryDetails = () => {
  const { id } = useParams();

 
  const {
    data: category,
    isLoading: catLoading,
    isError: catError,
  } = useQuery({
    queryKey: ['category', id],
    queryFn: async ()=> {
      const { data } = await api.get(`/categories/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  
  const {
    data: productsRes,
    isLoading: prodLoading,
  } = useQuery({
    queryKey: ['products', 'category', id],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: '12',
        page: '1',
        'category[in]': id as string,
      });
      const { data } = await api.get(`/products?${params}`);
      return data;
    },
    enabled: !!id,
  });

  const products: IProduct[] = productsRes?.data ?? [];
  const totalProducts = productsRes?.results ?? 0;

  if (catLoading || prodLoading) return <Loading />;

  if (catError || !category) {
    toast.error("Category not found");
    return <div className="text-center py-20 text-xl text-[#c8e49f]">Category not found</div>;
  }

  return (
    <div className="w-8/12 md:w-8/10 lg:w-5/6 mx-auto mt-10 mb-20">
     
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-[#98c757] hover:underline mb-6"
      >
        <span>Back to Categories</span>
      </Link>

     
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="relative w-full md:w-80 h-64 rounded-xl overflow-hidden shadow-lg">
          <Image
            fill
            src={category.image || "/placeholder.png"}
            alt={category.name}
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-[#98c757] mb-4">
            {category.name}
          </h1>
          <p className="text-gray-600">
            {totalProducts} {totalProducts === 1 ? 'product' : 'products'} available
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
        <div className="text-center py-20  rounded-lg">
          <p className="text-xl  text-[#c8e49f]">No products in this category yet.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;