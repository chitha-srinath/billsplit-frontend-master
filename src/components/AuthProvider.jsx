import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../api/api";
import { getData } from "../apiService/apiservice";
import { clearUser, setLoading, setUser } from "../redux/authSlice";
import Loader from "./Loader";

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
