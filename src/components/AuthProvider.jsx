import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthCheckApiCall, useApiQuery } from "../hooks/useApi";
import { setUser, clearUser, setLoading } from "../redux/authSlice";
import { endpoints } from "../api/api";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getData, postData } from "../apiService/apiservice";
import { useQuery } from "@tanstack/react-query";

// export const AuthProvider = ({ children }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isLoading, isAuthenticated } = useSelector((state) => {
//     console.log("-----inside auth provider ----------", state.auth);
//     return state.auth;
//   });
//   console.log("----------Naveen---111---------", isLoading, isAuthenticated);
//   const {
//     userdata,
//     isError,
//     isSuccess,
//     error,
//     isLoading: apiLoading,
//     refetch,
//   } = useApiQuery(endpoints.checkAuth, {
//     enabled: false,
//     retry: false,
//     authAction: true,
//     queryKey: "AuthCheck",
//     // onSuccess: (data) => {
//     //   dispatch(setLoading(false));
//     // },
//     // onError: (error) => {
//     //   dispatch(clearUser());
//     //   dispatch(setLoading(false));
//     //   navigate("/login");
//     // },
//   });
//   if (isSuccess) {
//     //console.log("---isuscess-111----", userdata);
//     dispatch(setUser(userdata.user));
//     dispatch(setLoading(false));
//   }
//   if (isError) {
//     //console.log("----iserror----123456---", error.response);
//     dispatch(clearUser());
//     dispatch(setLoading(false));
//     // navigate("/login");
//   }
//   useEffect(() => {
//     if (!isAuthenticated) {
//       // dispatch(setLoading(true));
//       refetch();
//     }
//   }, [isAuthenticated]);

//   // useEffect(() => {
//   //   const initializeAuth = async () => {
//   //     dispatch(setLoading(true));
//   //     const storedUser = localStorage.getItem("user");
//   //     console.log("----stored user----", storedUser);
//   //     if (storedUser) {
//   //       dispatch(setUser(JSON.parse(storedUser)));
//   //     } else {
//   //       try {
//   //         await refetch();
//   //       } catch (error) {
//   //         console.error("Auth check failed:", error);
//   //         dispatch(clearUser());
//   //       }
//   //     }
//   //     dispatch(setLoading(false));
//   //   };

//   //   initializeAuth();
//   // }, [dispatch, refetch]);

//   if (isLoading) {
//     return <Loader />;
//   }

//   // if (isError) {
//   //   return <div>Error: Unable to authenticate. Please try again later.</div>;
//   // }

//   return children;
// };

// export const AuthProvider = ({ children }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isLoading, isAuthenticated } = useSelector((state) => {
//     return state.auth;
//   });

//   useEffect(() => {
//     const checkAuth = async () => {
//       dispatch(setLoading(true));
//       try {
//         const response = await AuthCheckApiCall(endpoints.checkAuth);
//         if (response.statusCode === 401) {
//           dispatch(clearUser());
//         } else {
//           dispatch(setUser({ username: response.data }));
//         }
//       } catch (error) {
//         console.error("Auth check failed:");
//         dispatch(clearUser());
//       } finally {
//         dispatch(setLoading(false));
//       }
//     };

//     checkAuth();
//   }, [isAuthenticated]);

//   if (isLoading) {
//     return <Loader />;
//   }

//   return children;
// };

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useSelector((state) => {
    return state.auth;
  });

  const {
    data: userData,
    isLoading: apiLoading,
    isError,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["checkAuth"],
    queryFn: () => getData(endpoints.checkAuth),
    retry: false,
  });

  const userInfoData = userData?.data || null;

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser(userInfoData));
      dispatch(setLoading(false));
    }

    if (isError) {
      dispatch(clearUser());
      dispatch(setLoading(false));
      navigate("/login");
    }
  }, [isSuccess, isError, userInfoData]);

  if (isLoading) {
    return <Loader />;
  }

  return children;
};
