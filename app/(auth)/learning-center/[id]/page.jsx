"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiChevronDown,
  FiFileText,
  FiHome,
  FiImage,
  FiSave,
  FiTag,
  FiUser,
  FiX,
  FiAlertCircle,
  FiEye,
} from "react-icons/fi";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [homepage, setHomepage] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [showReject, setShowReject] = useState(false);

  // =========================
  // Fetch Article
  // =========================

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${base_url}/learning/article/get/${id}`
      );

      const data = response.data;

      if (data.success) {
        setArticle(data.article);
        setHomepage(data.article.homepage || false);
        setRejectionReason(data.article.rejectionReason || "");
      }
    } catch (error) {
      console.error(error);
        toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  // =========================
  // Homepage Toggle
  // =========================

  const handleHomepageToggle = () => {
    setHomepage((prev) => !prev);
  };

  // =========================
  // Update Homepage
  // =========================

  const updateHomepage = async () => {
    try {
      setSaving(true);

      // Change endpoint according to your backend
      const response = await axios.patch(`${base_url}/learning/article/homepage/${id}`);

      if (response.data.success) {
        toast.success(
          homepage
            ? "Article added to homepage"
            : "Article removed from homepage"
        );

        setArticle((prev) => ({
          ...prev,
          homepage,
        }));
      }
    } catch (error) {
     
        toast.error(error?.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Approve
  // =========================

  const handleApprove = async () => {
    try {
      setSaving(true);

      // Change endpoint according to your backend
      const response = await axios.patch(
        `${base_url}/learning/article/status/${id}`,
        {
          status: "PUBLISHED",
        }
      );

      if (response.data.success) {
        toast.success("Article published");

        setArticle((prev) => ({
          ...prev,
          status: "PUBLISHED",
        }));
      }
    } catch (error) {
        toast.error(error?.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Reject
  // =========================

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter rejection reason");
      return;
    }

    try {
      setSaving(true);

      // Change endpoint according to your backend
      const response = await axios.patch(
        `${base_url}/learning/article/status/${id}`,
        {
          status: "REJECTED",
          rejectionReason: rejectionReason.trim(),
        }
      );

      if (response.data.success) {
        toast.success("Article rejected");

        setArticle((prev) => ({
          ...prev,
          status: "REJECTED",
          rejectionReason: rejectionReason.trim(),
        }));

        setShowReject(false);
      }
    } catch (error) {
      console.error(error);
       toast.error(error?.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0b0b0b]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-[#333] dark:border-t-blue-500" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0b0b0b]">
        <div className="text-center">
          <FiFileText
            size={45}
            className="mx-auto mb-3 text-gray-300 dark:text-gray-700"
          />

          <p className="font-medium text-gray-700 dark:text-gray-300">
            Article not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto  bg-gray-50 dark:bg-[#0b0b0b]">
      <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 dark:border-[#303030] dark:bg-[#111] dark:text-gray-300 dark:hover:bg-[#1c1c1c]"
            >
              <FiArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Article Details
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage and review this article
              </p>
            </div>

          </div>

          {/* Status */}
          <div className="flex items-center gap-3">

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                article.status === "PUBLISHED"
                  ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  : article.status === "REJECTED"
                  ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
              }`}
            >
              {article.status}
            </span>

          </div>

        </div>

        {/* ================================================= */}
        {/* MAIN GRID */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <div className="space-y-6">

            {/* Article Information */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#262626] dark:bg-[#111]">

              <div className="mb-5 flex items-center gap-2">
                <FiFileText className="text-blue-500" />

                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Article Information
                </h2>
              </div>

              {/* Title */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>

                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 dark:border-[#303030] dark:bg-[#181818] dark:text-white">
                  {article.title}
                </div>

              </div>

              {/* Short Description */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Short Description
                </label>

                <div className="min-h-[80px] rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700 dark:border-[#303030] dark:bg-[#181818] dark:text-gray-300">
                  {article.shortDescription || "No description"}
                </div>

              </div>

              {/* Category + Slug */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>

                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-[#303030] dark:bg-[#181818] dark:text-gray-300">
                    <FiTag className="text-gray-400" />
                    {article.category}
                  </div>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Slug
                  </label>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:border-[#303030] dark:bg-[#181818] dark:text-gray-400">
                    {article.slug}
                  </div>

                </div>

              </div>

              {/* Tags */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags
                </label>

                <div className="flex flex-wrap gap-2">

                  {article.tags?.length > 0 ? (
                    article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">
                      No tags
                    </span>
                  )}

                </div>

              </div>

            </section>

            {/* ================================================= */}
            {/* THUMBNAIL */}
            {/* ================================================= */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#262626] dark:bg-[#111]">

              <div className="mb-5 flex items-center gap-2">

                <FiImage className="text-blue-500" />

                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Thumbnail
                </h2>

              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-[#303030] dark:bg-[#181818]">

                <img
                  src={`${img_url}${article.thumbnail}`}
                  alt={article.title}
                  className="max-h-[400px] w-full object-cover"
                />

              </div>

            </section>

            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#262626] dark:bg-[#111]">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <FiFileText className="text-blue-500" />

                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Article Content
                  </h2>

                </div>

                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-500 dark:bg-[#222] dark:text-gray-400">
                  {article.content?.length || 0} Sections
                </span>

              </div>

              <div className="space-y-5">

                {article.content?.map((section, index) => (

                  <div
                    key={section._id || index}
                    className="overflow-hidden rounded-xl border border-gray-200 dark:border-[#303030]"
                  >

                    {/* Section Header */}

                    <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-[#303030] dark:bg-[#181818]">

                      <div className="flex items-center gap-3">

                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                          {index + 1}
                        </span>

                        <span className="text-sm font-semibold text-gray-800 dark:text-white">
                          {section.title || "Untitled Section"}
                        </span>

                      </div>

                      <div
                        className="h-5 w-5 rounded-full border border-gray-300 dark:border-[#444]"
                        style={{
                          backgroundColor:
                            section.color || "#000000",
                        }}
                        title={section.color}
                      />

                    </div>

                    {/* Section Body */}

                    <div className="p-4">

                      <div
                        className="prose max-w-none text-sm dark:prose-invert"
                        dangerouslySetInnerHTML={{
                          __html: section.des || "<p>No content</p>",
                        }}
                      />

                      {section.image && (

                        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 dark:border-[#303030]">

                          <img
                            src={`${img_url}${section.image}`}
                            alt={section.title || "Article image"}
                            className="max-h-[400px] w-full object-cover"
                          />

                        </div>

                      )}

                    </div>

                  </div>

                ))}

              </div>

            </section>

          </div>

          {/* ================================================= */}
          {/* RIGHT SIDEBAR */}
          {/* ================================================= */}

          <div className="space-y-6">

            {/* Expert */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#262626] dark:bg-[#111]">

              <div className="mb-4 flex items-center gap-2">

                <FiUser className="text-blue-500" />

                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Expert
                </h2>

              </div>

              <div className="flex items-center gap-3">

                <img
                  src={`${img_url}${article.expertId?.image}`}
                  alt={article.expertId?.fullname}
                  className="h-12 w-12 rounded-full object-cover"
                />

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {article.expertId?.fullname}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                    {article.expertId?.email}
                  </p>

                </div>

              </div>

              {article.expertId?.about && (

                <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {article.expertId.about}
                </p>

              )}

            </section>

            {/* Homepage */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#262626] dark:bg-[#111]">

              <div className="mb-4 flex items-center gap-2">

                <FiHome className="text-blue-500" />

                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Homepage
                </h2>

              </div>

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Show on homepage
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    Feature this article on the homepage
                  </p>

                </div>

                {/* Toggle */}

                <button
                  type="button"
                  onClick={handleHomepageToggle}
                  className={`relative h-6 w-11 rounded-full transition ${
                    homepage
                      ? "bg-blue-600"
                      : "bg-gray-300 dark:bg-[#333]"
                  }`}
                >

                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                      homepage
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

              <button
                onClick={updateHomepage}
                disabled={saving || homepage === article.homepage}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiSave size={16} />
                Save Homepage Setting
              </button>

            </section>

            {/* Statistics */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#262626] dark:bg-[#111]">

              <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Statistics
              </h2>

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-[#181818]">

                  <FiEye className="mb-2 text-gray-400" />

                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {article.views || 0}
                  </p>

                  <p className="text-xs text-gray-500">
                    Views
                  </p>

                </div>

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-[#181818]">

                  <FiFileText className="mb-2 text-gray-400" />

                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {article.content?.length || 0}
                  </p>

                  <p className="text-xs text-gray-500">
                    Sections
                  </p>

                </div>

              </div>

            </section>

            {/* Dates */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#262626] dark:bg-[#111]">

              <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Article Dates
              </h2>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between gap-3">

                  <span className="text-gray-500">
                    Created
                  </span>

                  <span className="text-right text-gray-700 dark:text-gray-300">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>

                </div>

                <div className="flex justify-between gap-3">

                  <span className="text-gray-500">
                    Updated
                  </span>

                  <span className="text-right text-gray-700 dark:text-gray-300">
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </span>

                </div>

              </div>

            </section>

            {/* ================================================= */}
            {/* ACTIONS */}
            {/* ================================================= */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#262626] dark:bg-[#111]">

              <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Article Actions
              </h2>

              <div className="space-y-3">

                {/* Publish */}

                {article.status !== "PUBLISHED" && (

                  <button
                    disabled={saving}
                    onClick={handleApprove}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                  >
                    <FiCheck size={17} />
                    Publish Article
                  </button>

                )}

                {/* Reject */}

                {article.status !== "REJECTED" && (

                  <button
                    disabled={saving}
                    onClick={() => setShowReject(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                  >
                    <FiX size={17} />
                    Reject Article
                  </button>

                )}

              </div>

            </section>

            {/* Existing rejection reason */}

            {article.rejectionReason && (

              <section className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-500/20 dark:bg-red-500/5">

                <div className="flex items-start gap-3">

                  <FiAlertCircle
                    className="mt-0.5 flex-shrink-0 text-red-500"
                    size={18}
                  />

                  <div>

                    <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">
                      Rejection Reason
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-red-600 dark:text-red-300">
                      {article.rejectionReason}
                    </p>

                  </div>

                </div>

              </section>

            )}

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* REJECTION MODAL */}
      {/* ================================================= */}

      {showReject && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-[#303030] dark:bg-[#151515]">

            <div className="mb-5 flex items-start justify-between">

              <div>

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reject Article
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Please provide a reason for rejecting this article.
                </p>

              </div>

              <button
                onClick={() => setShowReject(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-[#222] dark:hover:text-white"
              >
                <FiX />
              </button>

            </div>

            <textarea
              value={rejectionReason}
              onChange={(e) =>
                setRejectionReason(e.target.value)
              }
              rows={5}
              placeholder="Enter rejection reason..."
              className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-[#333] dark:bg-[#1c1c1c] dark:text-white dark:placeholder:text-gray-500"
            />

            <div className="mt-4 flex gap-3">

              <button
                onClick={() => setShowReject(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:border-[#333] dark:text-gray-300 dark:hover:bg-[#222]"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                <FiX size={16} />
                Reject
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Page;