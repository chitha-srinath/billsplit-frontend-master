import axios from "axios";
axios.defaults.withCredentials = true;

// console.log(import.meta.env.VITE_APP_API_URL);
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

export const endpoints = {
  register: "auth/register",
  login: "auth/login",
  checkAuth: "auth/getUserDetails",
  logout: "auth/signout",
  getFriends: "friends/getFriends",
  addFriend: "friends/sendFriendRequest",
  getfrndRequests: "friends/getFriendRequests",
  updateFriendRequest: "friends/updateFriendRequest",
  searchFriends: "friends/searchFriends",
  createGroup: "groups/createGroup",
  fetchGroups: "groups/getGroups",
  fetchGroupDetails: "groups/getGroup",
  userOweorOwed: "groups/userOweorOwed",
  addExpense: "expense/createExpense",
  expensesByGroupId: "expense/getExpenses",
  fetchExpenseDetails: "expense/getExpenseDetails",
  getGroupUsersBalance: "groups/getUsersBalance",
  getUserGroupBalance: "groups/getUserGroupBalance",
  getHomeUserData: "groups/home/userData",
  barGraphHome: "groups/home/graphbar",
  pieChartHome: "groups/home/piechart",
  googleLogin: "auth/google"
  // Add other endpoints as needed
};

export default api;
