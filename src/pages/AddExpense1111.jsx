// import React, { useState, useEffect } from "react";
// import { ArrowLeft, ChevronDown } from "lucide-react";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const groupMembers = [
//   { id: 1, name: "Alice" },
//   { id: 2, name: "Bob" },
//   { id: 3, name: "Charlie" },
//   { id: 4, name: "David" },
// ];

// export default function AddExpense() {
//   const [expenseName, setExpenseName] = useState("");
//   const [totalBill, setTotalBill] = useState("");
//   const [paidBy, setPaidBy] = useState("");
//   const [contribution, setContribution] = useState("equal");
//   const [splits, setSplits] = useState({});
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const initialSplits = {};
//     groupMembers.forEach((member) => {
//       initialSplits[member.id] = { checked: true, amount: "", percentage: "" };
//     });
//     setSplits(initialSplits);
//   }, []);

//   useEffect(() => {
//     if (contribution === "equal") {
//       const checkedMembers = Object.values(splits).filter((split) => split.checked).length;
//       if (checkedMembers > 0) {
//         const equalAmount = (parseFloat(totalBill) / checkedMembers).toFixed(2);
//         const newSplits = { ...splits };
//         Object.keys(newSplits).forEach((id) => {
//           newSplits[id].amount = newSplits[id].checked ? equalAmount : "0.00";
//           newSplits[id].percentage = ""; // Clear percentage on equal split
//         });
//         setSplits(newSplits);
//       }
//     } else if (contribution === "percentage" && totalBill) {
//       const newSplits = { ...splits };
//       Object.keys(newSplits).forEach((id) => {
//         if (newSplits[id].percentage) {
//           newSplits[id].amount = ((parseFloat(newSplits[id].percentage) / 100) * parseFloat(totalBill)).toFixed(2);
//         }
//       });
//       setSplits(newSplits);
//     }
//   }, [totalBill, contribution, splits]);

//   const handleContributionChange = (value) => {
//     setContribution(value);
//     setIsDropdownOpen(false);
//     // Reset splits when changing contribution type
//     const newSplits = { ...splits };
//     Object.keys(newSplits).forEach((id) => {
//       newSplits[id].amount = "";
//       newSplits[id].percentage = "";
//       newSplits[id].checked = value === "equal";
//     });
//     setSplits(newSplits);
//   };

//   const handleSplitChange = (id, field, value) => {
//     const newSplits = { ...splits };
//     newSplits[id][field] = value;

//     if (contribution === "equal") {
//       // Recalculate equal split when a member is checked/unchecked
//       const checkedMembers = Object.values(newSplits).filter((split) => split.checked).length;
//       if (checkedMembers > 0 && totalBill) {
//         const equalAmount = (parseFloat(totalBill) / checkedMembers).toFixed(2);
//         Object.keys(newSplits).forEach((memberId) => {
//           newSplits[memberId].amount = newSplits[memberId].checked ? equalAmount : "0.00";
//         });
//       }
//     } else if (contribution === "unequal") {
//       const total = Object.values(newSplits).reduce((sum, split) => sum + (parseFloat(split.amount) || 0), 0);
//       if (total > parseFloat(totalBill)) {
//         toast.error("Total split amount cannot exceed the total bill");
//         return;
//       }
//     } else if (contribution === "percentage") {
//       const totalPercentage = Object.values(newSplits).reduce((sum, split) => sum + (parseFloat(split.percentage) || 0), 0);
//       if (totalPercentage > 100) {
//         toast.error("Total percentage cannot exceed 100%");
//         return;
//       }
//       newSplits[id].amount = ((parseFloat(value) / 100) * parseFloat(totalBill)).toFixed(2);
//     }

//     setSplits(newSplits);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log({ expenseName, totalBill, paidBy, contribution, splits });
//     toast.success("Expense created successfully!");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <header className="flex items-center justify-between mb-6">
//         <button onClick={() => navigate(`/groups`)} className="p-2">
//           <ArrowLeft size={24} />
//         </button>
//         <h1 className="text-xl font-bold">Create Expense</h1>
//         <div className="w-6"></div>
//       </header>

