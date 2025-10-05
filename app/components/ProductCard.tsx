import { MotionButton } from "@/components/ui/MotionButton";
import { IProduct } from "@/interfaces";
import { truncateText } from "@/utils/truncateText";
import Image from "next/image";
interface IProps {
  product: IProduct;
}
const ProductCard = ({ product }: IProps) => {
  const { imageCover, title, description, price } = product;
//   shadow-md shadow-[#79ac31] 
  return (
    <div className="flex flex-col justify-between rounded-xl overflow-hidden h-full border-1 transition-all duration-500 border-[#79ac318a] hover:shadow-md hover:shadow-[#79ac31] ">
      <div className="flex flex-col w-full items-center">
        <div className="relative w-full h-[250px]  overflow-hidden">
          <Image fill src={`${imageCover}`} alt={title}></Image>
        </div>
        <h3 className="my-3 font-semibold text-center px-7">{title}</h3>
      </div>
      <div className="text-center w-8/10 mx-auto">
        <p className="text-gray-600 text-sm">{truncateText(description,45)} <span className="cursor-pointer text-[#79ac31] font-semibold ">...see more</span></p>
      </div>
      <div className="flex flex-col mx-7">
        <p className="flex justify-between my-3">
          <span className="font-semibold">Price:</span>
          <span>
            {price} <span className="text-amber-400">$</span>{" "}
          </span>
        </p>
        <MotionButton
          suppressHydrationWarning
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="self-center transition-all duration-500 my-5"
        >
          Add to cart
        </MotionButton>
      </div>
    </div>
  );
};

export default ProductCard;
