"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-gray-600 dark:text-gray-300">
          Loading...
        </div>
      }
    >
      <NewsCompo />
    </Suspense>
  );
};

export default Page;

const NewsCompo = () => {
  const query = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(query.get("page")) || 1;
  const limit = Number(query.get("limit")) || 15;
  const search = query.get("search") || "";
  const category = query.get("category") || "";

  const [news, setNews] = useState([]);
  const [pagination, setPagination] = useState({
    totalNews: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 15,
  });

  const [loading, setLoading] = useState(true);

  // Fetch news
  const fetchData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", page);
      params.set("limit", limit);

      if (search) {
        params.set("search", search);
      }

      if (category) {
        params.set("category", category);
      }

      const response = await axios.get(
        `${base_url}/news/all?${params.toString()}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        setNews(data.news || []);
        setPagination(
          data.pagination || {
            totalNews: 0,
            totalPages: 1,
            currentPage: 1,
            limit,
          }
        );
      }
    } catch (error) {
      console.error("Failed to fetch news", error);
    } finally {
      setLoading(false);
    }
  };

 

  useEffect(() => {
    fetchData();
  }, [page, limit, search, category]);

 

  // Update URL
  const updateParams = (key, value) => {
    const params = new URLSearchParams(query.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset page when filter changes
    if (key !== "page") {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Search
  const handleSearch = (e) => {
    updateParams("search", e.target.value);
  };

  // Category
  const handleCategory = (e) => {
    updateParams("category", e.target.value);
  };

  // Pagination
  const goToPage = (newPage) => {
    if (
      newPage < 1 ||
      newPage > pagination.totalPages
    ) {
      return;
    }

    updateParams("page", newPage.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-[#111] md:p-6">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            News
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage all your news articles.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#2b2b2b] dark:bg-[#181818]">

          <div className="flex flex-col gap-3 md:flex-row">

            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search news..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-black dark:border-[#3a3a3a] dark:bg-[#222] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white"
              />
            </div>

            {/* Category */}
            <div className="w-full md:w-64">
              <select
                value={category}
                onChange={handleCategory}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-black dark:border-[#3a3a3a] dark:bg-[#222] dark:text-white dark:focus:border-white"
              >
                <option value="">All Categories</option>


{
["CSSD Technician","CSSD Supervisor","CSSD Manager","Infection Control Professional"].map((cat, index) => (
                  <option
                    key={ index}
                    value={cat}
                  >
                    {cat}
                  </option>
                ))

}

              </select>
            </div>

          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#2b2b2b] dark:bg-[#181818]">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead className="border-b border-gray-200 bg-gray-50 dark:border-[#2b2b2b] dark:bg-[#202020]">

                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    News
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Expert
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Publication Date
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Action
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-[#2b2b2b]">

                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      Loading news...
                    </td>
                  </tr>
                ) : news.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No news found.
                    </td>
                  </tr>
                ) : (
                  news.map((item) => (
                    <tr
                      key={item._id}
                      className="transition hover:bg-gray-50 dark:hover:bg-[#202020]"
                    >

                      {/* News */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <img
                            src={`${img_url}${item.featuredImage}`}
                            alt={item.title}
                            className="h-12 w-16 rounded-lg object-cover"
                          />

                          <div className="max-w-[280px]">
                            <p className="truncate font-medium text-gray-900 dark:text-white">
                              {item.title}
                            </p>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              ID: {item._id}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Expert */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.expertId?.fullname || "N/A"}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">

                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-[#292929] dark:text-gray-300">
                          {item.category || "N/A"}
                        </span>

                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">

                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {new Date(
                            item.publicationDate
                          ).toLocaleDateString()}
                        </p>

                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/news/${item._id}`
                            )
                          }
                          className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-[#3a3a3a] dark:text-gray-300 dark:hover:bg-[#292929]"
                        >
                          View
                        </button>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

          {/* Pagination */}
          {!loading && news.length > 0 && (
            <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 dark:border-[#2b2b2b] sm:flex-row sm:items-center sm:justify-between">

              {/* Info */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing page{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {pagination.currentPage}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {pagination.totalPages}
                </span>{" "}
                ({pagination.totalNews} news)
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-2">

                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#3a3a3a] dark:text-gray-300 dark:hover:bg-[#292929]"
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className="hidden items-center gap-1 sm:flex">

                  {Array.from(
                    {
                      length: pagination.totalPages,
                    },
                    (_, index) => index + 1
                  )
                    .slice(
                      Math.max(0, page - 3),
                      Math.min(
                        pagination.totalPages,
                        page + 2
                      )
                    )
                    .map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() =>
                          goToPage(pageNumber)
                        }
                        className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                          pageNumber === page
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#292929]"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                </div>

                <button
                  type="button"
                  disabled={
                    page >= pagination.totalPages
                  }
                  onClick={() => goToPage(page + 1)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#3a3a3a] dark:text-gray-300 dark:hover:bg-[#292929]"
                >
                  Next
                </button>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};