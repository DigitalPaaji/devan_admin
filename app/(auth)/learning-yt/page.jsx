"use client";

import { base_url } from "@/components/utils";
import axios from "axios";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiFilter,
  FiHome,
  FiPlay,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

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
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-[#333] dark:border-t-blue-500" />
          </div>
        }
      >
        <Ytvideo />
      </Suspense>
    </div>
  );
};

export default Page;

const Ytvideo = () => {
  const query = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(query.get("page")) || 1;
  const search = query.get("search") || "";
  const category = query.get("category") || "";

  const [videos, setVideos] = useState([]);

  const [pagination, setPagination] = useState({
    totalYt: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 20,
  });

  const [searchInput, setSearchInput] = useState(search);
  const [loading, setLoading] = useState(false);

  // Rejection
  const [rejectVideo, setRejectVideo] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Homepage saving
  const [homepageLoading, setHomepageLoading] = useState(
    null
  );

  // Action loading
  const [actionLoading, setActionLoading] = useState(
    null
  );

  // =========================================================
  // FETCH VIDEOS
  // =========================================================

  const fetchYt = async () => {
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
        `${base_url}/learning/yt/all?${params.toString()}`
      );

      const data = response.data;

      if (data.success) {
        setVideos(data.yt || []);

        setPagination(
          data.pagination || {
            totalYt: 0,
            totalPages: 1,
            currentPage: 1,
            limit: 20,
          }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYt();
  }, [page, search, category]);

  // =========================================================
  // UPDATE QUERY
  // =========================================================

  const updateQuery = (key, value) => {
    const params = new URLSearchParams(query.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key !== "page") {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = (e) => {
    e.preventDefault();

    updateQuery("search", searchInput.trim());
  };

  // =========================================================
  // CATEGORY
  // =========================================================

  const handleCategory = (value) => {
    updateQuery("category", value);
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const goToPage = (newPage) => {
    if (
      newPage < 1 ||
      newPage > pagination.totalPages
    ) {
      return;
    }

    updateQuery("page", String(newPage));
  };

  // =========================================================
  // GET YOUTUBE ID
  // =========================================================

  const getYoutubeId = (url) => {
    if (!url) return null;

    try {
      const parsed = new URL(url);

      // youtube.com/watch?v=xxxx
      if (parsed.searchParams.get("v")) {
        return parsed.searchParams.get("v");
      }

      // youtube.com/shorts/xxxx
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1]?.split("/")[0];
      }

      // youtu.be/xxxx
      if (parsed.hostname === "youtu.be") {
        return parsed.pathname.replace("/", "").split("/")[0];
      }

      // youtube.com/embed/xxxx
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1]?.split("/")[0];
      }

      return null;
    } catch {
      return null;
    }
  };

  // =========================================================
  // HOMEPAGE TOGGLE
  // =========================================================

  const handleHomepageToggle = async (video) => {
    const newValue = !video.homepage;

    try {
      setHomepageLoading(video._id);

      // Change endpoint if your backend route is different
      const response = await axios.patch(
        `${base_url}/learning/yt/homepage/${video._id}`,
        {
          homepage: newValue,
        }
      );

      if (response.data.success) {
        setVideos((prev) =>
          prev.map((item) =>
            item._id === video._id
              ? {
                  ...item,
                  homepage: newValue,
                }
              : item
          )
        );

        toast.success(
          newValue
            ? "Video added to homepage"
            : "Video removed from homepage"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setHomepageLoading(null);
    }
  };

  // =========================================================
  // PUBLISH
  // =========================================================

  const handlePublish = async (video) => {
    try {
      setActionLoading(video._id);

      // Change endpoint if your backend route is different
      const response = await axios.patch(
        `${base_url}/learning/yt/status/${video._id}`,
        {
          status: "PUBLISHED",
        }
      );

      if (response.data.success) {
        setVideos((prev) =>
          prev.map((item) =>
            item._id === video._id
              ? {
                  ...item,
                  status: "PUBLISHED",
                  rejectionReason: null,
                }
              : item
          )
        );

        toast.success("Video published successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // OPEN REJECT MODAL
  // =========================================================

  const openRejectModal = (video) => {
    setRejectVideo(video);
    setRejectionReason(video.rejectionReason || "");
  };

  // =========================================================
  // REJECT
  // =========================================================

  const handleReject = async () => {
    if (!rejectVideo) return;

    if (!rejectionReason.trim()) {
      toast.error("Please enter rejection reason");
      return;
    }

    try {
      setActionLoading(rejectVideo._id);

      const response = await axios.patch(
        `${base_url}/learning/yt/status/${rejectVideo._id}`,
        {
          status: "REJECTED",
          rejectionReason: rejectionReason.trim(),
        }
      );

      if (response.data.success) {
        setVideos((prev) =>
          prev.map((item) =>
            item._id === rejectVideo._id
              ? {
                  ...item,
                  status: "REJECTED",
                  rejectionReason: rejectionReason.trim(),
                }
              : item
          )
        );

        toast.success("Video rejected");

        setRejectVideo(null);
        setRejectionReason("");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-6">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
              <FiPlay className="text-red-500" />
              YouTube Videos
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage educational YouTube videos
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-[#303030] dark:bg-[#111]">

            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Videos{" "}
            </span>

            <span className="font-semibold text-gray-900 dark:text-white">
              {pagination.totalYt}
            </span>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* FILTER */}
      {/* ================================================= */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#262626] dark:bg-[#111]">

        <div className="flex flex-col gap-3 lg:flex-row">

          {/* SEARCH */}

          <form
            onSubmit={handleSearch}
            className="flex-1"
          >

            <div className="relative">

              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchInput}
                onChange={(e) =>
                  setSearchInput(e.target.value)
                }
                placeholder="Search videos..."
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

          {/* CATEGORY */}

          <div className="relative lg:w-[280px]">

            <FiFilter
              size={17}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400"
            />

            <select
              value={category}
              onChange={(e) =>
                handleCategory(e.target.value)
              }
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-[#303030] dark:bg-[#181818] dark:text-white"
            >

              <option value="">
                All Categories
              </option>

              {AllCat.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}

            </select>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-[#262626] dark:bg-[#111]">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px] text-left">

            <thead className="border-b border-gray-200 bg-gray-50 dark:border-[#262626] dark:bg-[#181818]">

              <tr>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Video
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Expert
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Category
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Homepage
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-[#242424]">

              {/* LOADING */}

              {loading ? (

                <tr>

                  <td colSpan={6}>

                    <div className="flex h-64 items-center justify-center">

                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-[#333] dark:border-t-blue-500" />

                    </div>

                  </td>

                </tr>

              ) : videos.length === 0 ? (

                /* EMPTY */

                <tr>

                  <td colSpan={6}>

                    <div className="flex h-64 flex-col items-center justify-center">

                      <FiPlay
                        size={42}
                        className="mb-3 text-gray-300 dark:text-gray-700"
                      />

                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        No videos found
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Try changing your search or category
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                /* DATA */

                videos.map((video) => {

                  const youtubeId =
                    getYoutubeId(video.ytlink);

                  return (

                    <tr
                      key={video._id}
                      className="transition hover:bg-gray-50 dark:hover:bg-[#171717]"
                    >

                      {/* VIDEO */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="group relative h-[70px] w-[115px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-[#222]">

                            {youtubeId ? (

                              <img
                                src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                                alt="YouTube thumbnail"
                                className="h-full w-full object-cover"
                              />

                            ) : (

                              <div className="flex h-full items-center justify-center">
                                <FiPlay className="text-gray-400" />
                              </div>

                            )}

                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">

                              <FiPlay
                                size={25}
                                className="text-white"
                                fill="white"
                              />

                            </div>

                          </div>

                          <div className="max-w-[280px]">

                            <a
                              href={video.ytlink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                            >

                              Watch Video

                              <FiExternalLink size={13} />

                            </a>

                            <p className="mt-1 max-w-[260px] truncate text-xs text-gray-400">
                              {video.ytlink}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* EXPERT */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            {video.expertId?.fullname
                              ?.charAt(0)
                              ?.toUpperCase() || "E"}
                          </div>

                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {video.expertId?.fullname ||
                              "Unknown"}
                          </span>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td className="px-5 py-4">

                        <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-[#242424] dark:text-gray-300">
                          {video.category}
                        </span>

                      </td>

                      {/* HOMEPAGE */}

                      <td className="px-5 py-4">

                        <button
                          type="button"
                          disabled={
                            homepageLoading === video._id
                          }
                          onClick={() =>
                            handleHomepageToggle(video)
                          }
                          className={`relative h-6 w-11 rounded-full transition ${
                            video.homepage
                              ? "bg-blue-600"
                              : "bg-gray-300 dark:bg-[#333]"
                          }`}
                        >

                          <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                              video.homepage
                                ? "left-6"
                                : "left-1"
                            }`}
                          />

                        </button>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            video.status ===
                            "PUBLISHED"
                              ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                              : video.status ===
                                "REJECTED"
                              ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                          }`}
                        >
                          {video.status}
                        </span>

                        {video.rejectionReason && (

                          <div className="mt-2 flex max-w-[220px] items-start gap-1 text-xs text-red-500">

                            <FiAlertCircle
                              size={13}
                              className="mt-0.5 flex-shrink-0"
                            />

                            <span className="line-clamp-2">
                              {video.rejectionReason}
                            </span>

                          </div>

                        )}

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          {/* Publish */}

                          {video.status !==
                            "PUBLISHED" && (

                            <button
                              disabled={
                                actionLoading ===
                                video._id
                              }
                              onClick={() =>
                                handlePublish(video)
                              }
                              title="Publish"
                              className="flex h-9 items-center gap-1.5 rounded-lg bg-green-600 px-3 text-xs font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                            >

                              <FiCheck size={15} />

                              Publish

                            </button>

                          )}

                          {/* Reject */}

                          {video.status !==
                            "REJECTED" && (

                            <button
                              disabled={
                                actionLoading ===
                                video._id
                              }
                              onClick={() =>
                                openRejectModal(video)
                              }
                              title="Reject"
                              className="flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                            >

                              <FiX size={15} />

                              Reject

                            </button>

                          )}

                        </div>

                      </td>

                    </tr>

                  );
                })

              )}

            </tbody>

          </table>

        </div>

        {/* ================================================= */}
        {/* PAGINATION */}
        {/* ================================================= */}

        {!loading && videos.length > 0 && (

          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#262626]">

            <p className="text-sm text-gray-500 dark:text-gray-400">

              Showing{" "}

              <span className="font-medium text-gray-700 dark:text-gray-200">
                {(pagination.currentPage - 1) *
                  pagination.limit +
                  1}
              </span>

              {" "}to{" "}

              <span className="font-medium text-gray-700 dark:text-gray-200">
                {Math.min(
                  pagination.currentPage *
                    pagination.limit,
                  pagination.totalYt
                )}
              </span>

              {" "}of{" "}

              <span className="font-medium text-gray-700 dark:text-gray-200">
                {pagination.totalYt}
              </span>

            </p>

            <div className="flex items-center gap-1">

              {/* PREVIOUS */}

              <button
                disabled={
                  pagination.currentPage <= 1
                }
                onClick={() =>
                  goToPage(
                    pagination.currentPage - 1
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#303030] dark:text-gray-400 dark:hover:bg-[#202020]"
              >
                <FiChevronLeft size={18} />
              </button>

              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length: pagination.totalPages,
                },
                (_, i) => i + 1
              )
                .filter(
                  (p) =>
                    p === 1 ||
                    p ===
                      pagination.totalPages ||
                    Math.abs(
                      p -
                        pagination.currentPage
                    ) <= 1
                )
                .map((p, index, arr) => {

                  const previous =
                    arr[index - 1];

                  return (
                    <React.Fragment key={p}>

                      {previous &&
                        p - previous > 1 && (
                          <span className="px-2 text-gray-400">
                            ...
                          </span>
                        )}

                      <button
                        onClick={() =>
                          goToPage(p)
                        }
                        className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                          pagination.currentPage ===
                          p
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-[#303030] dark:text-gray-300 dark:hover:bg-[#202020]"
                        }`}
                      >
                        {p}
                      </button>

                    </React.Fragment>
                  );
                })}

              {/* NEXT */}

              <button
                disabled={
                  pagination.currentPage >=
                  pagination.totalPages
                }
                onClick={() =>
                  goToPage(
                    pagination.currentPage + 1
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#303030] dark:text-gray-400 dark:hover:bg-[#202020]"
              >
                <FiChevronRight size={18} />
              </button>

            </div>

          </div>

        )}

      </div>

      {/* ================================================= */}
      {/* REJECTION MODAL */}
      {/* ================================================= */}

      {rejectVideo && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-[#303030] dark:bg-[#151515]">

            {/* MODAL HEADER */}

            <div className="mb-5 flex items-start justify-between">

              <div>

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reject Video
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Please provide a reason for rejecting
                  this video.
                </p>

              </div>

              <button
                onClick={() => {
                  setRejectVideo(null);
                  setRejectionReason("");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-[#222] dark:hover:text-white"
              >
                <FiX />
              </button>

            </div>

            {/* VIDEO INFO */}

            <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-[#1d1d1d]">

              <FiPlay className="text-red-500" />

              <div className="min-w-0">

                <p className="text-xs text-gray-500">
                  Category
                </p>

                <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                  {rejectVideo.category}
                </p>

              </div>

            </div>

            {/* REASON */}

            <textarea
              value={rejectionReason}
              onChange={(e) =>
                setRejectionReason(e.target.value)
              }
              rows={5}
              placeholder="Enter rejection reason..."
              className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-[#333] dark:bg-[#1c1c1c] dark:text-white dark:placeholder:text-gray-500"
            />

            {/* BUTTONS */}

            <div className="mt-4 flex gap-3">

              <button
                onClick={() => {
                  setRejectVideo(null);
                  setRejectionReason("");
                }}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:border-[#333] dark:text-gray-300 dark:hover:bg-[#222]"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={
                  !rejectionReason.trim() ||
                  actionLoading ===
                    rejectVideo._id
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <FiX size={16} />

                Reject Video

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};