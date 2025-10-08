
import React from "react";
import { ClipLoader } from "react-spinners";
const Loading = () => {
  return (
    <div className="flex-1 max-h-screen bg-white w-full flex justify-center items-center">
      <ClipLoader color="#79ac31" size={60} />
    </div>
  );
};

export default Loading;
