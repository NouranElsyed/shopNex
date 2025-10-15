"use client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IAxiosError, IProduct } from "@/interfaces";
import { SearchIcon } from "lucide-react";
import React, { useState } from "react";
import ProductCard from "../_components/ProductCard";
import Loading from "@/components/ui/Loading";
import { api } from "@/config/api.config";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { Pagination, PaginationProps } from "antd";
const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data:  resData,
    isSuccess: isProdSuccess,
    isLoading: isProdLoading,
  } = useQuery({
    queryKey: ["products",currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: "16", 
        page: currentPage.toString(),
      });
      try {
        const { data: res } = await api.get(`/products?${params}`);
        console.log(res.data)
        // setTotalItems(res.total || 0);
        return res ?? [];
      } catch (error) {
        const AxiosErr = error as AxiosError<IAxiosError>;
        toast(
          `❕${AxiosErr?.response?.data?.message || "Something went wrong"}`,
          {
            position: "top-right",
            autoClose: 4000,
            theme: "colored",
            style: {
              width: "100%",
              textAlign: "center",
              backgroundColor: "#EF5350",
              color: "white",
              fontWeight: "500",
              margin: "7 0px",
            },
          }
        );
        return  { data: [], results: 0 };
      }
    },
  });
  if (isProdLoading) return <Loading />;

const products = resData?.data ?? [];
  const totalItems = resData?.results ?? 0;
  const totalPages = resData?.metadata?.numberOfPages ?? 1;

  const handlePaginationChange: PaginationProps['onChange'] = (page) => {
    setCurrentPage(page);
  };
  return (
    <>
      <div className="w-7/8 md:w-9/10 lg:w-5/6 mx-auto mt-10 mb-20 flex flex-col gap-10 items-center">
        <p className="font-semibold text-3xl text-[#98c757] self-start">
          Products:
        </p>
        <div className="w-5/6 md:w-3/4 mx-auto flex gap-2 items-center rounded-lg bg-[#e8f0db] h-fit">
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
        {
          <>
            <div
              className={`w-5/7 grid grid-cols-1 gap-10 mx-15
              sm:grid-cols-2 sm:gap-5 sm:mx-0 
              md:w-9/10 md:grid-cols-3 md:gap-8 md:mx-0 
              lg:grid-cols-3 lg:gap-10 
              xl:grid-cols-4 xl:gap-10    
              items-stretch`}
            >
              {isProdSuccess && products.length === 0 && (
                <div className="text-center py-20 w-full bg-amber-100">
                  <p className="text-xl text-[#c8e49f]">No products found.</p>
                </div>
              )}
              {isProdSuccess &&
                products.map((product: IProduct) => (
                  <div
                    className="hover:scale-101 transition-all duration-300"
                    key={product.id}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
            </div>
        {totalPages > 1 && (
        <div className="flex justify-center w-full mt-10">
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={16} 
            onChange={handlePaginationChange}
            showSizeChanger={false}
            showQuickJumper={false}
          />
        </div>
      )}
          </>
        }
      </div>
    </>
  );
};

export default Products;
