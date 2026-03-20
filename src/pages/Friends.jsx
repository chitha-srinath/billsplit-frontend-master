// import React, { useState, useEffect, useRef } from "react";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { Search, ChevronDown, ArrowUpDown, Plus, X } from "lucide-react";
// import { debounce } from "lodash";
// import axios from "axios";
// import Loader from "../components/Loader";
// import { postData } from "../apiService/apiservice";
// import { endpoints } from "../api/api";

// const fetchFriends = async ({ pageParam = 0, sortBy, sortOrder, searchTerm, userId }) => {
//   const response = await api.post("/user/getFriends", {
//     userId,
//     page: pageParam,
//     sortBy,
//     sortOrder,
//     searchTerm,
//   });
//   return response.data;
// };

// const FriendCard = ({ friend }) => (
//   <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
//     <div>
//       <h3 className="text-lg font-semibold">{friend?.user2Name}</h3>
//       <p className="text-sm text-gray-600">{friend?.user2Email}</p>
//       {/**
//         <p className="text-sm text-gray-600">{friend?.phone}</p>
//          */}
//     </div>
//     <span
//       className={`text-sm px-2 py-1 rounded-full ${
//         friend?.status === "accepted" ? "bg-green-100 text-green-800" : friend?.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
//       }`}
//     >
//       {friend?.status.charAt(0).toUpperCase() + friend?.status.slice(1)}
//     </span>
//   </div>
// );

// export default function Friends() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("alphabetical");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [showSortMenu, setShowSortMenu] = useState(false);
//   const navigate = useNavigate();
//   const observerRef = useRef(null);
//   const userId = useSelector((state) => state.auth?.user?.userid);

//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
//     queryKey: ["friends", sortBy, sortOrder, searchTerm, userId],
//     queryFn: ({ pageParam = 0 }) =>
//       postData(endpoints.getFriends, {
//         userId,
//         page: pageParam,
//         sortBy,
//         sortOrder,
//         searchTerm,
//       }),
//     getNextPageParam: (lastPage) => lastPage.nextPage,
//     enabled: !!userId,
//   });

//   const debouncedSearch = debounce((value) => {
//     setSearchTerm(value);
//   }, 300);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
//           fetchNextPage();
//         }
//       },
//       { threshold: 1.0 }
//     );

//     if (observerRef.current) {
//       observer.observe(observerRef.current);
//     }

//     return () => observer.disconnect();
//   }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

//   const handleSortChange = (newSortBy) => {
//     setSortBy(newSortBy);
//     setShowSortMenu(false);
//   };

//   const toggleSortOrder = () => {
//     setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//   };
//   console.log("---data---", data);
//   // const friendsList = data?.pages[0]?.data?.flatMap((page) => page.friends) || [];
//   const friendsList = data?.pages[0]?.data;

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Friends</h1>
//         <button onClick={() => navigate("/friends/addfriend")} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
//           <Plus className="w-5 h-5 mr-2" />
//           Add Friend
//         </button>
//       </div>

//       <div className="flex items-center space-x-2 mb-4">
//         <div className="relative flex-1">
//           <input type="text" placeholder="Search friends..." className="w-full p-2 pl-10 pr-4 border rounded-md" onChange={(e) => debouncedSearch(e.target.value)} />
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//           {searchTerm && (
//             <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" onClick={() => setSearchTerm("")} aria-label="Clear search">
//               <X size={20} />
//             </button>
//           )}
//         </div>
//         <div className="relative">
//           <button className="p-2 border rounded-md flex items-center" onClick={() => setShowSortMenu(!showSortMenu)}>
//             <span className="mr-2">{sortBy === "alphabetical" ? "Alphabetical" : "Recently Added"}</span>
//             <ChevronDown size={20} />
//           </button>
//           {showSortMenu && (
//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
//               <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleSortChange("alphabetical")}>
//                 Alphabetical
//               </button>
//               <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleSortChange("recent")}>
//                 Recently Added
//               </button>
//             </div>
//           )}
//         </div>
//         <button onClick={toggleSortOrder} className="p-2 border rounded-md flex items-center" aria-label={sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}>
//           <ArrowUpDown size={20} />
//         </button>
//       </div>

//       {isLoading && (
//         <div className="flex items-center justify-center h-full">
//           <Loader />
//         </div>
//       )}
//       {error && <div className="text-center py-4 text-red-500">An error occurred: {error.message}</div>}

//       {friendsList?.length > 0 ? friendsList.map((friend) => <FriendCard key={friend?.user2Id} friend={friend} />) : <span className="text-center">No Friends Found</span>}

