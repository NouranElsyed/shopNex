import AddToCart from "@/components/ui/customButton/AddToCart";
import RatingStars from "@/components/ui/RatingStars";
import { IProduct } from "@/interfaces";
import { useWishListStore } from "@/store/wishList.store";
import { truncateText } from "@/utils/truncateText";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
interface IProps {
  product: IProduct;
}
const ProductCard = ({ product }: IProps) => {
  const {
    id,
    imageCover,
    title,
    description,
    price,
    ratingsQuantity,
    ratingsAverage,
  } = product;
  const { toggleWishList, wishList } = useWishListStore();

  const inWishList = useMemo(
    () => wishList?.data?.some((item) => item.id === product.id),
    [wishList, product.id]
  );
  return (
    <div className="product relative flex flex-col justify-between rounded-xl overflow-hidden h-full border-1 transition-all duration-500 border-[#79ac318a] hover:shadow-md hover:shadow-[#79ac31] ">
      <div className="flex flex-col w-full items-center">
        <div className="relative w-full h-[250px]  overflow-hidden">
          <Image fill src={`${imageCover}`} alt={title}></Image>
        </div>
        <h3 className="my-3 font-semibold text-center px-7">{title}</h3>
      </div>
      <div className="text-center w-8/10 mx-auto">
        <p className="text-gray-600 text-sm">
          {truncateText(description, 45)}{" "}
          <span className="cursor-pointer text-[#79ac31] font-semibold ">
            ...see more
          </span>
        </p>
      </div>
      <div className="flex flex-col mx-7">
        <p className="flex justify-between my-3">
          <span className="font-semibold">Price:</span>
          <span>
            {price} <span className="text-amber-400">$</span>{" "}
          </span>
        </p>
        <RatingStars
          rating={ratingsAverage}
          ratingsQuantity={ratingsQuantity}
        ></RatingStars>
        <AddToCart productId={id}></AddToCart>
      </div>
      {inWishList ? (
        <Heart
          fill="#db1a00"
          size={27}
          onClick={() => toggleWishList(id)}
          className="absolute top-3 right-3 text-[#db1a00] heart opacity-0"
        />
      ) : (
        <Heart
          onClick={() => toggleWishList(id)}
          size={27}
          className="absolute top-3 right-3 text-[#79ac31] hover:text-[#db1a00] heart opacity-0"
        />
      )}
    </div>
  );
};

export default ProductCard;
