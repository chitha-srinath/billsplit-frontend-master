import { Bell, Menu, User } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import billsplitlogo from "../assets/billsplitlogo.svg";

export default function Header({ onMenuToggle }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="glass fixed top-0 left-0 right-0 h-14 md:h-16 flex items-center justify-between px-4 z-30">
      <div className="flex items-center">
        <button className="mr-2 md:hidden" onClick={onMenuToggle} aria-label="Toggle menu">
          <Menu className="w-6 h-6" />
        </button>
        <img src={billsplitlogo} alt="Logo" className="h-14 md:h-16" />
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative" aria-label="Notifications" onClick={() => navigate("/activity")}>
          <Bell className="w-6 h-6 motion-preset-seesaw" />
          {user?.FriendRequestCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{user?.FriendRequestCount}</span>
          )}
        </button>
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-xs font-medium mt-1 max-w-[80px] truncate">{user?.userName}</div>
        </div>
      </div>
    </header>
  );
}
