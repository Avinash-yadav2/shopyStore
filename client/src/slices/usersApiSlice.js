import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: '/api/users/auth',
        method: 'POST',
        body: data,
      }),
    }),
    
    register: builder.mutation({
      query: (data) => ({
        url: '/api/users',
        method: 'POST',
        body: data,
      }),
    }),
    logoutApiCall: builder.mutation({
      query: () => ({
        url: '/api/users/logout',
        method: 'POST',
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: '/api/users/profile',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useLogoutApiCallMutation, 
  useRegisterMutation, 
  useProfileMutation 
} = usersApiSlice;