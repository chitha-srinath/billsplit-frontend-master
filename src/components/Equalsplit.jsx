import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

export default function EqualSplit({ userList, totalBill, onSplitChange }) {
  const [splits, setSplits] = useState([]);

  const initializeSplits = useCallback(() => {
    return userList.map((user) => ({
      userId: user?.userId,
      userName: user?.userName,
      checked: true,
      amount: 0,
    }));
  }, [userList]);

  useEffect(() => {
    const storedData = localStorage.getItem("equalSplit");
    const parsedData = storedData ? JSON.parse(storedData) : null;

    if (parsedData && parsedData?.totalBillValue === totalBill) {
      setSplits(parsedData?.usersList);
    } else {
      const newSplits = initializeSplits();
      setSplits(newSplits);
      calculateSplit(newSplits);
    }
  }, [totalBill, initializeSplits]);

  useEffect(() => {
    if (splits?.length > 0) {
      const data = {
        totalBillValue: totalBill,
        usersList: splits,
      };
      localStorage.setItem("equalSplit", JSON.stringify(data));
      onSplitChange(splits);
    }
    return () => {
      if (splits?.length > 0) {
        const data = {
          totalBillValue: totalBill,
          usersList: splits,
        };
        localStorage.setItem("equalSplit", JSON.stringify(data));
        onSplitChange(splits);
      }
    };
  }, [splits, totalBill, onSplitChange]);

  const calculateSplit = useCallback(
    (currentSplits) => {
      const checkedUsers = currentSplits.filter((user) => user.checked);
      if (checkedUsers.length > 0 && totalBill > 0) {
        const splitAmount = (totalBill / checkedUsers.length).toFixed(2);
        const newSplits = currentSplits.map((user) => ({
          ...user,
          amount: user.checked ? parseFloat(splitAmount) : 0,
        }));
        setSplits(newSplits);
      } else {
        const newSplits = currentSplits.map((user) => ({
          ...user,
          amount: 0,
        }));
        setSplits(newSplits);
      }
    },
    [totalBill]
  );

  const handleCheckChange = (id, checked) => {
    const newSplits = splits.map((user) =>
      user.userId === id ? { ...user, checked } : user
    );

    const checkedCount = newSplits.filter((user) => user.checked).length;
    if (checkedCount === 0) {
      toast.error("At least one user must be selected");
      return;
    }

    calculateSplit(newSplits);
  };

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Split Details</h3>
      {splits.map((user) => (
        <div
          key={user.userId}
          className="flex items-center justify-between mb-2"
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`member-${user.userId}`}
              checked={user.checked}
              onChange={(e) => handleCheckChange(user.userId, e.target.checked)}
              className="mr-2"
            />
            <label htmlFor={`member-${user.userId}`} className="text-sm">
              {user.userName}
            </label>
          </div>
          <input
            type="number"
            value={user.amount.toFixed(2)}
            className="w-24 px-2 py-1 border-b border-gray-300 bg-gray-100"
            disabled
          />
        </div>
      ))}
    </div>
  );
}
