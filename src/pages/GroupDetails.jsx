import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Settings, ChevronUp, ChevronDown, Plus } from "lucide-react";
import ExpensesTab from "../components/ExpensesTab";
import ChartsTab from "../components/ChartsTab";
import BalancesTab from "../components/BalancesTab";
import TotalsTab from "../components/TotalsTab";
import Loader from "../components/Loader";
import { getDatabyparams, postData } from "../apiService/apiservice";
import { endpoints } from "../api/api";
import { useSelector } from "react-redux";
import { groupsData } from "../data/groupsData";

export default function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("expenses");
  const [showTabMenu, setShowTabMenu] = useState(false);
  const [showBalanceDetails, setShowBalanceDetails] = useState(false);
  const [groupExpensesDetails, setGroupExpensesDetails] = useState(false);
  const authUser = useSelector((state) => state.auth?.user);

  const fetchGroupDetails = async (groupid) => {
    const response = await getDatabyparams(endpoints.fetchGroupDetails, groupid);
    return response.data;
  };
  const fetchUserOweorOwedDetails = async (groupid, userid) => {
    const response = await postData(endpoints.userOweorOwed, { groupId: groupid, userId: userid });
    return response.data;
  };

  const {
    data: group,
    isLoading: groupDetailsApiLoading,
    error: groupDetailsApiError,
  } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroupDetails(groupId),
  });
  const {
    data: usersOwesDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["UserOweorOwed", groupId],
    queryFn: () => fetchUserOweorOwedDetails(groupId, authUser?.userId),
    enabled: !!showBalanceDetails,
  });

  const currUserBalance = group?.groupUsers?.find((user) => user?.userId === authUser?.userId)?.balance || 0;
  const groupUsersList = group?.groupUsers ?? [];
  if (groupDetailsApiLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  if (error) return <div className="text-center py-4 text-red-500">An error occurred: {error.message}</div>;
  if (!group) return <div className="text-center py-4">Group not found</div>;

  const handleExport = async () => {
    try {
      const response = await fetch("/api/export-excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupId }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `group_${groupId}_expenses.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }
  };

  console.log("------agwertyu-----", JSON.stringify(group));
  console.log("------agwertyusdgjkl-----", JSON.stringify(usersOwesDetails));

  const renderContent = () => {
    switch (activeTab) {
      case "expenses":
        return <ExpensesTab groupId={groupId} />;
      case "charts":
        // return <ChartsTab group={groupsData[0]} />;
        return <ChartsTab groupDetails={group} />;
      case "balances":
        return <BalancesTab groupDetails={group} />;
      // return <BalancesTab groupId={groupId} />;
      case "totals":
        return <TotalsTab groupDetails={group} userid={authUser?.userId} />;
      case "export":
        handleExport();
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate("/groups")} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">{group?.groupName}</h1>
        <button className="p-2">
          <Settings size={24} />
        </button>
      </div>

      <div className="bg-gray-800 text-white p-4 rounded-lg">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowBalanceDetails(!showBalanceDetails)}>
          <p className="text-lg font-semibold">
            {currUserBalance === 0
              ? "You are settled up overall"
              : currUserBalance < 0
              ? `You owe ₹ ${Math.abs(currUserBalance.toFixed(2))} overall`
              : `You are owed ₹ ${currUserBalance.toFixed(2)} overall`}
          </p>
          <span>{showBalanceDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
        </div>
        {showBalanceDetails && usersOwesDetails?.length > 0 && (
          <div className="mt-2 space-y-1">
            {usersOwesDetails?.map(
              (userOwedata) =>
                userOwedata?.userName !== authUser?.userName &&
                userOwedata?.balance !== 0 && (
                  <p key={userOwedata?.userName} className="text-sm">
                    You {userOwedata?.balance > 0 ? "owe" : "are owed"} {userOwedata?.userName} ₹ {Math.abs(userOwedata?.balance)}
                  </p>
                )
            )}
          </div>
        )}
      </div>

      <div className="relative">
        <button className="w-full p-2 bg-gray-200 rounded-md text-left flex items-center justify-between md:hidden" onClick={() => setShowTabMenu(!showTabMenu)}>
          <span>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
          <span>{showTabMenu ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
        </button>
        {showTabMenu && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-md shadow-lg z-10 md:hidden">
            {["expenses", "charts", "balances", "totals", "export"].map((tab) => (
              <button
                key={tab}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setActiveTab(tab);
                  setShowTabMenu(false);
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        )}
        <div className="hidden md:flex space-x-2">
          {["expenses", "charts", "balances", "totals", "export"].map((tab) => (
            <button key={tab} className={`px-4 py-2 rounded-md ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {renderContent()}
      {activeTab === "expenses" && (
        <button
          onClick={() => navigate(`/groups/${groupId}/createexpense`, { state: { groupUsersList, groupId: groupId } })}
          className="fixed bottom-20 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-105 transition-transform duration-200 ease-out"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  );
}
