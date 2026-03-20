import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, X, Search, User } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { debounce } from "lodash";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { postData } from "../apiService/apiservice";
import { endpoints } from "../api/api";
import { useSelector } from "react-redux";

export default function AddGroupPage() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const authUser = useSelector((state) => state.auth?.user);

  const searchFriends = async (query) => {
    if (!query.trim()) return [];
    const response = await postData(endpoints.searchFriends, {
      userId: authUser?.userId,
      searchTerm: query,
    });
    return response.data;
  };

  const {
    data: searchResults,
    isLoading: isSearching,
    refetch,
  } = useQuery({
    queryKey: ["searchFriends", searchQuery],
    queryFn: () => searchFriends(searchQuery),
    enabled: false,
  });

  let { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await postData(endpoints.createGroup, data);
      return response;
    },

    onError: (error) => {
      if (error.response?.status === 401) {
        toast.error("Something Went Worng");
      } else {
        console.log(error.response?.message);
      }
    },
    onSuccess: (result) => {
      if (result?.statuscode === 200) {
        toast.success(result?.message);
        navigate("/groups");
      } else {
        toast.error(result?.message);
      }
    },
  });

  const debouncedSearchFriends = useCallback(
    debounce((query) => {
      if (query.trim()) {
        refetch();
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 500),
    [refetch]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearchFriends(query);
  };

  const handleAddFriend = (friend) => {
    if (selectedFriends.some((f) => f.userId === friend.userId)) {
      toast.error(`${friend.username} has already been added to the group.`);
    } else {
      setSelectedFriends((prev) => [...prev, friend]);
      setSearchQuery("");
      setShowResults(false);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  };

  const handleRemoveFriend = (friendId) => {
    setSelectedFriends((prev) => prev.filter((friend) => friend.userId !== friendId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName && selectedFriends?.length > 0) {
      // console.log("Group Name:", groupName);
      // console.log("Selected Friends:", selectedFriends);
      selectedFriends.push({
        userId: authUser.userId,
        userName: authUser.userName,
        userEmail: authUser.userEmail,
      });
      mutate({ groupName: groupName, groupUsers: selectedFriends });
      setGroupName("");
      setSelectedFriends([]);
      //toast.success("Group created successfully!");
    } else {
      toast.error("Please add at least a friend");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target) && searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setSearchQuery("");
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex items-center justify-between mb-6">
        <button onClick={() => navigate("/groups")} className="p-2" aria-label="Go back">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Create Group</h1>
        <div className="w-6"></div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <div className="mb-4">
          <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
            Group Name
          </label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter group name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="addFriends" className="block text-sm font-medium text-gray-700 mb-1">
            Select Friends
          </label>
          <div className="relative">
            <input
              type="text"
              id="addFriends"
              ref={searchInputRef}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search friends"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowResults(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {isSearching && <p className="mt-2 text-sm text-gray-500">Searching...</p>}

          {showResults && searchResults && searchResults.length > 0 && (
            <ul ref={searchResultsRef} className="mt-2 bg-white border border-gray-300 rounded-md shadow-sm max-h-48 overflow-y-auto">
              {searchResults.map((friend) => (
                <li key={friend.userId} className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center" onClick={() => handleAddFriend(friend)}>
                  <User className="w-5 h-5 mr-2 text-gray-400" />
                  {friend.userName}
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedFriends.length > 0 ? (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Selected Friends:</p>
            <div className="flex flex-wrap gap-2">
              {selectedFriends.map((friend) => (
                <div key={friend.userId} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center">
                  {friend.userName}
                  <button type="button" onClick={() => handleRemoveFriend(friend.userId)} className="ml-2 text-blue-600 hover:text-blue-800">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">Select friends to add to the group. (You can search for friends by their username)</p>
            <span className="text-sm text-gray-500"></span>
          </div>
        )}

        <button type="submit" className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Create Group
        </button>
      </form>
    </div>
  );
}
