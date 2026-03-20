import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import EqualSplit from "../components/Equalsplit";
import UnequalSplit from "../components/UnequalSplit";
import PercentageSplit from "../components/PercentageSplit";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../apiService/apiservice";
import { endpoints } from "../api/api";
import { useMutation } from "@tanstack/react-query";

export default function AddExpense() {
  const [expenseName, setExpenseName] = useState("");
  const [totalBill, setTotalBill] = useState("");
  const [paidBy, setPaidBy] = useState(null);
  const [contribution, setContribution] = useState("equal");
  const [splits, setSplits] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const groupMembers = location.state?.groupUsersList;
  const groupid = location.state?.groupId;

  let { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await postData(endpoints.addExpense, data);
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
      if (result?.statuscode === 200) {
        toast.success(result?.message);
        // toast.success("Expense created successfully!");
        localStorage.clear();
        navigate(-1);
      } else {
        toast.error(result?.message);
      }
    },
  });

  useEffect(() => {
    const storedContribution = localStorage.getItem("contribution");
    if (storedContribution) {
      setContribution(storedContribution);
    }
    return () => {
      localStorage.clear();
    };
  }, []);

  const handleContributionChange = (value) => {
    setContribution(value);
    setIsDropdownOpen(false);
    localStorage.setItem("contribution", value);
  };

  const handleSplitChange = (newSplits) => {
    setSplits(newSplits);
  };

  const handlePaidBy = (userid) => {
    let paidbyUser = groupMembers?.find((user) => user.userId === userid);
    if (paidbyUser) {
      setPaidBy(paidbyUser);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const totalBillValue = parseFloat(totalBill);

    if (isNaN(totalBillValue) || totalBillValue <= 0) {
      toast.error("Please enter a valid total bill amount");
      return;
    }

    const totalSplitAmount = Object.values(splits).reduce((sum, split) => sum + parseFloat(split.amount || 0), 0);

    // Round to two decimal places to avoid floating-point precision issues
    const roundedTotalBill = Math.round(totalBillValue * 100) / 100;
    const roundedTotalSplit = Math.round(totalSplitAmount * 100) / 100;

    if (roundedTotalBill !== roundedTotalSplit) {
      toast.error("The total split amount must equal the total bill");
      return;
    }

    if (!paidBy) {
      toast.error("Please select who paid for the expense");
      return;
    }

    // console.log(JSON.stringify({ expenseName: expenseName, totalBill: totalBill, paidBy: paidBy, contributionType: contribution, splitDetails: splits, groupId: groupid }));
    mutate({ expenseName: expenseName, totalBill: Number(totalBill), paidBy: paidBy, contributionType: contribution, splitDetails: splits, groupId: groupid });
    // toast.success("Expense created successfully!");
    // localStorage.clear();
    // navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2" aria-label="Go back">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Create Expense</h1>
        <div className="w-6"></div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <div className="mb-4">
          <label htmlFor="expenseName" className="block text-sm font-medium text-gray-700 mb-1">
            Expense Name
          </label>
          <input
            type="text"
            id="expenseName"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter expense name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="totalBill" className="block text-sm font-medium text-gray-700 mb-1">
            Total Bill
          </label>
          <input
            type="number"
            id="totalBill"
            value={totalBill}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || parseFloat(value) >= 0) {
                setTotalBill(value);
              }
            }}
            onWheel={(e) => e.target.blur()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter total bill amount"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-1">
            Paid By
          </label>
          <select
            id="paidBy"
            value={paidBy?.userId}
            onChange={(e) => {
              handlePaidBy(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select who paid</option>
            {groupMembers?.map((member) => (
              <option key={member?.userId} value={member?.userId}>
                {member?.userName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contribution</label>
          <div className="sm:hidden relative">
            <button
              type="button"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {contribution === "equal" ? "Equal Split" : contribution === "unequal" ? "Unequal Split" : "Percentage Split"}
              <ChevronDown className="w-5 h-5" />
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <button type="button" className="w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleContributionChange("equal")}>
                  Equal Split
                </button>
                <button type="button" className="w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleContributionChange("unequal")}>
                  Unequal Split
                </button>
                <button type="button" className="w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleContributionChange("percentage")}>
                  Percentage Split
                </button>
              </div>
            )}
          </div>
          <div className="hidden sm:flex border-b border-gray-200">
            <button type="button" className={`px-4 py-2 ${contribution === "equal" ? "border-b-2 border-blue-500" : ""}`} onClick={() => handleContributionChange("equal")}>
              Equal Split
            </button>
            <button type="button" className={`px-4 py-2 ${contribution === "unequal" ? "border-b-2 border-blue-500" : ""}`} onClick={() => handleContributionChange("unequal")}>
              Unequal Split
            </button>
            <button type="button" className={`px-4 py-2 ${contribution === "percentage" ? "border-b-2 border-blue-500" : ""}`} onClick={() => handleContributionChange("percentage")}>
              Percentage Split
            </button>
          </div>
        </div>

        {contribution === "equal" && <EqualSplit userList={groupMembers} totalBill={parseFloat(totalBill) || 0} onSplitChange={handleSplitChange} />}
        {contribution === "unequal" && <UnequalSplit userList={groupMembers} totalBill={parseFloat(totalBill) || 0} onSplitChange={handleSplitChange} />}
        {contribution === "percentage" && <PercentageSplit userList={groupMembers} totalBill={parseFloat(totalBill) || 0} onSplitChange={handleSplitChange} />}

        <button type="submit" className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Create Expense
        </button>
      </form>
    </div>
  );
}
