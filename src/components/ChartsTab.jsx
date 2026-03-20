import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { endpoints } from "../api/api";
import { getDatabyparams } from "../apiService/apiservice";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function ChartsTab({ groupDetails }) {
  const fetchGroupExpenses = async () => {
    const response = await getDatabyparams(endpoints.expensesByGroupId, groupDetails?.groupId);
    return response.data;
  };

  const {
    data: expensesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["groupExpenses", groupDetails?.groupId],
    queryFn: fetchGroupExpenses,
    enabled: !!groupDetails?.groupId,
  });

  if (isLoading) return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-card p-6 h-[400px] bg-slate-200/50"></div>
      <div className="glass-card p-6 h-[400px] bg-slate-200/50"></div>
    </div>
  );
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const expensesByName = expensesData.reduce((acc, expense) => {
    acc[expense.expenseName] = (acc[expense.expenseName] || 0) + expense.totalBill;
    return acc;
  }, {});

  const totalExpenses = Object.values(expensesByName).reduce((sum, value) => sum + value, 0);
  const pieChartData = Object.entries(expensesByName).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / totalExpenses) * 100).toFixed(2),
  }));

  const barChartData = groupDetails.groupUsers.map((user) => ({
    name: user.userName,
    balance: user.balance,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow">
          <p className="label">{`${data.name} : ₹ ${data.value} (${data.percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center list-none p-0">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="inline-flex items-center mr-4 mb-2">
            <svg width="10" height="10" className="mr-1">
              <rect width="10" height="10" fill={entry.color} />
            </svg>
            <span className="text-sm">{`${entry.value} (${entry.payload.percentage}%)`}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 border-t-4 border-t-indigo-500">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 text-indigo-600 text-sm">📊</span>
          Expenses by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" stroke="none">
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="glass-card p-6 border-t-4 border-t-violet-500">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center mr-3 text-violet-600 text-sm">📈</span>
          User Balances
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend />
            <Bar dataKey="balance" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
