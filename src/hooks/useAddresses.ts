/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addressService } from "../services/address.service";

interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export function useAddresses() {
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const data = await addressService.getAddresses();
      return data;
    },
    select: (data) => data.data || [],
  });

  const addMutation = useMutation({
    mutationFn: async (address: any) => {
      const res = await addressService.addAddress(address);
      return res;
    },
    onSuccess: (res) => {

      queryClient.invalidateQueries({ queryKey: ["addresses"] });
   
    },
    onError: (err) => {
      console.error("❌ Error adding address:", err);
    },
  });

 const deleteMutation = useMutation({
  mutationFn: addressService.deleteAddress,

  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ["addresses"] });

    const previous = queryClient.getQueryData<any>(["addresses"]);

    queryClient.setQueryData(["addresses"], (old: any) => {
      if (!old) return old;
      const list = Array.isArray(old) ? old : old.data; 
      const updated = list.filter((a: Address) => a._id !== id);

      return Array.isArray(old)
        ? updated
        : { ...old, data: updated };
    });

    return { previous };
  },

  onError: (_err, _id, context) => {
    if (context?.previous) {
      queryClient.setQueryData(["addresses"], context.previous);
    }
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["addresses"] });
  },
});

  return {
    addresses,
    isLoading,
    addAddress: addMutation.mutate,
    isAdding: addMutation.isPending,
    deleteAddress: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
