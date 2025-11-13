import React from "react";
import { Star } from "lucide-react";
interface IProps {
  ratingsQuantity: number;
  rating: number;
}
const RatingStars = ({ ratingsQuantity, rating }: IProps) => {
  const fraction = rating - Math.floor(rating);
  const remainFraction = (1 - fraction) * 100;
  return (
    <div className="flex justify-center items-center">
      {[...Array(Math.floor(rating))].map((_, index) => (
        <Star
          key={index}
          size={18}
          fill={"#ffe74d"}
          className="text-[#ffe74d]"
        />
      ))}
      <Star
        size={18}
        fill={"#ffe74d"}
        className="text-[#ffe74d]"
        style={{ clipPath: `inset(0 ${remainFraction}% 0 0)` }}
      />
      <p className="text-gray-400 text-xs">({ratingsQuantity})</p>
    </div>
  );
};

export default RatingStars;
