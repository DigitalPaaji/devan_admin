"use client";

import { base_url } from "@/components/utils";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaUser,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaSyncAlt,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";

axios.defaults.withCredentials = true;

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 text-gray-900 transition-colors dark:bg-black dark:text-white md:px-6">
      <Suspense fallback={<EventSkeleton />}>
        <Events />
      </Suspense>
    </div>
  );
};

export default Page;

/* =========================================================
   EVENTS
========================================================= */

const Events = () => {
  const query = useSearchParams();
  const router = useRouter();

  const page = Number(query.get("page")) || 1;
  const search = query.get("search") || "";
  const status = query.get("status") || "";

  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({
    totalEvents: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 15,
  });

  const [searchInput, setSearchInput] = useState(search);
  const [loading, setLoading] = useState(false);

  /* =====================================================
     FETCH EVENTS
  ===================================================== */

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", page);

      if (search) {
        params.set("search", search);
      }

      if (status) {
        params.set("status", status);
      }

      const response = await axios.get(
        `${base_url}/events/all?${params.toString()}`
      );

      const data = response.data;

      if (data.success) {
        setEvents(data.events || []);

        setPagination(
          data.pagination || {
            totalEvents: 0,
            totalPages: 1,
            currentPage: 1,
            limit: 15,
          }
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to fetch events"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FETCH WHEN QUERY CHANGES
  ===================================================== */

  useEffect(() => {
    fetchEvents();
  }, [page, search, status]);

  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    params.set("page", "1");

    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    }

    if (status) {
      params.set("status", status);
    }

    router.push(`?${params.toString()}`);
  };

  /* =====================================================
     STATUS
  ===================================================== */

  const handleStatus = (value) => {
    const params = new URLSearchParams();

    params.set("page", "1");

    if (search) {
      params.set("search", search);
    }

    if (value) {
      params.set("status", value);
    }

    router.push(`?${params.toString()}`);
  };

  /* =====================================================
     CLEAR FILTER
  ===================================================== */

  const clearFilters = () => {
    setSearchInput("");
    router.push("?page=1");
  };

  /* =====================================================
     PAGINATION
  ===================================================== */

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    const params = new URLSearchParams();

    params.set("page", newPage.toString());

    if (search) {
      params.set("search", search);
    }

    if (status) {
      params.set("status", status);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-[1600px]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <FaCalendarAlt className="text-xl" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Events
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage all your events
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-3 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium text-gray-400">
            Total Events
          </p>

          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {pagination.totalEvents}
          </p>
        </div>
      </div>

      {/* =====================================================
          FILTER
      ===================================================== */}

      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex flex-1"
          >
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search event title, venue..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>

            <button
              type="submit"
              className="ml-2 h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          {/* Status */}
          <div className="relative">
            <FaFilter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <select
              value={status}
              onChange={(e) =>
                handleStatus(e.target.value)
              }
              className="h-11 w-full min-w-[180px] appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-8 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-200"
            >
              <option value="">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Clear */}
          {(search || status) && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-900"
            >
              <FaTimes />

              Clear
            </button>
          )}

          {/* Refresh */}
          <button
            type="button"
            onClick={fetchEvents}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-900"
          >
            <FaSyncAlt
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900">
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Event
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Expert
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Venue
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Date & Time
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <TableLoading />
              ) : events.length === 0 ? (
                <EmptyEvents />
              ) : (
                events.map((event) => (
                  <EventRow
                    key={event._id}
                    event={event}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading && events.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {pagination.currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {pagination.totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.currentPage <= 1}
                onClick={() =>
                  goToPage(pagination.currentPage - 1)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-900"
              >
                <FaChevronLeft className="text-xs" />
              </button>

              {getPageNumbers(
                pagination.currentPage,
                pagination.totalPages
              ).map((item, index) =>
                item === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="px-1 text-gray-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => goToPage(item)}
                    className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
                      item === pagination.currentPage
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={
                  pagination.currentPage >=
                  pagination.totalPages
                }
                onClick={() =>
                  goToPage(pagination.currentPage + 1)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-900"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   EVENT ROW
========================================================= */

const EventRow = ({ event }) => {
  return (
    <tr className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-zinc-800/70 dark:hover:bg-zinc-900/50">
      {/* Event */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <FaCalendarAlt />
          </div>

          <div className="min-w-0">
            <p className="max-w-[220px] truncate text-sm font-bold text-gray-900 dark:text-white">
              {event.title || "Untitled Event"}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              ID: {event._id.slice(-8)}
            </p>
          </div>
        </div>
      </td>

      {/* Expert */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
            <FaUser className="text-xs" />
          </div>

          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {event.expertId?.fullname || "N/A"}
          </span>
        </div>
      </td>

      {/* Venue */}
      <td className="px-5 py-4">
        <div className="flex max-w-[200px] items-center gap-2">
          <FaMapMarkerAlt className="shrink-0 text-red-500" />

          <span className="truncate text-sm text-gray-600 dark:text-gray-400">
            {event.venue || "Online"}
          </span>
        </div>
      </td>

      {/* Date */}
      <td className="px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {formatDate(event.date)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {formatTime(event.date)}
          </p>
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusBadge status={event.status} />
      </td>

      {/* Action */}
      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <Link
           href={`/events/${event._id}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-800 dark:text-gray-400 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
          >
            <FaEye className="text-sm" />
          </Link>

          {/* <button
            type="button"
            title="Edit"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-yellow-200 hover:bg-yellow-50 hover:text-yellow-600 dark:border-zinc-800 dark:text-gray-400 dark:hover:border-yellow-500/30 dark:hover:bg-yellow-500/10 dark:hover:text-yellow-400"
          >
            <FaEdit className="text-sm" />
          </button> */}

          {/* <button
            type="button"
            title="Delete"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-zinc-800 dark:text-gray-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <FaTrash className="text-sm" />
          </button> */}
        </div>
      </td>
    </tr>
  );
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
  const statusConfig = {
    PUBLISHED: {
      label: "Published",
      className:
        "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    },

    DRAFT: {
      label: "Draft",
      className:
        "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300",
    },

    CANCELLED: {
      label: "Cancelled",
      className:
        "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    },

    COMPLETED: {
      label: "Completed",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    },
  };

  const config = statusConfig[status] || {
    label: status || "Unknown",
    className:
      "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${config.className}`}
    >
      {config.label}
    </span>
  );
};

/* =========================================================
   EMPTY
========================================================= */

const EmptyEvents = () => {
  return (
    <tr>
      <td colSpan={6}>
        <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-zinc-900">
            <FaCalendarAlt className="text-2xl" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
            No Events Found
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try changing your search or filters.
          </p>
        </div>
      </td>
    </tr>
  );
};

/* =========================================================
   TABLE LOADING
========================================================= */

const TableLoading = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index}>
          {Array.from({ length: 6 }).map((_, tdIndex) => (
            <td key={tdIndex} className="px-5 py-5">
              <div className="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-zinc-900" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

/* =========================================================
   SKELETON
========================================================= */

const EventSkeleton = () => {
  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-6 h-14 w-52 animate-pulse rounded-xl bg-gray-200 dark:bg-zinc-900" />

      <div className="mb-5 h-20 animate-pulse rounded-2xl bg-gray-200 dark:bg-zinc-900" />

      <div className="h-[500px] animate-pulse rounded-2xl bg-gray-200 dark:bg-zinc-900" />
    </div>
  );
};

/* =========================================================
   DATE
========================================================= */

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   TIME
========================================================= */

const formatTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/* =========================================================
   PAGINATION NUMBERS
========================================================= */

const getPageNumbers = (current, total) => {
  if (total <= 7) {
    return Array.from(
      { length: total },
      (_, i) => i + 1
    );
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  if (current >= total - 3) {
    return [
      1,
      "...",
      total - 4,
      total - 3,
      total - 2,
      total - 1,
      total,
    ];
  }

  return [
    1,
    "...",
    current - 1,
    current,
    current + 1,
    "...",
    total,
  ];
};