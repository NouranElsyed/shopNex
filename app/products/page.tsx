"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Pagination, PaginationProps } from "antd";
import { SearchIcon, ArrowBigRight } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { AnimatedButton } from "@/components/ui/customButton/MotionButton";
import Loading from "@/components/ui/Loading";
import ProductCard from "../_components/ProductCard";
import { api } from "@/config/api.config";
import { IAxiosError, IProduct } from "@/interfaces";

// ========================
// Types
// ========================
interface ProductData {
  products: IProduct[] | null;
  totalItems: number;
  totalPages: number;
}

// ========================
// Main Component
// ========================
const Products = () => {
  // --- State ---
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [data, setData] = useState<ProductData>({
    products: null,
    totalItems: 0,
    totalPages: 1,
  });

  // --- Fetch Products with Pagination ---
  const {
    data: resData,
    isLoading: isProdLoading,
    isSuccess: isProdSuccess,
  } = useQuery({
    queryKey: ["products", currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: "16",
        page: currentPage.toString(),
      });

      try {
        const { data: res } = await api.get(`/products?${params}`);
        return res;
      } catch (error) {
        const err = error as AxiosError<IAxiosError>;
        toast.error(
          `❕ ${err.response?.data?.message || "Something went wrong"}`,
          {
            position: "top-right",
            autoClose: 4000,
            theme: "colored",
            style: {
              backgroundColor: "#EF5350",
              color: "white",
              fontWeight: "500",
              textAlign: "center",
            },
          }
        );
        return { data: [], results: 0 };
      }
    },
  });

  // --- Sync resData → local data state ---
  useEffect(() => {
    if (resData) {
      setData({
        products: resData.data ?? [],
        totalItems: resData.results ?? 0,
        totalPages: resData.metadata?.numberOfPages ?? 1,
      });
    }
  }, [resData]);

  // --- Pagination Handler ---
  const handlePaginationChange: PaginationProps["onChange"] = (page) => {
    setCurrentPage(page);
  };

  // --- Search Handler ---
  const handleSearching = async () => {
    const trimmedValue = searchValue.trim();

    // --- set default if no search word ---
    if (!trimmedValue) {
      setData({
        products: resData?.data ?? [],
        totalItems: resData?.results ?? 0,
        totalPages: resData?.metadata?.numberOfPages ?? 1,
      });
      setCurrentPage(1);
      return;
    }

    try {
      const { data: res } = await api.get(`/products?limit=50`);
      const searchedProducts = res.data.filter((p: IProduct) =>
        p.title.toLowerCase().includes(trimmedValue.toLowerCase())
      );

      setData({
        products: searchedProducts,
        totalItems: searchedProducts.length,
        totalPages: 1,
      });

      setCurrentPage(1); 
    } catch (error) {
      const err = error as AxiosError<IAxiosError>;
      toast.error(
        `❕ ${err.response?.data?.message || "Something went wrong"}`,
        {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
          style: {
            backgroundColor: "#EF5350",
            color: "white",
            fontWeight: "500",
            textAlign: "center",
          },
        }
      );
    }
  };

  // --- Loading State ---
  if (isProdLoading) return <Loading />;

  // --- Render ---
  return (
    <div className="w-8/12 md:w-9/10 lg:w-5/6 mx-auto mt-10 mb-20 flex flex-col gap-10 items-center">
      {/* Title */}
      <h1 className="font-semibold text-3xl text-[#98c757] self-start">
        Products:
      </h1>

      {/* Search Bar */}
      <div className="w-full md:w-3/4 mx-auto flex gap-2 items-center">
        <InputGroup className="bg-[#e8f0db] flex-1">
          <InputGroupInput
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearching()}
          />
          <InputGroupAddon>
            <SearchIcon className="w-5 h-5" />
          </InputGroupAddon>
        </InputGroup>

        <AnimatedButton
          className="font-semibold p-3"
          onClick={handleSearching}
          aria-label="Search"
        >
          <ArrowBigRight className="w-6 h-6" />
        </AnimatedButton>
      </div>

      {/* Products Grid */}
      <div
        className={`
          w-full grid grid-cols-1 gap-8
          sm:grid-cols-2 sm:gap-6
          md:grid-cols-3 md:gap-8
          lg:grid-cols-3 lg:gap-10
          xl:grid-cols-4 xl:gap-10
          items-stretch
        `}
      >
        {/* No Products Found */}
        {isProdSuccess && data.products?.length === 0 && (
          <div className="col-span-full text-center py-20 rounded-lg">
            <p className="text-xl text-[#c8e49f]">No products found.</p>
          </div>
        )}

        {/* Product Cards */}
        {isProdSuccess &&
          data.products?.map((product) => (
            <div
              key={product.id}
              className="hover:scale-105 transition-transform duration-300"
            >
              <ProductCard product={product} />
            </div>
          ))}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex justify-center w-full mt-10">
          <Pagination
            current={currentPage}
            total={data.totalItems}
            pageSize={16}
            onChange={handlePaginationChange}
            showSizeChanger={false}
            showQuickJumper={false}
          />
        </div>
      )}
    </div>
  );
};

export default Products;