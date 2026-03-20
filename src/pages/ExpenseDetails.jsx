import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, DollarSign } from "lucide-react";
// import { fetchGroupDetails } from "../data/groupsData";
import { getDatabyparams, postData } from "../apiService/apiservice";
import { endpoints } from "../api/api";
import Loader from "../components/Loader";

const fetchExpenseDetails = async (expenseid) => {
  const response = await getDatabyparams(endpoints.fetchExpenseDetails, expenseid);
  return response.data;
};

export default function ExpenseDetails() {
  // const { groupId, expenseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const groupid = location.state?.groupId;
  const expenseid = location.state?.expenseId;

  useEffect(() => {
    if (!groupid || !expenseid) {
      navigate("/groups");
    }
  }, []);

  const {
    data: expenseData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expense", expenseid],
    queryFn: () => fetchExpenseDetails(expenseid),
    enabled: !!expenseid,
  });
  console.log("-------expenseData------------", JSON.stringify(expenseData));
  // if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }
  if (error) return <div className="text-center py-4 text-red-500">An error occurred: {error.message}</div>;
  if (!expenseData) return <div className="text-center py-4">Expense not found</div>;

  // const expense = group.expenses.find((e) => e.id === Number(expenseId));
  // if (!expense) return <div className="text-center py-4">Expense not found</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(`/groups/${groupid}`)} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">{expenseData?.expenseName}</h1>
        <div className="w-8"></div> {/* Placeholder for alignment */}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">{new Date(expenseData?.createdAt).toLocaleDateString()}</p>
            <p className="text-lg font-semibold">₹ {expenseData?.totalBill}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <DollarSign size={24} className="text-blue-500" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">Paid by {expenseData?.paidByuserName}</p>
        <hr className="my-2" />
        <h3 className="font-semibold mb-2">Split Details</h3>

        {expenseData?.splitDetails?.map((splitData, idx) => (
          <div key={splitData?.userName + "-" + idx} className="flex justify-between items-center mb-1">
            <span>{splitData?.userName}</span>
            {/** 
            <span className={splitData?.userName < 0 ? "text-red-500" : "text-green-500"}>*/}
            <span>₹ {Math.abs(splitData?.contributionAmount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
