import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, Search, X, Filter, ChevronDown } from "lucide-react";
// import { fetchGroups } from "../data/groupsData";
import Loader from "../components/Loader";
import { getDatabyparams } from "../apiService/apiservice";
import { endpoints } from "../api/api";
import { useSelector } from "react-redux";

export default function Groups() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const authUser = useSelector((state) => state.auth?.user);

  const fetchGroups = async ({ pageParam = 0 }) => {
    const response = await getDatabyparams(endpoints.fetchGroups, authUser?.userId);
    console.log("-------groups response --------", JSON.stringify(response.data));
    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, error } = useInfiniteQuery({
    queryKey: ["groups", filter],
    queryFn: ({ pageParam = 0 }) => fetchGroups(pageParam),
    getNextPageParam: (lastPage, pages) => (lastPage.hasMore ? pages.length : undefined),
  });

  const filteredGroups =
    data?.pages.flatMap((page) =>
      page.groups.filter(
        (group) => group.name.toLowerCase().includes(searchTerm.toLowerCase()) && (filter === "all" || (filter === "owe" && group.youOwe > 0) || (filter === "owed" && group.youAreOwed > 0))
      )
    ) || [];

  const renderGroupCard = (group) => (
    <div key={group.id} className="bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer flex justify-between items-center" onClick={() => navigate(`/groups/${group.id}`)}>
      <div>
        <h3 className="text-lg font-semibold">{group.name}</h3>
        <p className="text-sm text-gray-600">{group.members.length} members</p>
      </div>
      <div className="text-right">
        <p className={`text-sm ${group.youOwe > 0 ? "text-red-500" : "text-green-500"} font-semibold`}>
          {group.youOwe > 0 ? `You owe: ${group.currency} ${group.youOwe}` : `Owed to you: ${group.currency} ${group.youAreOwed}`}
        </p>
        <p className="text-sm text-gray-600">
          Total: {group.currency} {group.totalExpense}
        </p>
      </div>
    </div>
  );
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Groups</h1>
        <button onClick={() => navigate("/groups/create")} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Group
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input type="text" placeholder="Search groups..." className="w-full p-2 pl-10 pr-10 border rounded-md" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          {searchTerm && (
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" onClick={() => setSearchTerm("")} aria-label="Clear search">
              <X size={20} />
            </button>
          )}
        </div>
        <div className="relative">
          <button className="p-2 border rounded-md flex items-center" onClick={() => setShowFilterMenu(!showFilterMenu)} aria-label="Filter groups">
            <Filter size={20} className="mr-2" />
            <span className="hidden md:inline">{filter === "all" ? "All Groups" : filter === "owe" ? "Groups You Owe" : "Groups That Owe You"}</span>
            <ChevronDown size={20} className="ml-2" />
          </button>
          {showFilterMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setFilter("all");
                  setShowFilterMenu(false);
                }}
              >
                All Groups
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setFilter("owe");
                  setShowFilterMenu(false);
                }}
              >
                Groups You Owe
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setFilter("owed");
                  setShowFilterMenu(false);
                }}
              >
                Groups That Owe You
              </button>
            </div>
          )}
        </div>
      </div>

      {
        // isLoading && <div className="text-center py-4">Loading...</div>
        isLoading && (
          <div className="flex items-center justify-center h-full">
            <Loader />
          </div>
        )
      }
      {error && <div className="text-center py-4 text-red-500">An error occurred: {error.message}</div>}
      {filteredGroups.map(renderGroupCard)}
      {/* {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="w-full py-2 bg-gray-200 text-center rounded-md">
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </button>
      )} */}

      {hasNextPage && (
        <div ref={observerRef} className="h-10 flex items-center justify-center">
          {isFetchingNextPage ? "Loading more..." : ""}
        </div>
      )}
    </div>
  );
}
