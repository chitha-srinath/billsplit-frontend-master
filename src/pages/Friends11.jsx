import React, { useState, useCallback, useRef, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { User, Search, UserPlus, UserMinus, X, ArrowUpDown, ChevronDown, ChevronUp, ArrowDown, ArrowUp } from "lucide-react";
import toast from "react-hot-toast";
import { allUsers, friendsList as initialFriendsList } from "../commondata";

// Mock API functions
const fetchFriends = async ({ pageParam = 0 }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const pageSize = 10;
  const start = pageParam * pageSize;
  const end = start + pageSize;
  return {
    friends: initialFriendsList.slice(start, end),
    nextPage: end < initialFriendsList.length ? pageParam + 1 : undefined,
  };
};

const searchUsers = async (query) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  //const filteredUsers = allUsers.filter((user) => user?.userName?.toLowerCase().includes(query.toLowerCase()));
  //return filteredUsers;
};

const removeFriendsAPI = async (userIds) => {
  console.log("Removing friends with IDs:", userIds);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
};

export default function Friends() {
  const [searchTerm, setSearchTerm] = useState("");
  const [friendRequests, setFriendRequests] = useState({});
  const [removedFriends, setRemovedFriends] = useState({});
  const searchInputRef = useRef(null);
  const observerRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [sortBy, setSortBy] = useState("Alphabetical");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const {
    data: friendsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingFriends,
    error: friendsError,
  } = useInfiniteQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
  const friendsList = friendsData?.pages.flatMap((page) => page.friends) || [];
  const { data: searchData, isLoading: isSearching } = useQuery({
    queryKey: ["searchUsers", searchTerm],
    queryFn: () => searchUsers(searchTerm),
    enabled: searchTerm.length > 0,
  });

  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const sortedFriendsList = React.useMemo(() => {
    if (!friendsList) return [];
    return [...friendsList].sort((a, b) => {
      if (sortBy === "Alphabetical") {
        return sortOrder === "asc" ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username);
      } else if (sortBy === "Recently Added") {
        // Assuming there's a createdAt field, adjust as necessary
        return sortOrder === "asc" ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [friendsList, sortBy, sortOrder]);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  const handleSendFriendRequest = (userId) => {
    setFriendRequests((prev) => ({ ...prev, [userId]: true }));
    toast.success("Friend request sent successfully!");
  };

  const toggleFriendRemoval = (userId) => {
    setRemovedFriends((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setIsSortMenuOpen(false);
  };

  useEffect(() => {
    return () => {
      const friendsToRemove = Object.keys(removedFriends).filter((id) => removedFriends[id]);
      if (friendsToRemove.length > 0) {
        removeFriendsAPI(friendsToRemove);
      }
    };
  }, [removedFriends]);

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

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        handleClearSearch();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Friends</h1>

        {/* Mobile sort options */}
        <div className="sm:hidden flex items-center space-x-2">
          <div className="relative">
            <button onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} className="px-2 py-1 bg-white border rounded-md shadow-sm flex items-center text-sm">
              {sortBy ? sortBy : "Sort by"}
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {isSortMenuOpen && (
              <div className="absolute right-0 z-10 mt-1 w-36 bg-white border rounded-md shadow-lg">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100" onClick={() => handleSortChange("Alphabetical")}>
                  Alphabetical
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100" onClick={() => handleSortChange("Recently Added")}>
                  Recently Added
                </button>
              </div>
            )}
          </div>
          <button onClick={toggleSortOrder} className="p-1 bg-white border rounded-md shadow-sm" disabled={!sortBy}>
            {sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Desktop sort options */}
        <div className="hidden sm:flex items-center space-x-2">
          <select className="p-2 border rounded" value={sortBy || ""} onChange={(e) => setSortBy(e.target.value || null)}>
            <option value="Alphabetical">Alphabetical</option>
            <option value="Recently Added">Recently Added</option>
          </select>
          <button onClick={toggleSortOrder} className="p-2 border rounded flex items-center" disabled={!sortBy}>
            <ArrowUpDown className="w-4 h-4 mr-1" />
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
      </div>

      <div ref={searchContainerRef} className="relative mb-6">
        <input type="text" placeholder="Search friends..." className="w-full p-2 pl-10 pr-10 border rounded-md" onChange={handleSearchChange} ref={searchInputRef} />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        {searchTerm && (
          <button onClick={handleClearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <X size={20} />
          </button>
        )}

        {searchTerm && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="p-2 text-center">Searching...</div>
            ) : searchData && searchData.length > 0 ? (
              searchData.map((user) => (
                <div key={user.userId} className="flex justify-between items-center p-2 hover:bg-gray-100">
                  <span>{user.username}</span>
                  {friendsList.some((friend) => friend.userId === user.userId) ? (
                    <span className="text-blue-500">Already friend</span>
                  ) : friendRequests[user.userId] ? (
                    <span className="text-green-500">Request sent</span>
                  ) : (
                    <button onClick={() => handleSendFriendRequest(user.userId)} className="bg-green-500 text-white px-2 py-1 rounded">
                      Send friend request
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="p-2 text-center">No results found</div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {isLoadingFriends && <div className="text-center">Loading friends...</div>}
        {friendsError && <div className="text-center text-red-500">Error loading friends</div>}
        {sortedFriendsList.map((friend) => (
          <div key={friend.userId} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div className="flex items-center">
              <User className="w-10 h-10 p-2 bg-gray-200 rounded-full mr-3" />
              <span className="font-medium">{friend.username}</span>
            </div>
            <button
              onClick={() => toggleFriendRemoval(friend.userId)}
              className={`flex items-center px-4 py-1 rounded-full text-white ${removedFriends[friend.userId] ? "bg-green-400 hover:bg-green-500" : "bg-red-400 hover:bg-red-500"}`}
            >
              {removedFriends[friend.userId] ? (
                <>
                  Undo
                  <UserPlus className="w-5 h-5 ml-1" />
                </>
              ) : (
                <>
                  Remove
                  <UserMinus className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div ref={observerRef} className="h-10 flex items-center justify-center">
          {isFetchingNextPage ? "Loading more..." : ""}
        </div>
      )}
    </div>
  );
}
