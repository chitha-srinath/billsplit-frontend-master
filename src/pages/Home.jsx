// import React from "react";
// import { Plus } from "lucide-react";
// import {
//   PieChart,
//   Pie,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { useQuery } from "@tanstack/react-query";
// import { summaryData, pieChartData, barChartData } from "../commondata";

// const fetchHomeData = async () => {
//   // Simulating API call
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   return { summaryData, pieChartData, barChartData };
// };

// const Home = () => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["homeData"],
//     queryFn: fetchHomeData,
//   });

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>An error occurred: {error.message}</div>;

//   const { summaryData, pieChartData, barChartData } = data;

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-white rounded-lg shadow-md p-4 col-span-2">
//           <h2 className="text-lg font-semibold mb-4">Summary</h2>
//           <div className="grid grid-cols-3 gap-4">
//             <div className="text-center">
//               <p className="text-2xl font-bold text-blue-600">
//                 {summaryData.totalGroups}
//               </p>
//               <p className="text-sm text-gray-600">Total Groups</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold text-red-500">
//                 ${summaryData.amountOwing}
//               </p>
//               <p className="text-sm text-gray-600">You Owe</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold text-green-500">
//                 ${summaryData.amountOwed}
//               </p>
//               <p className="text-sm text-gray-600">Owed to You</p>
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col space-y-2">
//           <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center">
//             <Plus className="w-5 h-5 mr-2" />
//             Add Group Expense
//           </button>
//           <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center justify-center">
//             <Plus className="w-5 h-5 mr-2" />
//             Add Friend
//           </button>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white rounded-lg shadow-md p-4">
//           <h2 className="text-lg font-semibold mb-4">Monthly Overview</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie dataKey="value" data={pieChartData} fill="#8884d8" label />
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="bg-white rounded-lg shadow-md p-4">
//           <h2 className="text-lg font-semibold mb-4">Expense Trend</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={barChartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="youOwe" fill="#f87171" />
//               <Bar dataKey="owedToYou" fill="#34d399" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { endpoints } from "../api/api";
import { getDatabyparams } from "../apiService/apiservice";

const fetchHomeData = async (userId) => {
  const response = await getDatabyparams(endpoints.getHomeUserData, userId);

  return response.data;
};

const fetchHomeBarChartData = async (userId) => {
  const response = await getDatabyparams(endpoints.barGraphHome, userId);

  return response.data;
};

const fetchHomePieChartData = async (userId) => {
  const response = await getDatabyparams(endpoints.pieChartHome, userId);

  return response.data;
};

export default function Home() {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth?.user);
  const { data, isLoading, error } = useQuery({
    queryKey: ["homeData", authUser?.userId],
    queryFn: () => fetchHomeData(authUser?.userId),
    enabled: !!authUser?.userId,
  });
  const {
    data: barChartData,
    isLoading: barLoading,
    error: barError,
  } = useQuery({
    queryKey: ["homebarGraphData", authUser?.userId],
    queryFn: () => fetchHomeBarChartData(authUser?.userId),
    enabled: !!authUser?.userId,
  });
  const {
    data: pieChartData,
    isLoading: pieLoading,
    error: pieError,
  } = useQuery({
    queryKey: ["homepieChartData", authUser?.userId],
    queryFn: () => fetchHomePieChartData(authUser?.userId),
    enabled: !!authUser?.userId,
  });
  //if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (isLoading)
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6 md:col-span-2 h-40 bg-slate-200/50"></div>
          <div className="flex flex-col space-y-3 justify-center">
            <div className="h-[52px] bg-slate-200/50 rounded-lg w-full"></div>
            <div className="h-[52px] bg-slate-200/50 rounded-lg w-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-6 h-[380px] bg-slate-200/50"></div>
          <div className="glass-card p-6 h-[380px] bg-slate-200/50"></div>
        </div>
      </div>
    );
  if (error) return <div className="text-center py-4 text-red-500">An error occurred: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 md:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 text-indigo-600 text-sm">📊</span>
            Summary
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Link to="/groups" className="text-3xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                {data?.totalGroups}
              </Link>
              <p className="text-sm font-medium text-slate-500 mt-2">Total Groups</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-3xl font-bold text-rose-500">₹{data?.amountOwing * -1}</p>
              <p className="text-sm font-medium text-slate-500 mt-2">You Owe</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-3xl font-bold text-emerald-500">₹{data?.amountOwed}</p>
              <p className="text-sm font-medium text-slate-500 mt-2">Owed to You</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-3 justify-center">
          <button className="btn-primary py-3 w-full" onClick={() => navigate("/groups/create")}>
            <Plus className="w-5 h-5 mr-2" />
            New Group
          </button>
          <button className="btn-secondary py-3 w-full" onClick={() => navigate("/friends/addfriend")}>
            <Plus className="w-5 h-5 mr-2" />
            Add Friend
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-6 border-t-4 border-t-indigo-500">
          <h2 className="text-lg font-bold text-slate-800 mb-6 text-center">Overall Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="value" data={pieChartData} fill="#8884d8" label />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-6 border-t-4 border-t-violet-500">
          <h2 className="text-lg font-bold text-slate-800 mb-6 text-center">Expense Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="MonthName" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" />
              <Bar dataKey="Your Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="You Paid" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
