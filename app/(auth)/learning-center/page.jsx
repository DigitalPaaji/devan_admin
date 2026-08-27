"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiFilter,
} from "react-icons/fi";

const AllCat = [
  "Sterilization Basics",
  "Steam Sterilization",
  "ETO Sterilization",
  "Plasma Sterilization",
  "CSSD Management",
  "Infection Control",
  "Standards & Guidelines",
  "Case Studies",
];

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b0b]">
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        }
      >
        <ArticleCompo />
      </Suspense>
    </div>
  );
};

export default Page;

const ArticleCompo = () => {
  const query = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(query.get("page")) || 1;
  const search = query.get("search") || "";
  const category = query.get("category") || "";

  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({
    totalArticles: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 20,
  });

  const [searchInput, setSearchInput] = useState(search);
  const [loading, setLoading] = useState(false);

  // =========================
  // Fetch Articles
  // =========================
  const fetchArticle = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", "20");

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (category) {
        params.set("category", category);
      }

      const response = await axios.get(
        `${base_url}/learning/article/all?${params.toString()}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        setArticles(data.articles || []);

        setPagination(
          data.pagination || {
            totalArticles: 0,
            totalPages: 1,
            currentPage: 1,
            limit: 20,
          }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [page, search, category]);

  // =========================
  // Update URL
  // =========================
  const updateQuery = (key, value) => {
    const params = new URLSearchParams(query.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Search/category change should go back to page 1
    if (key !== "page") {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // =========================
  // Search
  // =========================
  const handleSearch = (e) => {
    e.preventDefault();

    updateQuery("search", searchInput.trim());
  };

  // =========================
  // Category
  // =========================
  const handleCategory = (value) => {
    updateQuery("category", value);
  };

  // =========================
  // Pagination
  // =========================
  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    updateQuery("page", String(newPage));
  };

  // =========================
  // Delete
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirmDelete) return;

    try {
      // Change this endpoint according to your backend
      await axios.delete(`${base_url}/learning/article/${id}`, {
        withCredentials: true,
      });

      toast.success("Article deleted successfully");

      fetchArticle();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete article");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">

      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <FiFileText className="text-blue-500" />
            Articles
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage all your learning articles
          </p>
        </div>

      </div>

      {/* ================= FILTER ================= */}
      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#262626] dark:bg-[#111111]">

        <div className="flex flex-col gap-3 lg:flex-row">

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex flex-1"
          >
            <div className="relative w-full">

              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles..."
                className="h-11 w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-24 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-[#303030] dark:bg-[#181818] dark:text-white dark:placeholder:text-gray-500"
              />

              <button
                type="submit"
                className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Search
              </button>

            </div>
          </form>

          {/* Category */}
          <div className="relative lg:w-[280px]">

            <FiFilter
              size={17}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400"
            />

            <select
              value={category}
              onChange={(e) => handleCategory(e.target.value)}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-[#303030] dark:bg-[#181818] dark:text-white"
            >
              <option value="">All Categories</option>

              {AllCat.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

          </div>

        </div>

      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-[#262626] dark:bg-[#111111]">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-left">

            <thead className="border-b border-gray-200 bg-gray-50 dark:border-[#262626] dark:bg-[#181818]">

              <tr>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Article
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Expert
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Category
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Views
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-[#242424]">

              {loading ? (

                <tr>
                  <td colSpan={6}>

                    <div className="flex h-64 items-center justify-center">

                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-[#333] dark:border-t-blue-500" />

                    </div>

                  </td>
                </tr>

              ) : articles.length === 0 ? (

                <tr>
                  <td colSpan={6}>

                    <div className="flex h-64 flex-col items-center justify-center">

                      <FiFileText
                        size={42}
                        className="mb-3 text-gray-300 dark:text-gray-700"
                      />

                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        No articles found
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Try changing your search or category filter
                      </p>

                    </div>

                  </td>
                </tr>

              ) : (

                articles.map((article) => (

                  <tr
                    key={article._id}
                    className="transition hover:bg-gray-50 dark:hover:bg-[#171717]"
                  >

                    {/* Article */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-[#222]">

                          {article.thumbnail ? (
                            <img
                              src={`${img_url}${article.thumbnail}`}
                              alt={article.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <FiFileText className="text-gray-400" />
                            </div>
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="max-w-[280px] truncate text-sm font-semibold text-gray-900 dark:text-white">
                            {article.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            ID: {article._id.slice(-8)}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Expert */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                          {article.expertId?.fullname
                            ?.charAt(0)
                            ?.toUpperCase() || "E"}
                        </div>

                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {article.expertId?.fullname || "Unknown"}
                        </span>

                      </div>

                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">

                      <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-[#242424] dark:text-gray-300">
                        {article.category}
                      </span>

                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          article.status === "PUBLISHED"
                            ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                        }`}
                      >
                        {article.status}
                      </span>

                    </td>

                    {/* Views */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">

                        <FiEye
                          size={16}
                          className="text-gray-400"
                        />

                        {article.views || 0}

                      </div>

                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          title="Edit article"
                          onClick={() =>
                            router.push(
                              `/learning-center/${article._id}`
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-[#303030] dark:text-gray-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                        >
                          <FiEdit2 size={16} />
                        </button>

                       

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* ================= PAGINATION ================= */}
        {!loading && articles.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#262626]">

            <p className="text-sm text-gray-500 dark:text-gray-400">

              Showing{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {(pagination.currentPage - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalArticles
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {pagination.totalArticles}
              </span>{" "}
              articles

            </p>

            <div className="flex items-center gap-1">

              {/* Previous */}
              <button
                disabled={pagination.currentPage <= 1}
                onClick={() =>
                  goToPage(pagination.currentPage - 1)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#303030] dark:text-gray-400 dark:hover:bg-[#202020]"
              >
                <FiChevronLeft size={18} />
              </button>

              {/* Pages */}
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              )
                .filter((p) => {
                  return (
                    p === 1 ||
                    p === pagination.totalPages ||
                    Math.abs(p - pagination.currentPage) <= 1
                  );
                })
                .map((p, index, arr) => {

                  const previous = arr[index - 1];

                  return (
                    <React.Fragment key={p}>

                      {previous && p - previous > 1 && (
                        <span className="px-2 text-gray-400">
                          ...
                        </span>
                      )}

                      <button
                        onClick={() => goToPage(p)}
                        className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                          pagination.currentPage === p
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-[#303030] dark:text-gray-300 dark:hover:bg-[#202020]"
                        }`}
                      >
                        {p}
                      </button>

                    </React.Fragment>
                  );
                })}

              {/* Next */}
              <button
                disabled={
                  pagination.currentPage >= pagination.totalPages
                }
                onClick={() =>
                  goToPage(pagination.currentPage + 1)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#303030] dark:text-gray-400 dark:hover:bg-[#202020]"
              >
                <FiChevronRight size={18} />
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};