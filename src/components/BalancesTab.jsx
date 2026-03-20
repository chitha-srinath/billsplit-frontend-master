import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { endpoints } from "../api/api";
import { postData } from "../apiService/apiservice";

export default function BalancesTab({ groupDetails }) {
  const [openUserId, setOpenUserId] = useState(null);

  const fetchUserOweorOwedDetails = async (groupId, userId) => {
    const response = await postData(endpoints.userOweorOwed, { groupId, userId });
    return response.data;
  };

  const {
    data: usersOwesDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["UserOweorOwed", groupDetails?.groupId, openUserId],
    queryFn: () => fetchUserOweorOwedDetails(groupDetails?.groupId, openUserId),
    enabled: !!openUserId,
  });

  const handleChevronClick = (userId) => {
    if (openUserId === userId) {
      setOpenUserId(null);
    } else {
      setOpenUserId(userId);
      // refetch();
    }
  };

  return (
    <div className="space-y-4">
      {groupDetails?.groupUsers?.length > 0 &&
        groupDetails?.groupUsers.map((groupUser) => (
        <div key={groupUser?.userId} className="interactive-card p-5">
            <div className="flex justify-between items-center" onClick={() => handleChevronClick(groupUser?.userId)}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${groupUser?.balance > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}>
                  {groupUser?.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Balance</p>
                  <p className={`text-lg font-bold ${groupUser?.balance > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {groupUser?.balance > 0 ? `${groupUser?.userName} gets back ₹ ${Math.abs(groupUser?.balance)}` : `${groupUser?.userName} owes ₹ ${Math.abs(groupUser?.balance)}`}
                  </p>
                </div>
              </div>
              <span className="text-slate-400 bg-slate-50 p-2 rounded-full hover:bg-slate-100 transition-colors">
                {openUserId === groupUser?.userId ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </span>
            </div>
            {openUserId === groupUser?.userId && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                {isLoading && (
                  <div className="space-y-3 animate-pulse mt-2">
                    <div className="h-12 bg-slate-200/50 rounded-xl w-full"></div>
                    <div className="h-12 bg-slate-200/50 rounded-xl w-full"></div>
                  </div>
                )}
                {error && <p className="text-sm text-red-500">Error: {error.message}</p>}
                {usersOwesDetails?.map(
                  (owesUser) =>
                    groupUser?.userId !== owesUser?.userId && (
                      <div key={owesUser?.userId} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="font-medium text-slate-700">{owesUser.userName}</span>
                        {owesUser.balance > 0 ? <span className="text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full text-sm">₹ {Math.abs(owesUser.balance)}</span> : <span className="text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full text-sm">₹ {Math.abs(owesUser.balance)}</span>}
                      </div>
                    )
                )}

                <div className="flex justify-end space-x-3 mt-4">
                  <button className="btn-secondary text-sm px-4">Remind</button>
                  <button className="btn-primary text-sm px-4">Settle up</button>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
