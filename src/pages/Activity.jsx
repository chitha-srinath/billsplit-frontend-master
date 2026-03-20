import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CheckCircle, User, XCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { endpoints } from "../api/api";
import { getDatabyparams, postData } from "../apiService/apiservice";

export default function FriendRequests() {
  const [pendingActions, setPendingActions] = useState({});
  const queryClient = useQueryClient();
  const observerRef = useRef < HTMLDivElement > null;
  const userId = useSelector((state) => state.auth?.user?.userId);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["friendRequests"],
    queryFn: ({ pageParam = 0 }) =>
      getDatabyparams(endpoints.getfrndRequests, userId),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const mutation = useMutation({
    mutationFn: (data) => postData(endpoints.updateFriendRequest, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      setPendingActions((prev) => ({
        ...prev,
        [variables.requestId]: false,
      }));
    },
  });

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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleAction = (id, action) => {
    if (!pendingActions[id]) {
      setPendingActions((prev) => ({ ...prev, [id]: true }));
      mutation.mutate({ requestId: id, status: action });
    }
  };

  if (isLoading)
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 md:max-w-lg lg:max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">Friend Requests</h1>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="interactive-card p-5 h-[80px] animate-pulse bg-slate-200/50"></div>
          ))}
        </div>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center">
        An error occurred: {error.message}
      </div>
    );
  if (!data?.pages?.[0]?.data?.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No friend requests found.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 md:max-w-lg lg:max-w-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Friend Requests</h1>
      <div className="space-y-4">
        {data?.pages?.map((page, i) => (
          <React.Fragment key={i}>
            {page?.data?.map((request) => (
              <div
                key={request.friendRequestId}
                className="interactive-card p-5 flex items-center space-x-4 mb-3"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                  <User className="text-slate-500 w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <h2 className="font-bold text-slate-800">{request.user1Email}</h2>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Wants to be your friend</p>
                </div>
                <div className="flex space-x-3">
                  {pendingActions[request.friendRequestId] ? (
                    <span className="text-indigo-500 font-medium text-sm animate-pulse">Pending...</span>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          handleAction(request.friendRequestId, "accepted")
                        }
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:shadow-md transition-all duration-300 transform hover:scale-110"
                        aria-label="Accept friend request"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() =>
                          handleAction(request.friendRequestId, "rejected")
                        }
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white hover:shadow-md transition-all duration-300 transform hover:scale-110"
                        aria-label="Reject friend request"
                      >
                        <XCircle size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      {hasNextPage && (
        <div
          ref={observerRef}
          className="h-10 flex items-center justify-center mt-4"
        >
          {isFetchingNextPage ? "Loading more..." : ""}
        </div>
      )}
    </div>
  );
}
