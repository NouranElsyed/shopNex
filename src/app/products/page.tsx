/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { useProducts } from "@/src/hooks/useProducts";
import ProductGrid from "@/src/components/ProductGrid";
import ProductPagination from "@/src/components/ProductPagination";
import SearchBar from "@/src/components/SearchBar";
import Loading from "@/src/components/ui/Loading";
import { useAllProducts } from "@/src/hooks/useAllProducts";

const PAGE_SIZE = 16;

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);


  const { data: pageData, isLoading: pageLoading } = useProducts(page);


  const { data: allProducts = [], isLoading: allLoading } = useAllProducts();


  const filtered = useMemo(() => {
    if (!searching || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    return allProducts.filter((p: any) =>
      p.title?.toString().toLowerCase().includes(q)
    );
  }, [allProducts, query, searching]);

 
  const searchSlice = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalItems = searching ? filtered.length : (pageData?.results ?? 0);
  const displayed = searching ? searchSlice : (pageData?.data ?? []);
  const isLoading = searching ? allLoading : pageLoading;

  const doSearch = () => {
    if (query.trim()) {
      setSearching(true);
      setPage(1);
    }
  };

  const doClear = () => {
    setQuery("");
    setSearching(false);
    setPage(1);
  };

  return (
    <div className="w-11/12 md:w-9/10 lg:w-5/6 mx-auto mt-10 mb-20 flex flex-col gap-10 items-center">
      <h1 className="font-semibold text-3xl text-[#98c757] self-start">
        Products
      </h1>

      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={doSearch}
        onClear={doClear}
        placeholder="Search by title..."
      />

      {isLoading ? (
        <div className="flex justify-center w-full py-10">
          <Loading />
        </div>
      ) : (
        <>
    
          {searching && (
            <p className="self-start text-sm text-gray-600">
              {filtered.length} results found
            </p>
          )}

          <div className="w-full grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            <ProductGrid
              products={displayed}
              isLoading={false}
              emptyMessage={
                searching
                  ? `No products found for "${query}"`
                  : "No products available."
              }
            />
          </div>

          {totalItems > PAGE_SIZE && (
            <ProductPagination
              current={page}
              total={totalItems}
              pageSize={PAGE_SIZE}
              onChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}