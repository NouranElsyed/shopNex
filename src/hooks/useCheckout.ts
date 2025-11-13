import { useMutation } from "@tanstack/react-query";
import { checkoutService } from "../services/checkout.service";
import { queryClient } from "../lib/queryClient";

export function useCheckout() {
  const mutation = useMutation({
    mutationFn: checkoutService.createSession,

    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["cart"] });
    },
  });

  return {
    checkout: mutation.mutate,
    isCheckingOut: mutation.isPending,
    data: mutation.data,
  };
}
