"use client";

import { base_url } from "@/components/utils";
import axios from "axios";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, {
  Suspense,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center text-gray-600 dark:text-gray-300">
          Loading...
        </div>
      }
    >
      <GetJobs />
    </Suspense>
  );
};

export default Page;

const GetJobs = () => {
  const query = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(query.get("page")) || 1;
  const limit = Number(query.get("limit")) || 15;
  const search = query.get("search") || "";
  const category = query.get("category") || "";
  const jobType = query.get("jobType") || "";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    totalJobs: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 15,
  });

  // =========================
  // Get Jobs
  // =========================
  const getJobs = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", page.toString());
      params.set("limit", limit.toString());

      if (search) {
        params.set("search", search);
      }

      if (category) {
        params.set("category", category);
      }

      if (jobType) {
        params.set("jobType", jobType);
      }

      const response = await axios.get(
        `${base_url}/jobs/all?${params.toString()}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        setJobs(data.jobs || []);

        setPagination(
          data.pagination || {
            totalJobs: 0,
            totalPages: 1,
            currentPage: 1,
            limit,
          }
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Fetch when filters change
  // =========================
  useEffect(() => {
    getJobs();
  }, [page, limit, search, category, jobType]);

  // =========================
  // Update URL
  // =========================
  const updateParams = (key, value) => {
    const params = new URLSearchParams(
      query.toString()
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset pagination when filtering/searching
    if (key !== "page") {
      params.set("page", "1");
    }

    router.push(
      `${pathname}?${params.toString()}`
    );
  };

  // =========================
  // Search
  // =========================
  const handleSearch = (e) => {
    updateParams("search", e.target.value);
  };

  // =========================
  // Category
  // =========================
  const handleCategory = (e) => {
    updateParams("category", e.target.value);
  };

  // =========================
  // Job Type
  // =========================
  const handleJobType = (e) => {
    updateParams("jobType", e.target.value);
  };

  // =========================
  // Pagination
  // =========================
  const goToPage = (newPage) => {
    if (
      newPage < 1 ||
      newPage > pagination.totalPages
    ) {
      return;
    }

    updateParams(
      "page",
      newPage.toString()
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-[#111] md:p-6">

      <div className="mx-auto max-w-7xl">

        {/* ================= Header ================= */}
        <div className="mb-6">

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Jobs
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage all job postings.
          </p>

        </div>

        {/* ================= Filters ================= */}
        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#2b2b2b] dark:bg-[#181818]">

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search jobs..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-black dark:border-[#3a3a3a] dark:bg-[#222] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white"
            />

            {/* Category */}
            <select
              value={category}
              onChange={handleCategory}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-black dark:border-[#3a3a3a] dark:bg-[#222] dark:text-white dark:focus:border-white"
            >
              <option value="">
                All Categories
              </option>

              <option value="CSSD Supervisor">
                CSSD Supervisor
              </option>

              <option value="CSSD Manager">
                CSSD Manager
              </option>

              <option value="CSSD Technician">
                CSSD Technician
              </option>
            </select>

            {/* Job Type */}
            <select
              value={jobType}
              onChange={handleJobType}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-black dark:border-[#3a3a3a] dark:bg-[#222] dark:text-white dark:focus:border-white"
            >
              <option value="">
                All Job Types
              </option>

              <option value="FULL_TIME">
                Full Time
              </option>

              <option value="PART_TIME">
                Part Time
              </option>

              <option value="CONTRACT">
                Contract
              </option>

              <option value="INTERNSHIP">
                Internship
              </option>
            </select>

          </div>

        </div>

        {/* ================= Table ================= */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#2b2b2b] dark:bg-[#181818]">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              {/* Table Head */}
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-[#2b2b2b] dark:bg-[#202020]">

                <tr>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Job
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Expert
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Job Type
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Applications
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Action
                  </th>

                </tr>

              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200 dark:divide-[#2b2b2b]">

                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      Loading jobs...
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr
                      key={job._id}
                      className="transition hover:bg-gray-50 dark:hover:bg-[#202020]"
                    >

                      {/* Job */}
                      <td className="px-5 py-4">

                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {job.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            ID: {job._id}
                          </p>
                        </div>

                      </td>

                      {/* Expert */}
                      <td className="px-5 py-4">

                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {job.expertId?.fullname ||
                            "N/A"}
                        </p>

                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">

                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-[#292929] dark:text-gray-300">
                          {job.category || "N/A"}
                        </span>

                      </td>

                      {/* Job Type */}
                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            job.jobType ===
                            "FULL_TIME"
                              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                              : job.jobType ===
                                "CONTRACT"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                              : "bg-gray-100 text-gray-700 dark:bg-[#292929] dark:text-gray-300"
                          }`}
                        >
                          {job.jobType
                            ?.replaceAll("_", " ")}
                        </span>

                      </td>

                      {/* Applications */}
                      <td className="px-5 py-4">

                        <span className="font-semibold text-gray-900 dark:text-white">
                          {job.applicationsCount ||
                            0}
                        </span>

                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/jobs/${job._id}`
                            )
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-[#3a3a3a] dark:text-gray-300 dark:hover:bg-[#292929]"
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

          {/* ================= Pagination ================= */}
          {!loading && jobs.length > 0 && (
            <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 dark:border-[#2b2b2b] sm:flex-row sm:items-center sm:justify-between">

              {/* Pagination Info */}
              <p className="text-sm text-gray-500 dark:text-gray-400">

                Showing page{" "}

                <span className="font-medium text-gray-900 dark:text-white">
                  {pagination.currentPage}
                </span>

                {" "}of{" "}

                <span className="font-medium text-gray-900 dark:text-white">
                  {pagination.totalPages}
                </span>

                {" "}({pagination.totalJobs} jobs)

              </p>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">

                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    goToPage(page - 1)
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#3a3a3a] dark:text-gray-300 dark:hover:bg-[#292929]"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="hidden items-center gap-1 sm:flex">

                  {Array.from(
                    {
                      length:
                        pagination.totalPages,
                    },
                    (_, index) =>
                      index + 1
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
                    page >=
                    pagination.totalPages
                  }
                  onClick={() =>
                    goToPage(page + 1)
                  }
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