//       {hasNextPage && (
//         <div ref={observerRef} className="h-10 flex items-center justify-center">
//           {isFetchingNextPage ? <Loader /> : ""}
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from "react";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { Search, ChevronDown, ArrowUpDown, Plus, X } from "lucide-react";
// import { debounce } from "lodash";
// import Loader from "../components/Loader";
// import { postData } from "../apiService/apiservice";
// import { endpoints } from "../api/api";

// const FriendCard = ({ friend }) => (
//   <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
//     <div>
//       <h3 className="text-lg font-semibold">{friend?.user2Name ?? friend?.user2Email?.split("@")[0]}</h3>
//       <p className="text-sm text-gray-600">{friend?.user2Email}</p>
//       {/**
//         <p className="text-sm text-gray-600">{friend?.phone}</p>
//          */}
//     </div>
//     <span
//       className={`text-sm px-2 py-1 rounded-full ${
//         friend?.status === "accepted" ? "bg-green-100 text-green-800" : friend?.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
//       }`}
//     >
//       {friend?.status.charAt(0).toUpperCase() + friend?.status.slice(1)}
//     </span>
//   </div>
// );

// export default function Friends() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("alphabetical");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [showSortMenu, setShowSortMenu] = useState(false);
//   const [activeFilter, setActiveFilter] = useState("all");
//   const navigate = useNavigate();
//   const observerRef = useRef(null);
//   const userId = useSelector((state) => state.auth?.user?.userid);

//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
//     queryKey: ["friends", sortBy, sortOrder, searchTerm, userId, activeFilter],
//     queryFn: ({ pageParam = 0 }) =>
//       postData(endpoints.getFriends, {
//         userId,
//         page: pageParam,
//         sortBy,
//         sortOrder,
//         searchTerm,
//         status: activeFilter,
//       }),
//     getNextPageParam: (lastPage) => lastPage.nextPage,
//     enabled: !!userId,
//   });

//   const debouncedSearch = debounce((value) => {
//     setSearchTerm(value);
//   }, 300);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
//           fetchNextPage();
//         }
//       },
//       { threshold: 1.0 }
//     );

//     if (observerRef.current) {
//       observer.observe(observerRef.current);
//     }

//     return () => observer.disconnect();
//   }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

//   const handleSortChange = (newSortBy) => {
//     setSortBy(newSortBy);
//     setShowSortMenu(false);
//   };

//   const toggleSortOrder = () => {
//     setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//   };

//   // const friendsList = data?.pages?.flatMap((page) => page.friends) || [];
//   const friendsList = data?.pages[0]?.data?.friends || [];

//   const filterTags = [
//     { name: "All", value: "all" },
//     { name: "Accepted", value: "accepted" },
//     { name: "Rejected", value: "rejected" },
//     { name: "Pending", value: "pending" },
//   ];

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold mb-4 sm:mb-0">Friends</h1>
//         <button onClick={() => navigate("/friends/addfriend")} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
//           <Plus className="w-5 h-5 mr-2" />
//           Add Friend
//         </button>
//       </div>

//       <div className="flex items-center space-x-2 mb-4">
//         <div className="relative flex-1">
//           <input type="text" placeholder="Search friends..." className="w-full p-2 pl-10 pr-4 border rounded-md" onChange={(e) => debouncedSearch(e.target.value)} />
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//           {searchTerm && (
//             <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" onClick={() => setSearchTerm("")} aria-label="Clear search">
//               <X size={20} />
//             </button>
//           )}
//         </div>
//         <div className="relative">
//           <button className="p-2 border rounded-md flex items-center" onClick={() => setShowSortMenu(!showSortMenu)}>
//             <span className="mr-2">{sortBy === "alphabetical" ? "Alphabetical" : "Recently Added"}</span>
//             <ChevronDown size={20} />
//           </button>
//           {showSortMenu && (
//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
//               <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleSortChange("alphabetical")}>
//                 Alphabetical
//               </button>
//               <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleSortChange("recent")}>
//                 Recently Added
//               </button>
//             </div>
//           )}
//         </div>
//         <button onClick={toggleSortOrder} className="p-2 border rounded-md flex items-center" aria-label={sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}>
//           <ArrowUpDown size={20} />
//         </button>
//       </div>
//       <div className="flex flex-wrap gap-2 mb-4">
//         {filterTags.map((tag) => (
//           <button
//             key={tag.value}
//             onClick={() => setActiveFilter(tag.value)}
//             className={`px-3 py-1 rounded-full text-sm ${activeFilter === tag.value ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
//           >
//             {tag.name}
//           </button>
//         ))}
//       </div>