//       <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
//         <div className="mb-4">
//           <label htmlFor="expenseName" className="block text-sm font-medium text-gray-700 mb-1">
//             Expense Name
//           </label>
//           <input
//             type="text"
//             id="expenseName"
//             value={expenseName}
//             onChange={(e) => setExpenseName(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter expense name"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="totalBill" className="block text-sm font-medium text-gray-700 mb-1">
//             Total Bill
//           </label>
//           <input
//             type="number"
//             id="totalBill"
//             value={totalBill}
//             onChange={(e) => setTotalBill(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter total bill amount"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-1">
//             Paid By
//           </label>
//           <select
//             id="paidBy"
//             value={paidBy}
//             onChange={(e) => setPaidBy(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           >
//             <option value="">Select who paid</option>
//             {groupMembers.map((member) => (
//               <option key={member.id} value={member.id}>
//                 {member.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Contribution</label>
//           <div className="sm:hidden relative">
//             <button
//               type="button"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             >
//               {contribution === "equal" ? "Equal Split" : contribution === "unequal" ? "Unequal Split" : "Percentage Split"}
//               <ChevronDown className="w-5 h-5" />
//             </button>
//             {isDropdownOpen && (
//               <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
//                 <button type="button" className="w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleContributionChange("equal")}>
//                   Equal Split
//                 </button>
//                 <button type="button" className="w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleContributionChange("unequal")}>
//                   Unequal Split
//                 </button>
//                 <button type="button" className="w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleContributionChange("percentage")}>
//                   Percentage Split
//                 </button>
//               </div>
//             )}
//           </div>
//           <div className="hidden sm:flex border-b border-gray-200">
//             <button type="button" className={`px-4 py-2 ${contribution === "equal" ? "border-b-2 border-blue-500" : ""}`} onClick={() => handleContributionChange("equal")}>
//               Equal Split
//             </button>
//             <button type="button" className={`px-4 py-2 ${contribution === "unequal" ? "border-b-2 border-blue-500" : ""}`} onClick={() => handleContributionChange("unequal")}>
//               Unequal Split
//             </button>
//             <button type="button" className={`px-4 py-2 ${contribution === "percentage" ? "border-b-2 border-blue-500" : ""}`} onClick={() => handleContributionChange("percentage")}>
//               Percentage Split
//             </button>
//           </div>
//         </div>

//         <div className="mb-4">
//           <h3 className="text-sm font-medium text-gray-700 mb-2">Split Details</h3>
//           {groupMembers.map((member) => (
//             <div key={member.id} className="flex items-center justify-between mb-2">
//               <div className="flex items-center">
//                 {contribution === "equal" && (
//                   <input type="checkbox" id={`member-${member.id}`} checked={splits[member.id]?.checked} onChange={(e) => handleSplitChange(member.id, "checked", e.target.checked)} className="mr-2" />
//                 )}
//                 <label htmlFor={`member-${member.id}`} className="text-sm">
//                   {member.name}
//                 </label>
//               </div>
//               {contribution === "percentage" ? (
//                 <div className="flex items-center">
//                   <input
//                     type="number"
//                     value={splits[member.id]?.percentage}
//                     onChange={(e) => handleSplitChange(member.id, "percentage", e.target.value)}
//                     className="w-16 px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
//                     placeholder="%"
//                   />
//                   <input type="text" value={splits[member.id]?.amount} className="w-24 ml-2 px-2 py-1 border-b border-gray-300 bg-gray-100" disabled />
//                 </div>
//               ) : (
//                 <input
//                   type="number"
//                   value={splits[member.id]?.amount}
//                   onChange={(e) => handleSplitChange(member.id, "amount", e.target.value)}
//                   className={`w-24 px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 ${contribution === "equal" ? "bg-gray-100" : ""}`}
//                   disabled={contribution === "equal"}
//                 />
//               )}
//             </div>
//           ))}
//         </div>

//         <button type="submit" className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
//           Create Expense
//         </button>
//       </form>
//     </div>
//   );
// }

// -----------------------------------------------------------------------------------------------------------------------------------------
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, ChevronDown } from "lucide-react";
// import toast from "react-hot-toast";

// const groupMembers = [
//   { id: 1, name: "Alice" },
//   { id: 2, name: "Bob" },
//   { id: 3, name: "Charlie" },
//   { id: 4, name: "David" },
// ];

