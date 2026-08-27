"use client";

import axios from "axios";
import React, {
  Suspense,
  useEffect,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { base_url, img_url } from "./utils";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const GetUserContent = ({ setShowCreate }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Math.max(
    Number(searchParams.get("page")) || 1,
    1
  );

  const currentSearch = searchParams.get("search") || "";

  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [pagination, setPagination] = useState({
    totalUsers: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 15,
  });

  const updateQuery = (values) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    Object.entries(values).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  // Keep input synchronized with URL
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Add search to URL after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      const normalizedInput = searchInput.trim();

      if (normalizedInput !== currentSearch) {
        updateQuery({
          search: normalizedInput,
          page: 1,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, currentSearch]);



const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${base_url}/experts/all-experts`,
          {
            params: {
              page: currentPage,
              limit: 15,
              ...(currentSearch && {
                search: currentSearch,
              }),
            }
          }
        );

        const data = response.data;

        if (!data.success) {
          throw new Error(
            data.message || "Unable to fetch users"
          );
        }

        setUsers(Array.isArray(data.experts) ? data.experts : []);

        setPagination({
          totalUsers: data.pagination?.totalUsers || 0,
          totalPages: data.pagination?.totalPages || 0,
          currentPage: data.pagination?.currentPage || 1,
          limit: data.pagination?.limit || 15,
        });

        // Return to the last valid page after deletion
        if (
          currentPage > 1 &&
          data.pagination?.totalPages > 0 &&
          currentPage > data.pagination.totalPages
        ) {
          updateQuery({
            page: data.pagination.totalPages,
          });
        }
      } catch (error) {
        if (
          error?.code === "ERR_CANCELED" ||
          error?.name === "CanceledError"
        ) {
          return;
        }

        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Unable to fetch users";

        setError(message);
        setUsers([]);
      } finally {
      
          setLoading(false);
          setRefreshing(false);
        }
      
    };

  useEffect(() => {
  

    

    fetchUsers();

    
  }, [currentPage, currentSearch, refreshKey]);


useEffect(()=>{
  fetchUsers()
},[])

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey((previous) => previous + 1);
  };

  const clearSearch = () => {
    setSearchInput("");
    updateQuery({
      search: "",
      page: 1,
    });
  };

  const changePage = (page) => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === currentPage
    ) {
      return;
    }

    updateQuery({ page });
  };

  const getVisiblePages = () => {
    const totalPages = pagination.totalPages;
    const pages = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);

    if (endPage - startPage < 4) {
      startPage = Math.max(endPage - 4, 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    return pages;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${img_url}${image}`;
  };

  const getInitials = (fullname = "") => {
    return fullname
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <section className="min-h-full bg-slate-50 p-4 text-black dark:bg-slate-900 dark:text-white sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
              <FiUsers size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Manage Users
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                View and manage all registered users.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh users"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <FiRefreshCw
              size={18}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 sm:flex-none"
          >
            <FiPlus size={18} />
            Create User
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="search"
            value={searchInput}
            onChange={(event) =>
              setSearchInput(event.target.value)
            }
            placeholder="Search by name, email or phone..."
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-11 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-white dark:focus:ring-white/5"
          />

          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black dark:hover:text-white"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="mb-5 flex flex-col items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 sm:flex-row dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          <p className="text-sm">{error}</p>

          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block dark:border-slate-800 dark:bg-slate-950">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Gender</th>
                <th className="px-5 py-4">Address</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={6} className="px-5 py-4">
                        <div className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                      </td>
                    </tr>
                  ))
                : users.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-900/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            {user.image ? (
                              <img
                                src={getImageUrl(user.image)}
                                alt={user.fullname}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitials(user.fullname)
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {user.fullname}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {user.phone || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm capitalize text-slate-600 dark:text-slate-400">
                        {user.gender
                          ?.replaceAll("_", " ") || "—"}
                      </td>

                      <td className="max-w-[200px] truncate px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {user.address || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                            user.status
                              ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.status
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />

                          {user.status ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!loading && users.length === 0 && (
          <EmptyUsers search={currentSearch} />
        )}
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-2xl bg-white dark:bg-slate-950"
              />
            ))
          : users.map((user) => (
              <article
                key={user._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 font-bold dark:bg-slate-800">
                    {user.image ? (
                      <img
                        src={getImageUrl(user.image)}
                        alt={user.fullname}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(user.fullname)
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate font-semibold">
                        {user.fullname}
                      </h3>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          user.status
                            ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        {user.status ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="mt-1 flex items-center gap-2 truncate text-sm text-slate-500">
                      <FiMail className="shrink-0" />
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500 dark:border-slate-800">
                  <p className="flex items-center gap-2">
                    <FiUser className="shrink-0" />
                    <span className="capitalize">
                      {user.gender?.replaceAll("_", " ") ||
                        "Not provided"}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <FiMapPin className="shrink-0" />
                    <span className="truncate">
                      {user.address || "Address not provided"}
                    </span>
                  </p>
                </div>
              </article>
            ))}

        {!loading && users.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <EmptyUsers search={currentSearch} />
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 0 && (
        <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-black dark:text-white">
              {(currentPage - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-black dark:text-white">
              {Math.min(
                currentPage * pagination.limit,
                pagination.totalUsers
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-black dark:text-white">
              {pagination.totalUsers}
            </span>{" "}
            users
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <FiChevronLeft />
            </button>

            {getVisiblePages().map((page) => (
              <button
                type="button"
                key={page}
                onClick={() => changePage(page)}
                className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                  page === currentPage
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage >= pagination.totalPages}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const EmptyUsers = ({ search }) => {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
        <FiUsers size={28} />
      </div>

      <h3 className="mt-4 font-semibold">
        {search ? "No matching users" : "No users found"}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        {search
          ? `No users matched “${search}”. Try another search.`
          : "Create your first user to get started."}
      </p>
    </div>
  );
};

const GetExpert = (props) => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center bg-slate-50 dark:bg-slate-900">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-black dark:border-slate-700 dark:border-t-white" />
        </div>
      }
    >
      <GetUserContent {...props} />
    </Suspense>
  );
};

export default GetExpert;