import { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";
import Loading from "@/src/components/ui/Loading";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OrderSuccessContent />
    </Suspense>
  );
}