import { api } from "@/src/config/api.config";
import { IBrand, ICategory } from "@/src/interfaces";

export const fetchBrands = async (): Promise<IBrand[]> => {
  const { data } = await api.get<{ data: IBrand[] }>("/brands");
  return data.data ?? [];
};

export const fetchBrandById = async (id: string): Promise<IBrand> => {
  const { data } = await api.get<{ data: IBrand }>(`/brands/${id}`);
  return data.data;
};

export const fetchCategories = async (): Promise<ICategory[]> => {
  const { data } = await api.get<{ data: ICategory[] }>("/categories");
  return data.data ?? [];
};

export const fetchCategoryById = async (id: string): Promise<ICategory> => {
  const { data } = await api.get<{ data: ICategory }>(`/categories/${id}`);
  return data.data;
};

export const fetchProducts = async (
  page: number,
  limit: number
)=> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  console.log(`/products?${params}`)
  const { data } = await api.get(`/products?${params}`);
  return data;
};