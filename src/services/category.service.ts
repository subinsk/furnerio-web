import { api, endpoints } from "@/lib/axios";
import { useMemo } from "react";
import useSWR from "swr";

export function useGetCategories(id?: string) {
  const URL = endpoints.category;

  const { data, isLoading, error, isValidating } = useSWR(URL, async (url) => {
    const res = await api.get(url);
    return res.data;
  });

  const memoizedValue = useMemo(
    () => ({
      categories: data?.categories || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !data?.categories.length,
    }),
    [data?.categories, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export const addCategory = async (payload: any) => {
  const res = await api.post("/category", payload);
  console.log("res:", res);
  return res.data;
};
