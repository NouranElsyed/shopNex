import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className=" bg-gradient-to-br from-gray-50 to-gray-100 flex flex-1 items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
     
        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-bold text-[#98c757] flex items-center justify-center gap-5">
             <AlertCircle className="w-18 h-18 " />
            404
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-gray-800">
            Oops! Page not found
          </p>
        </div>

       
        <div className="flex flex-col items-center gap-4">
         
          <p className="text-gray-600 max-w-xs">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

    
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#98c757] text-white font-medium rounded-lg hover:bg-[#85b048] transition-colors shadow-md"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Browse Products
          </Link>
        </div>

      
      </div>
    </div>
  );
}