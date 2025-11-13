import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../services/api.service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
   
  });
};
