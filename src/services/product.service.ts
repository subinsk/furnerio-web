import { api, endpoints, fetcher } from "@/lib/axios"
import { useMemo } from "react";
import useSWR from "swr";

export function useGetProducts() {
    const URL = endpoints.product;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            products: data?.data || [],
            productsLoading: isLoading,
            productsError: error,
            productsValidating: isValidating,
            productsEmpty: !isLoading && !data?.data.length,
        }),
        [data?.products, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetProduct(params?: { id?: string; slug?: string }) {
    const { id, slug } = params || {};
    const productEndpoint = endpoints.product;

    const URL = id ? `${productEndpoint}?id=${id}` : slug ? `${productEndpoint}?slug=${slug}` : productEndpoint;

    const { data, isLoading, error, isValidating } = useSWR(URL, async (url) => {
        const res = await api.get(url);
        return res.data;
    });

    const memoizedValue = useMemo(
        () => ({
            product: data?.data,
            productLoading: isLoading,
            productError: error,
            productValidating: isValidating,
        }),
        [data?.product, error, isLoading, isValidating]
    );

    return memoizedValue;
}
export function useSearchProducts(query: string) {
    const URL = query ? [endpoints.product.search, { params: { query } }] : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });

    const memoizedValue = useMemo(
        () => ({
            searchResults: data?.data || [],
            searchLoading: isLoading,
            searchError: error,
            searchValidating: isValidating,
            searchEmpty: !isLoading && !data?.data.length,
        }),
        [data?.results, error, isLoading, isValidating]
    );

    return memoizedValue;
}


export const createProduct = async (data: any) => {
    const response = await api.post(endpoints.product, data)
    return response.data
}

export const getProducts = async () => {
    const response = await api.get(endpoints.product)
    return response.data
}

export const getProductById = async (id: string) => {
    const response = await api.get(`${endpoints.product}?id=${id}`)
    return response.data
}

export const updateProduct = async (data: any) => {
    const response = await api.put(endpoints.product, data)
    return response.data
}

export const deleteProduct = async (id: string) => {
    const response = await api.delete(`${endpoints.product}?id=${id}`)
    return response.data
}

export const getProductBySlug = async (slug: string) => {
    const response = await api.get(`${endpoints.product}?slug=${slug}`)
    return response.data
}