//       {isLoading && (
//         <div className="flex items-center justify-center h-full">
//           <Loader />
//         </div>
//       )}
//       {error && <div className="text-center py-4 text-red-500">An error occurred: {error.message}</div>}

//       {friendsList?.length > 0 ? friendsList?.map((friend) => <FriendCard key={friend?.user2Id} friend={friend} />) : <span className="text-center block">No Friends Found</span>}

//       {hasNextPage && (
//         <div ref={observerRef} className="h-10 flex items-center justify-center">
//           {isFetchingNextPage ? <Loader /> : ""}
//         </div>
//       )}
//     </div>
//   );
// }

//--------------------------------------------------------
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, ChevronDown, ArrowUpDown, Plus, X } from "lucide-react";
import { debounce } from "lodash";
import Loader from "../components/Loader";
import { postData } from "../apiService/apiservice";
import { endpoints } from "../api/api";

const FriendCard = ({ friend }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
    <div>
      <h3 className="text-lg font-semibold">{friend?.user2Name ?? friend?.user2Email?.split("@")[0]}</h3>
      <p className="text-sm text-gray-600">{friend?.user2Email}</p>
    </div>
    <span
      className={`text-sm px-2 py-1 rounded-full ${
        friend?.status === "accepted" ? "bg-green-100 text-green-800" : friend?.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
      }`}
    >
      {friend?.status.charAt(0).toUpperCase() + friend?.status.slice(1)}
    </span>
  </div>
);

export default function Friends() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [sortBy, setSortBy] = useState("alphabetical");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const userId = useSelector((state) => state.auth?.user?.userId);
  const queryClient = useQueryClient();

  const fetchFriends = async ({ pageParam = 0 }) => {
    const response = await postData(endpoints.getFriends, {
      userId,
      page: pageParam,
      sortBy,
      sortOrder,
      searchTerm,
      status: activeFilter !== "all" ? activeFilter : undefined,
    });
    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, refetch } = useInfiniteQuery({
    queryKey: ["friends", sortBy, sortOrder, searchTerm, userId, activeFilter],
    queryFn: fetchFriends,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!userId,
  });

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      queryClient.resetQueries(["friends"]);
    }, 300),
    [queryClient]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setInputValue("");
    setSearchTerm("");
    queryClient.resetQueries(["groups"]);
  };

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    refetch();
  }, [sortBy, sortOrder, activeFilter, refetch]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setShowSortMenu(false);
    queryClient.resetQueries(["friends"]);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    queryClient.resetQueries(["friends"]);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    queryClient.resetQueries(["friends"]);
  };

  const friendsList = data?.pages.flatMap((page) => page.friends) || [];

  const filterTags = [
    { name: "All", value: "all" },
    { name: "Accepted", value: "accepted" },
    { name: "Rejected", value: "rejected" },
    { name: "Pending", value: "pending" },
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Friends</h1>
        <button onClick={() => navigate("/friends/addfriend")} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Friend
        </button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <input type="text" placeholder="Search friends..." className="w-full p-2 pl-10 pr-4 border rounded-md" value={inputValue} onChange={handleInputChange} />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          {searchTerm && (
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" onClick={clearSearch} aria-label="Clear search">
              <X size={20} />
            </button>
          )}
        </div>
        <div className="relative">
          <button className="p-2 border rounded-md flex items-center" onClick={() => setShowSortMenu(!showSortMenu)}>
            <span className="mr-2">{sortBy === "alphabetical" ? "Alphabetical" : "Recently Added"}</span>
            <ChevronDown size={20} />
          </button>
          {showSortMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleSortChange("alphabetical")}>
                Alphabetical
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleSortChange("recent")}>
                Recently Added
              </button>
            </div>
          )}
        </div>
        <button onClick={toggleSortOrder} className="p-2 border rounded-md flex items-center" aria-label={sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}>
          <ArrowUpDown size={20} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {filterTags.map((tag) => (
          <button
            key={tag.value}
            onClick={() => handleFilterChange(tag.value)}
            className={`px-3 py-1 rounded-full text-sm ${activeFilter === tag.value ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <Loader />
        </div>
      )}
      {error && <div className="text-center py-4 text-red-500">An error occurred: {error.message}</div>}

      {friendsList.length > 0 ? friendsList.map((friend) => <FriendCard key={friend?.friendRequestId} friend={friend} />) : <span className="text-center block">No Friends Found</span>}

      {(hasNextPage || isFetchingNextPage) && (
        <div ref={observerRef} className="h-10 flex items-center justify-center">
          {isFetchingNextPage ? <Loader /> : "Load more"}
        </div>
      )}
    </div>
  );
}
