import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Loader2,
} from "lucide-react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getNotification,
  putReadAllNotifications,
  putReadNotification,
} from "@/api/notification.api";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "./LoaderErrWrapper";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

// ─── Type config ────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  INFO: {
    icon: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
    bg: "bg-blue-500/10",
    dot: "bg-blue-500",
  },
  ALERT: {
    icon: <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />,
    bg: "bg-red-500/10",
    dot: "bg-red-500",
  },
  WARNING: {
    icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
    bg: "bg-amber-500/10",
    dot: "bg-amber-500",
  },
  SUCCESS: {
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-500",
  },
};

const getTypeConfig = (type) =>
  TYPE_CONFIG[(type || "").toUpperCase()] ?? TYPE_CONFIG.INFO;

const formatTime = (iso) => {
  if (!iso) return "";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// ─── Component ───────────────────────────────────────────────────────────────
const Notifications = ({ title = "Notifications" }) => {
  const { profiledata } = useAuth();
  const navigate = useNavigate();
  const isOfficer = profiledata?.isOfficer;
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);
  const observeRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const queryClient = useQueryClient();

  const readAllMutation = useMutation({
    mutationFn: putReadAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });

  const readSingleMutation = useMutation({
    mutationFn: (id) => putReadNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });

  const {
    data,
    isLoading,
    error,
    isRefetching,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      getNotification({ page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage?.data?.data?.pagination ?? {};
      if (page < totalPages) return page + 1;
      return undefined;
    },
    queryKey: [QUERY_KEYS.NOTIFICATIONS],
    refetchInterval: 5 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const notificationList =
    data?.pages?.flatMap((res) => res?.data?.data?.docs ?? []) ?? [];
  const totalCount = data?.pages?.[0]?.data?.data?.pagination?.total ?? 0;
  const hasUnread = (data?.pages?.[0]?.data?.data?.unreadCount ?? 0) > 0;

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    // console.log({
    //   isLoading,
    //   isFetching,
    //   isFetchingNextPage,
    //   isRefetching,
    //   scrollContainer: scrollContainerRef.current,
    //   observe: observeRef.current,
    // });
    if (isLoading || isFetching || isFetchingNextPage || isRefetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        });
      },
      {
        root: scrollContainerRef.current,
        rootMargin: "0px",
        scrollMargin: "0px",
        threshold: 1.0,
      },
    );

    if (observeRef.current) observer.observe(observeRef.current);
    return () => observer.disconnect();
  }, [
    isLoading,
    isFetching,
    isFetchingNextPage,
    isRefetching,
    data,
    showNotifs,
  ]);

  const navtoFieldVisit = (visitId) => {
    if (isOfficer) {
      navigate(`/officer/field-visits?visit=${visitId}`, {
        state: { visit: visitId },
        replace: true,
      });
    }
  };

  const navToComplaints = (compId) => {
    if (isOfficer) {
      navigate(`/officer/complaints?complaint=${compId}`, {
        state: { grievanceId: compId },
        replace: true,
      });
    } else {
      navigate(`/crm/track-complaint?complaint=${compId}`, {
        state: { grievanceId: compId },
        replace: true,
      });
    }
  };

  const handleClickNoti = (e, n) => {
    e.stopPropagation();
    if (!n.isRead) {
      readSingleMutation.mutate(n._id);
    }
    if (n.metadata?.visitId && isOfficer) {
      navtoFieldVisit(n.metadata?.visitId);
    } else if (n.metadata?.grievanceRef) {
      const compId = n.metadata?.grievanceRef;
      navToComplaints(compId);
    }
  };

  return (
    <div className="relative" ref={notifRef}>
      {/* Bell button */}
      <button
        onClick={() => setShowNotifs(!showNotifs)}
        className="p-2 rounded-lg hover:bg-muted text-muted-foreground relative cursor-pointer"
        aria-label="Toggle notifications"
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Dropdown panel */}
      {showNotifs && (
        <div className="absolute right-0 top-12 w-80 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                {title}
                {totalCount > 0 && (
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                    ({totalCount})
                  </span>
                )}
              </span>
              {hasUnread && (
                <button
                  onClick={() => readAllMutation.mutate()}
                  disabled={readAllMutation.isPending}
                  className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                >
                  {readAllMutation.isPending
                    ? "Marking..."
                    : "Mark all as read"}
                </button>
              )}
            </div>
            <button
              onClick={() => setShowNotifs(false)}
              className="p-1 hover:bg-muted rounded cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* List */}
          <LoaderErrWrapper isLoading={isLoading} error={error}>
            <div
              ref={scrollContainerRef}
              className="max-h-80 overflow-y-auto scrollbar-thin"
            >
              {notificationList.length === 0 && !isLoading && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              )}

              {notificationList.map((n) => {
                const cfg = getTypeConfig(n.type);
                const hasLink = !!(n.metadata?.visitId || n.metadata?.grievanceRef);
                return (
                  <div
                    key={n._id}
                    onClick={(e) => handleClickNoti(e, n)}
                    className={clsx(
                      "relative flex items-start gap-3 px-3 py-3 border-b border-border/60 last:border-0 transition-all duration-150 group",
                      !n.isRead
                        ? "bg-primary/[0.04] hover:bg-primary/[0.07]"
                        : "bg-transparent hover:bg-muted/40",
                      hasLink && "cursor-pointer",
                    )}
                  >
                    {/* Unread left accent bar */}
                    {!n.isRead && (
                      <span className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full ${cfg.dot}`} />
                    )}

                    {/* Icon badge */}
                    <div className={`shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded-xl ${cfg.bg} ring-1 ring-inset ring-black/5 dark:ring-white/5`}>
                      {cfg.icon}
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0 pb-4">
                      {/* Title + unread dot */}
                      <div className="flex items-start gap-1.5">
                        <p className={clsx(
                          "text-[13px] leading-snug flex-1 min-w-0",
                          !n.isRead ? "font-semibold text-foreground" : "font-medium text-foreground/90"
                        )}>
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className={`shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        )}
                      </div>

                      {/* Message */}
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>

                      {/* ID chips */}
                      {(n.metadata?.visitId || n.metadata?.grievanceRef) && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                          {n.metadata?.visitId && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-medium tracking-wide bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-md">
                               {n.metadata.visitId}
                            </span>
                          )}
                          {n.metadata?.grievanceRef && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-medium tracking-wide bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 px-1.5 py-0.5 rounded-md">
                              {n.metadata.grievanceRef}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Time — absolute bottom-right */}
                      <span className="absolute bottom-2.5 right-3 text-[10px] text-muted-foreground/70 font-medium tabular-nums">
                        {formatTime(n.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Infinite scroll sentinel */}
              <div
                ref={observeRef}
                id="load-more-notification"
                className="h-1 w-full"
              />

              {isFetchingNextPage && (
                <div className="w-full py-2 text-xs flex items-center justify-center gap-1 text-muted-foreground">
                  <Loader2 className="animate-spin size-4" />
                  Loading more...
                </div>
              )}
            </div>
          </LoaderErrWrapper>
        </div>
      )}
    </div>
  );
};
export default React.memo(Notifications);
