'use client';
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
console.log(orderId)
  return (
    <div className="w-full max-w-md mx-auto mt-20 text-center">
      <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
      <h1 className="text-2xl font-bold text-green-700">Order Placed Successfully!</h1>
      <p className="text-sm text-gray-500 mt-4">
        We’ll contact you soon to confirm details.
      </p>
      <div className="flex gap-3 mt-6 justify-center">
        <button
          onClick={() => window.location.href = "/"}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Home
        </button>
        <button
          onClick={() => window.location.href = "/orders"}
          className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
        >
          My Orders
        </button>
      </div>
    </div>
  );
}