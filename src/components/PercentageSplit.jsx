import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

export default function PercentageSplit({ userList, totalBill, onSplitChange }) {
  const [splits, setSplits] = useState([]);

  const initializeSplits = useCallback(() => {
    return userList.map((user) => ({
      userId: user?.userId,
      userName: user?.userName,
      percentage: 0,
      amount: 0,
    }));
  }, [userList]);

  const calculatePercentageSplit = useCallback(
    (totalbillValue, users) => {
      users.forEach((user) => {
        user.amount = (user.percentage / 100) * totalbillValue;
      });
      setSplits(users);
    },
    [totalBill]
  );

  useEffect(() => {
    const storedData = localStorage.getItem("percentageSplit");
    const parsedData = storedData ? JSON.parse(storedData) : null;

    if (parsedData) {
      setSplits(parsedData.usersList);
      calculatePercentageSplit(totalBill, parsedData.usersList);
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
      localStorage.setItem("percentageSplit", JSON.stringify(data));
      onSplitChange(splits);
    }
  }, [splits, totalBill, onSplitChange]);

  const handlePercentageChange = (id, percentage) => {
    let newPercentage = percentage === "" ? "" : parseFloat(percentage) || 0;
    if (newPercentage === 0) newPercentage = "";

    const newSplits = splits.map((user) =>
      user.userId === id
        ? {
            ...user,
            percentage: newPercentage,
            amount: newPercentage === "" ? "" : ((newPercentage / 100) * totalBill).toFixed(2),
          }
        : user
    );

    const totalPercentage = newSplits.reduce((sum, user) => sum + (parseFloat(user.percentage) || 0), 0);
    if (totalPercentage > 100) {
      toast.error("Total percentage cannot exceed 100%");
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
          <div className="flex items-center">
            <input
              type="number"
              id={`member-${user.userId}`}
              value={user.percentage === 0 ? "" : user.percentage}
              onChange={(e) => handlePercentageChange(user.userId, e.target.value)}
              onWheel={(e) => e.target.blur()}
              className="w-16 px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              min="0"
              max="100"
              step="0.01"
            />
            <span className="mr-2">%</span>
            <span className="mx-2">=</span>
            <input type="number" value={user.amount} className="w-24 px-2 py-1 border-b border-gray-300 bg-gray-100" disabled />
          </div>
        </div>
      ))}
    </div>
  );
}
