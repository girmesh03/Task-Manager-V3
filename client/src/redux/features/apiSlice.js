import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { store } from '../app/store';
import { logout } from './authSlice';
import { setError } from './errorSlice';
import { toast } from 'react-toastify';

const SERVER_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

// Define the base query with refresh logic
const baseQuery = fetchBaseQuery({
  baseUrl: `${SERVER_URL}/api`,
  credentials: 'include',
  prepareHeaders: (headers) => {
    // Optionally set headers if needed (e.g., Authorization)
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized - Token Refresh
  if (result.error?.status === 401) {
    // console.warn('Access token expired, attempting refresh...');
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

    if (refreshResult.data) {
      // console.log('Token refreshed successfully, retrying original request...');
      result = await baseQuery(args, api, extraOptions);
    } else {
      // console.error('Refresh token failed, logging out...');
      api.dispatch(logout());
      toast.error('Session expired, please log in again');
      api.dispatch(setError(result.error)); // Dispatch error to Redux
    }
  }

  // Global error handling - Dispatch error to Redux
  if (result.error) {
    // console.error('API Error:', result.error);
    toast.error(result.error.data?.message || 'An unexpected error occurred.');
    api.dispatch(setError(result.error)); // Dispatch error to Redux
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'appApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Dashboard', 'Tasks', 'Users', 'Team'],
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: ({ selectedDepartment, limit, currentDate }) => ({
        url: 'statistics',
        params: { selectedDepartment, limit, currentDate },
      }),
      providesTags: ['Dashboard']
    }),
    getLeaderboard: builder.query({
      query: ({ currentDate, selectedDepartment }) => ({
        url: 'statistics/leaderboard',
        params: { currentDate, selectedDepartment },
      }),
      providesTags: [{ type: "Team", id: 'LIST' }]
    }),
    getUserStatistics: builder.query({
      query: ({ selectedDepartment, userId, currentDate }) => ({
        url: 'statistics/user',
        params: { selectedDepartment, userId, currentDate },
      }),
      providesTags: [{ type: "Users", id: 'STAT' }]
    }),
    getTasks: builder.query({
      query: ({ selectedDepartment, status = "", page = 1, limit = 10, }) => ({
        url: "tasks",
        params: { selectedDepartment, status, page, limit },
      }),
      transformResponse: (response) => ({
        tasks: response.tasks,
        pagination: response.pagination,
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName
      },
      merge: (currentCache, newItems, currentArg) => {
        if (currentArg.arg.page === 1) {
          currentCache.tasks = newItems.tasks;
          currentCache.pagination = newItems.pagination;
        }
        else {
          currentCache.tasks = [...currentCache.tasks, ...newItems.tasks];
          currentCache.pagination = newItems.pagination;
        }

        return currentCache
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.status !== previousArg?.status ||
          currentArg?.limit !== previousArg?.limit ||
          currentArg?.selectedDepartment !== previousArg?.selectedDepartment
        );
      },
      providesTags: (result) =>
        result
          ? [
            ...result.tasks.map(({ _id }) => ({ type: "Tasks", id: _id })),
            { type: "Tasks", id: "LIST" },
          ]
          : [{ type: "Tasks", id: "LIST" }],
    }),
    getTask: builder.query({
      query: (taskId) => `tasks/${taskId}`,
      providesTags: (result, error, taskId) => [{ type: "Tasks", id: taskId }],
    }),
    createTask: builder.mutation({
      query: (newTask) => ({
        url: 'tasks',
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: [
        { type: "Tasks", id: "LIST" },
        { type: "Users", id: 'STAT' },
        { type: "Team", id: 'LIST' },
        "Dashboard"]
    }),
    updateTask: builder.mutation({
      query: ({ taskId, ...updatedTask }) => ({
        url: `tasks/${taskId}`,
        method: 'PUT',
        body: updatedTask,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
        { type: "Tasks", id: "LIST" },
        { type: "Users", id: "STAT" },
        { type: "Team", id: 'LIST' },
        "Dashboard"
      ],
    }),
    deleteTask: builder.mutation({
      query: ({ taskId, selectedDepartment }) => ({
        url: `tasks/${taskId}`,
        method: 'DELETE',
        params: { selectedDepartment },
      }),
      invalidatesTags: (result, error, taskId) => [
        { type: "Tasks", id: taskId },
        { type: "Tasks", id: "LIST" },
        { type: "Users", id: "STAT" },
        { type: "Team", id: 'LIST' },
        "Dashboard"
      ],
    }),
    // Users
    getUsers: builder.query({
      query: ({ selectedDepartment }) => ({
        url: 'users',
        params: { selectedDepartment },
      }),
      providesTags: [{ type: "Users", id: "LIST" }],
    }),
    getUser: builder.query({
      query: ({ selectedDepartment, userId }) => ({
        url: `users/${userId}`,
        params: { selectedDepartment },
      }),
      providesTags: (result, error, userId) => [{ type: "Users", id: userId }],
    }),
    updateUser: builder.mutation({
      query: ({ userId, ...updatedUser }) => ({
        url: `users/${userId}`,
        method: 'PUT',
        body: updatedUser,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Users", id: userId },
        { type: "Users", id: "LIST" },
      ],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: "Users", id: userId },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetLeaderboardQuery,
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useGetUserStatisticsQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = apiSlice;
