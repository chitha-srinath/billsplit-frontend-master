import { useState } from "react";
import { useFormik } from "formik";
import * as z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Link } from "react-router-dom";
import billsplitlogo from "../assets/billsplitlogo.svg";
import api, { endpoints } from "../api/api";
import { useApiMutation } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "../redux/authSlice";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getData, postData } from "../apiService/apiservice";
import { AuthProvider } from "../components/AuthProvider";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean(),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const loginMutation = useApiMutation(endpoints.login, {
  //   successMessage: "Login successful!",
  //   successRedirect: "/",
  //   authAction: true,
  // });
  //-------------------------------------------------------------------------
  // const { responseData, error, isError, isPending, isSuccess, mutate } = useApiMutation(endpoints.login);
  // if (isSuccess) {
  // if (responseData?.statuscode === 200) {
  //   toast.success(responseData?.message);
  //   dispatch(setUser({}));
  //   navigate("/");
  // } else {
  //   toast.error(responseData?.message);
  // }
  // }
  // if (isError) {
  // if (error.response?.status === 401) {
  //   toast.error("Something Went Worng");
  //   // dispatch(clearUser());
  //   // navigate("/login");
  // } else {
  //   console.log(error.response?.message);
  // }
  // }
  ///-----------------------------------------------------------

  ///---------------------------New Approach ---------------------
  let { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await postData(endpoints.login, data);
      return response;
    },

    onError: (error) => {
      if (error.response?.status === 401) {
        toast.error("Something Went Worng");
      } else {
        console.log(error.response?.message);
      }
    },
    onSuccess: (result) => {
      // console.log("--result--", result)
      if (result?.statuscode === 200) {
        toast.success(result?.message);
        dispatch(setUser(result?.data));
        navigate("/");
      } else {
        toast.error(result?.message);
      }
    },
  });

  /// --------------- New Approach -------

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: (values) => {
      // console.log("Form submitted:", values);
      mutate(values);
    },
  });
  ///-----------handGoogleleLogin-----------
  function handGoogleleLogin() {
    // refetch();

    // window.location.href = "http://localhost:5080/api/auth/google";
    return null
  }

  // let { refetch, isSuccess } = useQuery({
  //   queryKey: ["googleLogin"],
  //   queryFn: async () => await getData(endpoints.googleLogin),
  //   enabled: false,
  // });
  // if (isSuccess) {
  //   toast.success("Google Login Successful!");

  //   navigate("/home");
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-1 bg-white p-8 rounded-2xl shadow-md">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={billsplitlogo} alt="Logo" className="pl-28" />
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
          <p className="mt-4 text-sm text-gray-600">
            Please enter your details to login.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="mt-10 space-y-">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={formik.handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {formik.errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-gray-500"
                >
                  Forgot password?
                </button>
              </div>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  onChange={formik.handleChange}
                  className="appearance-none block w-full px-3 py-2 border  border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center "
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>
            {/**
                  <div className="flex items-center">
              <input id="rememberMe" name="rememberMe" type="checkbox" onChange={formik.handleChange} className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded" />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
                   */}
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Login
            </button>
          </div>

          <p className="mt-4 text-sm text-center">
            If not registered,{" "}
            <Link
              to="/register"
              className="text-gray-600 hover:text-gray-500 underline"
            >
              click here to sign up
            </Link>
          </p>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={handGoogleleLogin}
                type="button"
                className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    fill="currentColor"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
