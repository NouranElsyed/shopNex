import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../services/publicGet.service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};
