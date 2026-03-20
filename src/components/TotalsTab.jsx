import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { endpoints } from "../api/api";
import { postData } from "../apiService/apiservice";
import Loader from "./Loader";

export default function TotalsTab({ groupDetails, userid }) {
  const [timePeriod, setTimePeriod] = useState("all");

  const fetchUserGroupBalance = async () => {
    const response = await postData(endpoints.getUserGroupBalance, {
      groupId: groupDetails?.groupId,
      userId: userid,
      timePeriod: timePeriod,
    });
    return response.data;
  };

  const {
    data: userGroupBalanceData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userGroupBalanceData", groupDetails?.groupId, userid, timePeriod],
    queryFn: fetchUserGroupBalance,
    enabled: !!groupDetails?.groupId && !!userid,
  });

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
    refetch();
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-700">
          Select Time Period
        </label>
        <select
          id="timePeriod"
          value={timePeriod}
          onChange={handleTimePeriodChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">All Time</option>
          <option disabled={true} value="thisMonth">
            This Month
          </option>
          <option disabled={true} value="lastMonth">
            Previous Month
          </option>
        </select>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Expense Summary</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total Group Spending</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">₹ {groupDetails?.groupAmount?.toFixed(2) || "0.00"}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total You Paid</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">₹ {userGroupBalanceData?.totalPaid?.toFixed(2) || "0.00"}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Your Total Share</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">₹ {userGroupBalanceData?.totalShare?.toFixed(2) || "0.00"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
