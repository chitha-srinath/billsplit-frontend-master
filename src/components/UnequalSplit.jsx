import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

export default function UnequalSplit({ userList, totalBill, onSplitChange }) {
  const [splits, setSplits] = useState([]);

  const initializeSplits = useCallback(() => {
    return userList.map((user) => ({
      userId: user?.userId,
      userName: user?.userName,
      amount: 0,
    }));
  }, [userList]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("unequalSplit") || "{}");
    const totalValue = storedData?.usersList?.reduce((acc, ele) => acc + ele.amount, 0) ?? 0;

    if (storedData.usersList && totalValue <= totalBill) {
      setSplits(storedData.usersList);
    } else {
      const newSplits = initializeSplits();
      setSplits(newSplits);
    }
  }, [totalBill, initializeSplits]);

  useEffect(() => {
    if (splits?.length > 0) {
      const data = {
        totalBillValue: totalBill,
        usersList: splits,
      };
      localStorage.setItem("unequalSplit", JSON.stringify(data));
      onSplitChange(splits);
    }
  }, [splits, totalBill, onSplitChange]);

  const handleValueChange = (id, value) => {
    let newValue = value === "" ? "" : parseFloat(value) || 0;
    if (newValue === 0) newValue = "";

    const newSplits = splits.map((user) => (user.userId === id ? { ...user, amount: newValue } : user));

    const totalSplit = newSplits.reduce((sum, user) => sum + (parseFloat(user.amount) || 0), 0);
    if (Number(totalBill) === 0) {
      toast.error("Provide Total bill amount");
      return;
    }
    if (totalSplit > totalBill) {
      toast.error("Total split amount cannot exceed the total bill");
      return;
    }

    setSplits(newSplits);
  };

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Split Details</h3>
      {splits.map((user) => (
        <div key={user.userId} className="flex items-center justify-between mb-2">
          <label htmlFor={`member-${user.userId}`} className="text-sm">
            {user.userName}
          </label>

          <input
            type="number"
            id={`member-${user.userId}`}
            value={user.amount === 0 ? "" : user.amount}
            onChange={(e) => handleValueChange(user.userId, e.target.value)}
            onWheel={(e) => e.target.blur()}
            className="w-24 px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            min="0"
            step="0.01"
            // placeholder="0"
          />
        </div>
      ))}
    </div>
  );
}
