import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser, clearUser, setLoading } from "../redux/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true,
});

// export const useApiMutation = (endpoint, options = {}) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   return useMutation({
//     mutationFn: async (data) => {
//       console.log(`Mutation request to ${endpoint}:`, data);
//       const response = await api.post(endpoint, data);
//       console.log(`Mutation response from ${endpoint}:`, response.data);
//       return response.data;
//     },
//     onSuccess: (data) => {
//       console.log(`Mutation success for ${endpoint}:`, data);
//       if (options.onSuccess) {
//         options.onSuccess(data);
//       }
//       if (options.authAction) {
//         dispatch(setUser(data.user));
//       }
//       if (options.successRedirect) {
//         navigate(options.successRedirect);
//       }
//     },
//     onError: (error) => {
//       console.error(`Mutation error for ${endpoint}:`, error);
//       if (error.response?.status === 401) {
//         dispatch(clearUser());
//         navigate("/login");
//       } else if (options.onError) {
//         options.onError(error);
//       }
//     },
//   });
// };

// export const useApiQuery = (endpoint, options = {}) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   return useQuery({
//     queryKey: [endpoint, options.queryKey],
//     queryFn: async () => {
//       try {
//         const response = await api.get(endpoint);
//         console.log("----response.data---", response.data);
//         return response.data;
//       } catch (error) {
//         if (error.response?.status === 401) {
//           dispatch(clearUser());
//           dispatch(setAuthenticated(false));
//           navigate("/login");
//         }
//         throw error; // Re-throw the error to trigger onError
//       }
//     },
//     onSuccess: (data) => {
//       console.log("--data--", data);
//       if (options.onSuccess) {
//         options.onSuccess(data);
//       }
//       if (options.authAction) {
//         dispatch(setUser(data.user));
//       }
//     },
//     onError: (error) => {
//       console.log(error.response);
//       if (error.response?.status === 401) {
//         dispatch(clearUser());
//         navigate("/login");
//       } else if (options.onError) {
//         options.onError(error);
//       }
//     },
//     retry: (failureCount, error) => error?.response?.status !== 401 && failureCount < 2,
//     ...options,
//   });
// };

export const useApiMutation = (endpoint) => {
  const {
    data: responseData,
    error,
    isError,
    isPending,
    isSuccess,
    mutate,
  } = useMutation({
    mutationFn: async (data) => {
      console.log(`Mutation request to ${endpoint}:`, data);
      const response = await api.post(endpoint, data);
      console.log(`Mutation response from ${endpoint}:`, response.data);
      return response.data;
    },
  });
  if (isSuccess) {
    console.log("---issucess from useApi--", responseData);
  }
  if (isError) {
    console.log("----iserror from useApi----", error.response);
  }
  return { responseData, error, isError, isPending, isSuccess, mutate };
};

export const useApiQuery = (endpoint, options = {}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: userdata,
    isError,
    isSuccess,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [endpoint, options.queryKey],
    queryFn: async () => {
      console.log(`Query request to ${endpoint}`);
      const response = await api.get(endpoint);
      console.log(`Query response from ${endpoint}:`, response.data);
      return response.data;
    },
    retry: (failureCount, error) => error?.response?.status !== 401 && failureCount < 2,
    // ...options,
  });
  if (isSuccess) {
    console.log("---issucess--", userdata);
    // if (options.onSuccess) {
    //   options.onSuccess(userdata);
    // }
    // if (options.authAction) {
    //   dispatch(setUser(userdata.user));
    // }
  }
  if (isError) {
    console.log("----iserror----", error.response);
    // if (error.response?.data?.status === 401) {
    //   // options.refetch;
    //   dispatch(clearUser());
    //   navigate("/login");
    // } else if (options.onError) {
    //   options.onError(error);
    // }
  }
  //console.log("---refetch----", refetch);
  return { userdata, isError, isSuccess, error, isLoading, refetch };
};

export const AuthCheckApiCall = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    const data = await response.json();
    return {
      message: "suceess",
      statusCode: 200,
      data: "qwerty",
    };
  } catch (error) {
    //console.error("Auth check failed-----------------:", JSON.stringify(error));
    return {
      message: "error",
      statusCode: error.status,
      data: null,
    };
  }
};
