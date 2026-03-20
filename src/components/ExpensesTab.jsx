// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { getDatabyparams } from "../apiService/apiservice";
// import { endpoints } from "../api/api";
// import { useQuery } from "@tanstack/react-query";

// export default function ExpensesTab({ groupId }) {
//   const navigate = useNavigate();

//   const fetchGroupExpenses = async (groupid) => {
//     const response = await getDatabyparams(endpoints.expensesByGroupId, groupid);
//     return response.data;
//   };

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["groupExpenses", groupId],
//     queryFn: fetchGroupExpenses(groupId),
//   });
//   if (isLoading) {
//     return <p>Loading...</p>;
//   }
//   return (
//     <div className="space-y-4">
//       {data?.length > 0 &&
//         data?.map((expense) => (
//           <div key={expense.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow cursor-pointer" onClick={() => navigate(`/groups/${groupId}/expense/${expense.id}`)}>
//             <div className="flex items-center">
//               <div className="bg-gray-200 p-2 rounded-full mr-4">🛒</div>
//               <div>
//                 <h3 className="font-semibold">{expense.description}</h3>
//                 <p className="text-sm text-gray-600">{expense.date}</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="font-semibold">
//                 {expense.currency} {expense.cost}
//               </p>
//               <p className="text-sm text-gray-600">{expense.paidBy} paid</p>
//             </div>
//           </div>
//         ))}
//     </div>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";
import { getDatabyparams } from "../apiService/apiservice";
import { endpoints } from "../api/api";
import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";

export default function ExpensesTab({ groupId }) {
  const navigate = useNavigate();

  const fetchGroupExpenses = async () => {
    const response = await getDatabyparams(endpoints.expensesByGroupId, groupId);
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["groupExpenses", groupId],
    queryFn: fetchGroupExpenses,
    enabled: !!groupId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="interactive-card p-4 h-[80px] animate-pulse bg-slate-200/50"></div>
        ))}
      </div>
    );
  }

  console.log("----Expenes list-Data-------", JSON.stringify(data));

  if (error) {
    return <div className="text-center py-4 text-red-500">An error occurred: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-gray-500">No expenses found for this group.</div>;
  }

  return (
    <div className="space-y-4">
      {data.map((expense) => (
        <div
          key={expense?.expenseId}
          className="interactive-card p-4 flex items-center justify-between"
          onClick={() => navigate(`/groups/${groupId}/expense/${expense?.expenseId}`, { state: { expenseId: expense?.expenseId, groupId: groupId } })}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl mr-4 shadow-sm text-indigo-600">
              🛒
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{expense?.expenseName}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{new Date(expense?.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-slate-800">₹ {expense?.totalBill?.toFixed(2)}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5"><span className="text-indigo-600">{expense?.paidByuserName}</span> paid</p>
          </div>
        </div>
      ))}
    </div>
  );
}
