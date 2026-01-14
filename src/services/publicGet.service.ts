import { api } from "@/src/config/api.config";

export const fetchBrands = async () => {
  const { data } = await api.get("/brands");
  console.log("fetchBrands ===>(in public get service)", data);
  return data.data ?? [];
};

export const fetchBrandById = async (id: string) => {
  const { data } = await api.get(`/brands/${id}`);
  console.log("fetchBrandById ===>(in public get service)", data);
  return data.data;
};

export const fetchCategories = async () => {
  const { data } = await api.get("/categories");
  console.log("fetchCategories ===>(in public get service)", data);
  return data.data ?? [];
};

export const fetchCategoryById = async (id: string) => {
  const { data } = await api.get(`/categories/${id}`);
  console.log("fetchCategoryById ===>(in public get service)", data);
  return data.data;
};

export const fetchProducts = async (page: number, limit: number) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  console.log("fetchProducts (params) ===>(in public get service)", params);
  const { data } = await api.get(`/products?${params}`);
  console.log("fetchProducts ===>(in public get service)", data);
  return data;
};
