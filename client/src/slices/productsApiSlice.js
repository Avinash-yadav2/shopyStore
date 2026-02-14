import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, category }) => ({
        url: '/api/products',
        params: { keyword, category }, 
      }),
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => `/api/products/${productId}`,
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: '/api/products',
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `/api/products/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: '/api/upload',
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/api/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `/api/products/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
} = productsApiSlice;