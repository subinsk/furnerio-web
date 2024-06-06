"use client";

import { ProductShopView } from "@/sections/product/view";
import { useGetCategories } from "@/services/category.service";

export default function CategoryView({ slug }: { slug: string }) {
  // hooks
  const {
    categories,
    categoriesLoading,
    categoriesError,
    categoriesValidating,
    categoriesEmpty,
  } = useGetCategories({
    slug,
  });

  return <ProductShopView />;
}