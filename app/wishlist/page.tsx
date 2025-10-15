"use client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IProduct } from "@/interfaces";
import { useWishListStore } from "@/store/wishList.store";
import { SearchIcon } from "lucide-react";
import React from "react";
import ProductCard from "../_components/ProductCard";

const Wishlist = () => {
  const { wishList ,fetchwishList } = useWishListStore();
  if (!wishList) {
    fetchwishList();
  }

  console.log(wishList);
  return (
    <>
      <div className="w-7/8 md:w-9/10 lg:w-5/6 mx-auto mt-10 mb-20 flex flex-col gap-10 items-center">
        <p className="font-semibold text-3xl text-[#98c757] self-start">
          Wishlist:
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
          <div
            className={`w-5/7 grid grid-cols-1 gap-10 mx-15
              sm:grid-cols-2 sm:gap-5 sm:mx-0 
              md:w-9/10 md:grid-cols-3 md:gap-8 md:mx-0 
              lg:grid-cols-3 lg:gap-10 
              xl:grid-cols-4 xl:gap-10    
              items-stretch`}
          >
            {wishList &&
              wishList.data.map((product: IProduct) => (
                <div
                  className="hover:scale-101 transition-all duration-300"
                  key={product.id}
                >
                  <ProductCard product={product} />
                </div>
              ))}
          </div>
        }
      </div>
    </>
  );
};

export default Wishlist;
