import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { IAxiosError } from "@/src/interfaces";

export const useApiQuery = <T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<T, Error>({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        const axiosError = error as AxiosError<IAxiosError>;
        const message =
          axiosError.response?.data?.message || "Something went wrong";
        toast.error(message, {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};