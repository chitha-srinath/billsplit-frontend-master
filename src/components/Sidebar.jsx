import { useMutation } from "@tanstack/react-query";
import { Activity, Home, LogOut, Settings, UserPlus, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { endpoints } from "../api/api";
import { getData } from "../apiService/apiservice";
import { clearUser } from "../redux/authSlice";

const navigationLinks = [
  { path: "/", label: "Home", icon: Home },
  { path: "/groups", label: "Groups", icon: Users },
  { path: "/friends", label: "Friends", icon: UserPlus },
  { path: "/activity", label: "Activity", icon: Activity },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ className = "" }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: logout, isLoading: apiLoading } = useMutation({
    mutationFn: () => getData(endpoints.logout),
    onError: (error) => {
      if (error.response?.status === 401) {
        toast.error("Something went wrong");
      } else {
        console.log(error);
      }
    },
    onSuccess: (result) => {
      if (result?.statuscode === 200) {
        dispatch(clearUser());
        toast.success(result?.message);
        navigate("/login");
      } else {
        toast.error(result?.message);
      }
    },
  });

  const handleLogout = () => {
    console.log("-----logout triggered-----");
    logout();
  };
  return (
    <aside className={`bg-white border-r border-slate-100 w-64 h-full fixed left-0 top-16 bottom-0 overflow-y-auto ${className} transition-all duration-300`}>
      <nav className="flex flex-col h-full">
        <ul className="flex-1 py-4">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.path}>
                <NavLink to={link.path} className={({ isActive }) => `flex items-center mx-3 my-1 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"}`}>
                  <Icon className="w-6 h-6 mr-2" />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="pb-20 ml-2 ">
          <button onClick={handleLogout} className="flex items-center text-red-500 mx-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all duration-200 w-[calc(100%-1.5rem)] font-medium">
            <LogOut className="w-6 h-6 mr-2" />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}
