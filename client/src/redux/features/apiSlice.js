import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const SERVER_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

export const apiSlice = createApi({
  reducerPath: 'appApi', // A unique key to store data in the Redux state
  baseQuery: fetchBaseQuery({ baseUrl: `${SERVER_URL}/api` }), // Set your API's base URL
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => 'statistics', // Relative path for the endpoint
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardQuery } = apiSlice;
