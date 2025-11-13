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
      console.log("%c➡️ Fetching addresses from API...", "color: cyan;");
      const data = await addressService.getAddresses();
      console.log("%c✅ Addresses fetched:", "color: green;", data);
      return data;
    },
    select: (data) => data.data || [],
  });

  const addMutation = useMutation({
    mutationFn: async (address: any) => {
      console.log("%c🟡 Adding address...", "color: orange;", address);
      const res = await addressService.addAddress(address);
      console.log("%c✅ Address added response:", "color: green;", res);
      return res;
    },
    onSuccess: (res) => {
      console.log("%c💥 Mutation success!", "color: lime;");
      console.log("%c🆕 Added address data:", "color: lime;", res);
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      console.log(
        "%c♻️ Invalidated addresses query to refetch",
        "color: magenta;"
      );
    },
    onError: (err) => {
      console.error("❌ Error adding address:", err);
    },
  });

 const deleteMutation = useMutation({
  mutationFn: addressService.deleteAddress,

  onMutate: async (id) => {
    console.log("%c🗑️ Deleting address optimistically...", "color: red;", id);
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
    console.error("❌ Delete failed, restored previous data");
  },

  onSettled: () => {
    console.log("%c♻️ Refetching addresses after delete", "color: magenta;");
    queryClient.invalidateQueries({ queryKey: ["addresses"] });
  },
});


  console.log("%c📦 Addresses from query:", "color: cyan;", addresses);

  return {
    addresses,
    isLoading,
    addAddress: addMutation.mutate,
    isAdding: addMutation.isPending,
    deleteAddress: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
