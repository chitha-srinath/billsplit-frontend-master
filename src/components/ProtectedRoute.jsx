import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { endpoints } from "../api/api";
import { useApiQuery } from "../hooks/useApi";
import { clearUser } from "../redux/authSlice";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, isError } = useApiQuery(endpoints.checkAuth, {
    queryKey: "auth",
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !isAuthenticated,
    onError: () => {
      dispatch(clearUser());
    },
  });

  // useEffect(() => {
  //   if (!isLoading && !isError && isAuthenticated) {
  //     if (location.pathname === "/login" || location.pathname === "/register") {
  //       navigate("/");
  //     }
  //   }
  // }, [isLoading, isError, isAuthenticated, location.pathname, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