// export default function AddExpense() {
//   const [expenseName, setExpenseName] = useState("");
//   const [totalBill, setTotalBill] = useState("");
//   const [paidBy, setPaidBy] = useState("");
//   const [contribution, setContribution] = useState("equal");
//   const [splits, setSplits] = useState({});
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   useEffect(() => {
//     const initialSplits = {};
//     groupMembers.forEach((member) => {
//       initialSplits[member.id] = { checked: true, amount: "", percentage: "" };
//     });
//     setSplits(initialSplits);
//   }, []);

//   useEffect(() => {
//     if (contribution === "equal") {
//       const checkedMembers = Object.values(splits).filter(
//         (split) => split.checked
//       ).length;
//       if (checkedMembers > 0) {
//         const equalAmount = (parseFloat(totalBill) / checkedMembers).toFixed(2);
//         const newSplits = { ...splits };
//         Object.keys(newSplits).forEach((id) => {
//           newSplits[id].amount = newSplits[id].checked ? equalAmount : "0.00";
//           newSplits[id].percentage = ""; // Clear percentage on equal split
//         });
//         setSplits(newSplits);
//       }
//     } else if (contribution === "percentage" && totalBill) {
//       const newSplits = { ...splits };
//       Object.keys(newSplits).forEach((id) => {
//         if (newSplits[id].percentage) {
//           newSplits[id].amount = (
//             (parseFloat(newSplits[id].percentage) / 100) *
//             parseFloat(totalBill)
//           ).toFixed(2);
//         }
//       });
//       setSplits(newSplits);
//     }
//   }, [totalBill, contribution, splits]);

//   const handleContributionChange = (value) => {
//     setContribution(value);
//     setIsDropdownOpen(false);
//     // Reset splits when changing contribution type
//     const newSplits = { ...splits };
//     Object.keys(newSplits).forEach((id) => {
//       newSplits[id].amount = "";
//       newSplits[id].percentage = "";
//       newSplits[id].checked = value === "equal";
//     });
//     setSplits(newSplits);
//   };

//   const handleSplitChange = (id, field, value) => {
//     const newSplits = { ...splits };
//     newSplits[id][field] = value;

//     if (contribution === "equal") {
//       // Recalculate equal split when a member is checked/unchecked
//       const checkedMembers = Object.values(newSplits).filter(
//         (split) => split.checked
//       ).length;
//       if (checkedMembers > 0 && totalBill) {
//         const equalAmount = (parseFloat(totalBill) / checkedMembers).toFixed(2);
//         Object.keys(newSplits).forEach((memberId) => {
//           newSplits[memberId].amount = newSplits[memberId].checked ? equalAmount : "0.00";
//         });
//       }
//     } else if (contribution === "unequal") {
//       const total = Object.values(newSplits).reduce(
//         (sum, split) => sum + (parseFloat(split.amount) || 0),
//         0
//       );
//       if (total > parseFloat(totalBill)) {
//         toast.error("Total split amount cannot exceed the total bill");
//         return;
//       }
//     } else if (contribution === "percentage") {
//       const totalPercentage = Object.values(newSplits).reduce(
//         (sum, split) => sum + (parseFloat(split.percentage) || 0),
//         0
//       );
//       if (totalPercentage > 100) {
//         toast.error("Total percentage cannot exceed 100%");
//         return;
//       }
//       const percentage = parseFloat(value) || 0;
//       newSplits[id].amount = totalBill ? ((percentage / 100) * parseFloat(totalBill)).toFixed(2) : "";
//     }

//     setSplits(newSplits);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log({ expenseName, totalBill, paidBy, contribution, splits });
//     toast.success("Expense created successfully!");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <header className="flex items-center justify-between mb-6">
//         <button className="p-2" aria-label="Go back">
//           <ArrowLeft className="w-6 h-6" />
//         </button>
//         <h1 className="text-xl font-bold">Create Expense</h1>
//         <div className="w-6"></div>
//       </header>

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto"
//       >
//         <div className="mb-4">
//           <label
//             htmlFor="expenseName"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Expense Name
//           </label>
//           <input
//             type="text"
//             id="expenseName"
//             value={expenseName}
//             onChange={(e) => setExpenseName(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter expense name"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="totalBill"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Total Bill
//           </label>
//           <input
//             type="number"
//             id="totalBill"
//             value={totalBill}
//             onChange={(e) => setTotalBill(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter total bill amount"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="paidBy"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Paid By
//           </label>
//           <select
//             id="paidBy"
//             value={paidBy}
//             onChange={(e) => setPaidBy(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           >
//             <option value="">Select who paid</option>
//             {groupMembers.map((member) => (
//               <option key={member.id} value={member.id}>
//                 {member.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Contribution
//           </label>
//           <div className="sm:hidden relative">
//             <button
//               type="button"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             >
//               {contribution === "equal"
//                 ? "Equal Split"
//                 : contribution === "unequal"
//                 ? "Unequal Split"
//                 : "Percentage Split"}
//               <ChevronDown className="w-5 h-5" />
//             </button>
//             {isDropdownOpen && (
//               <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
//                 <button
//                   type="button"
//                   className="w-full px-4 py-2 text-left hover:bg-gray-100"
//                   onClick={() => handleContributionChange("equal")}
//                 >
//                   Equal Split
//                 </button>
//                 <button
//                   type="button"
//                   className="w-full px-4 py-2 text-left hover:bg-gray-100"
//                   onClick={() => handleContributionChange("unequal")}
//                 >
//                   Unequal Split
//                 </button>
//                 <button
//                   type="button"
//                   className="w-full px-4 py-2 text-left hover:bg-gray-100"
//                   onClick={() => handleContributionChange("percentage")}
//                 >
//                   Percentage Split
//                 </button>
//               </div>
//             )}
//           </div>
//           <div className="hidden sm:flex border-b border-gray-200">
//             <button
//               type="button"
//               className={`px-4 py-2 ${
//                 contribution === "equal" ? "border-b-2 border-blue-500" : ""
//               }`}
//               onClick={() => handleContributionChange("equal")}
//             >
//               Equal Split
//             </button>
//             <button
//               type="button"
//               className={`px-4 py-2 ${
//                 contribution === "unequal" ? "border-b-2 border-blue-500" : ""
//               }`}
//               onClick={() => handleContributionChange("unequal")}
//             >
//               Unequal Split
//             </button>
//             <button
//               type="button"
//               className={`px-4 py-2 ${
//                 contribution === "percentage"
//                   ? "border-b-2 border-blue-500"
//                   : ""
//               }`}
//               onClick={() => handleContributionChange("percentage")}
//             >
//               Percentage Split
//             </button>
//           </div>
//         </div>

//         <div className="mb-4">
//           <h3 className="text-sm font-medium text-gray-700 mb-2">
//             Split Details
//           </h3>
//           {groupMembers.map((member) => (
//             <div
//               key={member.id}
//               className="flex items-center justify-between mb-2"
//             >
//               <div className="flex items-center">
//                 {contribution === "equal" && (
//                   <input
//                     type="checkbox"
//                     id={`member-${member.id}`}
//                     checked={splits[member.id]?.checked}
//                     onChange={(e) =>
//                       handleSplitChange(member.id, "checked", e.target.checked)
//                     }
//                     className="mr-2"
//                   />
//                 )}
//                 <label htmlFor={`member-${member.id}`} className="text-sm">
//                   {member.name}
//                 </label>
//               </div>
//               {contribution === "percentage" ? (
//                 <div className="flex items-center">
//                   <input
//                     type="number"
//                     value={splits[member.id]?.percentage || ""}
//                     onChange={(e) =>
//                       handleSplitChange(member.id, "percentage", e.target.value)
//                     }
//                     className="w-16 px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
//                     placeholder="%"
//                   />
//                   <input
//                     type="text"
//                     value={splits[member.id]?.amount}
//                     className="w-24 ml-2 px-2 py-1 border-b border-gray-300 bg-gray-100"
//                     disabled
//                   />
//                 </div>
//               ) : (
//                 <input
//                   type="number"
//                   value={splits[member.id]?.amount}
//                   onChange={(e) =>
//                     handleSplitChange(member.id, "amount", e.target.value)
//                   }
//                   className={`w-24 px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 ${
//                     contribution === "equal" ? "bg-gray-100" : ""
//                   }`}
//                   disabled={contribution === "equal"}
//                 />
//               )}
//             </div>
//           ))}
//         </div>

//         <button
//           type="submit"
//           className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//         >
//           Create Expense
//         </button>
//       </form>
//     </div>
//   );
// }

// ---------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const groupMembers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "David" },
];

export default function AddExpense() {
  const [expenseName, setExpenseName] = useState("");
  const [totalBill, setTotalBill] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [contribution, setContribution] = useState("equal");
  const [splits, setSplits] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const initialSplits = {};
    groupMembers.forEach((member) => {
      initialSplits[member.id] = { checked: true, amount: "", percentage: "" };
    });
    setSplits(initialSplits);
  }, []);

  useEffect(() => {
    if (totalBill === "") {
      clearSplits();
    } else if (contribution === "equal") {
      calculateEqualSplit();
    } else if (contribution === "percentage") {
      calculatePercentageSplit();
    }
  }, [totalBill, contribution]);

  const clearSplits = () => {
    const newSplits = { ...splits };
    Object.keys(newSplits).forEach((id) => {
      newSplits[id].amount = "";
      newSplits[id].percentage = "";
    });
    setSplits(newSplits);
  };

  const calculateEqualSplit = () => {
    const checkedMembers = Object.values(splits).filter((split) => split.checked).length;
    if (checkedMembers > 0 && totalBill) {
      const equalAmount = (parseFloat(totalBill) / checkedMembers).toFixed(2);
      const newSplits = { ...splits };
      Object.keys(newSplits).forEach((id) => {
        newSplits[id].amount = newSplits[id].checked ? equalAmount : "0.00";
        newSplits[id].percentage = newSplits[id].checked ? ((parseFloat(equalAmount) / parseFloat(totalBill)) * 100).toFixed(2) : "0.00";
      });
      setSplits(newSplits);
    }
  };

  const calculatePercentageSplit = () => {
    if (totalBill) {
      const newSplits = { ...splits };
      Object.keys(newSplits).forEach((id) => {
        if (newSplits[id].percentage) {
          newSplits[id].amount = ((parseFloat(newSplits[id].percentage) / 100) * parseFloat(totalBill)).toFixed(2);
        }
      });
      setSplits(newSplits);
    }
  };

  const handleContributionChange = (value) => {
    setContribution(value);
    setIsDropdownOpen(false);
    clearSplits();
    if (value === "equal" && totalBill) {
      calculateEqualSplit();
    }
  };

  const handleSplitChange = (id, field, value) => {
    const newSplits = { ...splits };

    if (field === "checked") {
      const checkedCount = Object.values(newSplits).filter((split) => split.checked).length;
      if (checkedCount === 1 && !value) {
        toast.error("At least one member must be selected");
        return;
      }
      newSplits[id].checked = value;
      if (contribution === "equal") {
        calculateEqualSplit();
        return;
      }
    } else if (field === "amount") {
      if (contribution === "unequal") {
        const newAmount = parseFloat(value) || 0;
        const oldAmount = parseFloat(newSplits[id].amount) || 0;
        const totalSplitAmount = Object.values(newSplits).reduce((sum, split) => sum + (parseFloat(split.amount) || 0), 0) - oldAmount + newAmount;

        if (totalSplitAmount > parseFloat(totalBill)) {
          toast.error("Total split amount cannot exceed the total bill");
          return;
        }

        newSplits[id].amount = value;
        if (totalBill) {
          newSplits[id].percentage = ((newAmount / parseFloat(totalBill)) * 100).toFixed(2);
        }
      }
    } else if (field === "percentage") {
      if (contribution === "percentage") {
        const newPercentage = parseFloat(value) || 0;
        const totalPercentage = Object.values(newSplits).reduce((sum, split) => sum + (parseFloat(split.percentage) || 0), 0) - (parseFloat(newSplits[id].percentage) || 0) + newPercentage;

        if (totalPercentage > 100) {
          toast.error("Total percentage cannot exceed 100%");
          return;
        }

        newSplits[id].percentage = value;
        if (totalBill) {
          newSplits[id].amount = ((newPercentage / 100) * parseFloat(totalBill)).toFixed(2);
        }
      }
    }

    setSplits(newSplits);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ expenseName, totalBill, paidBy, contribution, splits });
    toast.success("Expense created successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex items-center justify-between mb-6">
        <button className="p-2" aria-label="Go back">
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
              setTotalBill(value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter total bill amount"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-1">
            Paid By
          </label>
          <select
            id="paidBy"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select who paid</option>
            {groupMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
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

        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Split Details</h3>
          {groupMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {contribution === "equal" && (
                  <input type="checkbox" id={`member-${member.id}`} checked={splits[member.id]?.checked} onChange={(e) => handleSplitChange(member.id, "checked", e.target.checked)} className="mr-2" />
                )}
                <label htmlFor={`member-${member.id}`} className="text-sm">
                  {member.name}
                </label>
              </div>
              {contribution === "percentage" ? (
                <div className="flex items-center">
                  <input
                    type="number"
                    value={splits[member.id]?.percentage}
                    onChange={(e) => handleSplitChange(member.id, "percentage", e.target.value)}
                    className="w-16 px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    placeholder="%"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <span className="mx-2">=</span>
                  <input type="text" value={splits[member.id]?.amount} className="w-24 px-2 py-1 border-b border-gray-300 bg-gray-100" disabled />
                </div>
              ) : (
                <input
                  type="number"
                  value={splits[member.id]?.amount}
                  onChange={(e) => handleSplitChange(member.id, "amount", e.target.value)}
                  className={`w-24 px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 ${contribution === "equal" ? "bg-gray-100" : ""}`}
                  disabled={contribution === "equal"}
                  min="0"
                  step="0.01"
                />
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Create Expense
        </button>
      </form>
    </div>
  );
}
