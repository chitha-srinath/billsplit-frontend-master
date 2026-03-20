import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, UserPlus, Settings, Activity, LogOut, X } from "lucide-react";
import toast from "react-hot-toast";
import { clearUser } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { getData } from "../apiService/apiservice";
import { useMutation } from "@tanstack/react-query";
import { endpoints } from "../api/api";

const navigationLinks = [
  { path: "/", label: "Home", icon: Home },
  { path: "/groups", label: "Groups", icon: Users },
  { path: "/friends", label: "Friends", icon: UserPlus },
  { path: "/activity", label: "Activity", icon: Activity },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function MobileMenu({ isOpen, onClose }) {
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
    console.log("-----logout triggered at mobile menu-----");
    logout();
  };
  return (
    <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className={`fixed top-0 left-0 right-0 bg-white p-4 transition-transform duration-300 ${isOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <button onClick={onClose} className="absolute top-4 right-4" aria-label="Close menu">
          <X className="w-6 h-6" />
        </button>
        <nav className="mt-8">
          <ul className="space-y-4">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.path}>
                  <NavLink to={link.path} className={({ isActive }) => `flex items-center p-2 ${isActive ? "bg-gray-300" : ""}`} onClick={onClose}>
                    <Icon className="w-6 h-6 mr-2" />
                    {link.label}
                  </NavLink>
                </li>
              );
            })}
            {/** 
            <li>
              <NavLink to="/" className={({ isActive }) => `flex items-center p-2 ${isActive ? "bg-gray-300" : ""}`} onClick={onClose}>
                <Home className="w-6 h-6 mr-2" />
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/groups" className={({ isActive }) => `flex items-center p-2 ${isActive ? "bg-gray-300" : ""}`} onClick={onClose}>
                <Users className="w-6 h-6 mr-2" />
                Groups
              </NavLink>
            </li>
            <li>
              <NavLink to="/friends" className={({ isActive }) => `flex items-center p-2 ${isActive ? "bg-gray-300" : ""}`} onClick={onClose}>
                <UserPlus className="w-6 h-6 mr-2" />
                Friends
              </NavLink>
            </li>

            <li>
              <NavLink to="/activity" className={({ isActive }) => `flex items-center p-2 ${isActive ? "bg-gray-300" : ""}`} onClick={onClose}>
                <Activity className="w-6 h-6 mr-2" />
                Activity
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className={({ isActive }) => `flex items-center p-2 ${isActive ? "bg-gray-300" : ""}`} onClick={onClose}>
                <Settings className="w-6 h-6 mr-2" />
                Settings
              </NavLink>
            </li>
            */}
          </ul>
        </nav>
        <div className="mt-8">
          <button
            className="flex items-center text-red-500 p-2"
            onClick={() => {
              onClose();
              handleLogout();
            }}
          >
            <LogOut className="w-6 h-6 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
