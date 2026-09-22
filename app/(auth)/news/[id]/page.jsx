"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const Page = () => {
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  const [homepage, setHomepage] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [showRejectPopup, setShowRejectPopup] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${base_url}/news/get/${id}`
      );

      const data = response.data;

      if (data.success) {
        setNews(data.news);

        setHomepage(data.news.homepage);
        setRejected(data.news.rejected);
        setRejectionReason(
          data.news.rejectionReason || ""
        );
      }
    } catch (error) {
      console.error("Failed to fetch news", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNews();
    }
  }, [id]);

  // Homepage toggle
  const handleHomepageToggle = async() => {
  if(rejected){
    toast.warn("News Status rejected")
    return
  }

  try {
    const response = await axios.put(`${base_url}/news/home-updated/${id}`)
    const data = await response.data;
   if(data.success){
       toast.success(data.message)
  
    
        setHomepage((prev) => !prev);
    }
    else{
        toast.error(data.message)
    }
} catch (error) {
    toast.error(error?.response?.data?.message)
    
}

  };

 
  const handleRejectedToggle =async () => {
    if (!rejected) {
      // Turning rejected ON
      setShowRejectPopup(true);
    } else {
      try {
    const response = await axios.put(`${base_url}/news/reject/${id}`,{
        reason : ""
    })
    const data = await response.data;
   if(data.success){
       toast.success("News Updated")
     setRejected(false);
     setHomepage(false)
      setRejectionReason("");
    }
    else{
        toast.error(data.message)
    }
} catch (error) {
    toast.error(error?.response?.data?.message)
    
}
      
    }
  };

  // Confirm rejection
  const handleConfirmRejection = async() => {
    if (!rejectionReason.trim()) {
      toast.warn("Please enter rejection reason");
      return;
    }


try {
    const response = await axios.put(`${base_url}/news/reject/${id}`,{
        reason : rejectionReason.trim()
    })
    const data = await response.data;
   if(data.success){
       toast.success(data.message)
       setRejected(true);
       setShowRejectPopup(false);
    }
    else{
        toast.error(data.message)
    }
} catch (error) {
    toast.error(error?.response?.data?.message)
    
}

  };

  
  const handleClosePopup = () => {
    setShowRejectPopup(false);

    // Restore existing value
    setRejectionReason(
      news?.rejectionReason || ""
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-gray-50 dark:bg-[#111]">
        <p className="text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-300">
        News not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-[#111] md:p-6">

      <div className="mx-auto max-w-5xl space-y-6">

        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#2b2b2b] dark:bg-[#181818]">

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {news.title}
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {news.category}
          </p>

        </div>

        {/* News Details */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Image */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-[#2b2b2b] dark:bg-[#181818]">

            <img
              src={`${img_url}${news.featuredImage}`}
              alt={news.title}
              className="h-72 w-full object-cover"
            />

          </div>

          {/* Details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#2b2b2b] dark:bg-[#181818] lg:col-span-2">

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Expert
                </p>

                <p className="mt-1 font-medium text-gray-900 dark:text-white">
                  {news.expertId?.fullname}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Category
                </p>

                <p className="mt-1 font-medium text-gray-900 dark:text-white">
                  {news.category}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Publication Date
                </p>

                <p className="mt-1 font-medium text-gray-900 dark:text-white">
                  {new Date(
                    news.publicationDate
                  ).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Slug
                </p>

                <p className="mt-1 break-all font-medium text-gray-900 dark:text-white">
                  {news.slug}
                </p>
              </div>

            </div>

            {/* Description */}
            <div className="mt-6">

              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                Description
              </p>

              <div
                className="prose max-w-xl overflow-auto text-gray-800 dark:prose-invert dark:text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: news.description,
                }}
              />

            </div>

          </div>
        </div>

        {/* Settings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#2b2b2b] dark:bg-[#181818]">

          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            News Settings
          </h2>

          <div className="space-y-6">

            {/* Homepage Toggle */}
            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Show on Homepage
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Display this news article on the homepage.
                </p>
              </div>

              <button
                type="button"
                onClick={handleHomepageToggle}
                className={`relative h-7 w-14 rounded-full transition ${
                  homepage
                    ? "bg-black dark:bg-white"
                    : "bg-gray-300 dark:bg-[#444]"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                    homepage
                      ? "left-8 dark:bg-black"
                      : "left-1"
                  }`}
                />
              </button>

            </div>

            {/* Rejected Toggle */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-6 dark:border-[#2b2b2b]">

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Rejected
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Mark this news article as rejected.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRejectedToggle}
                className={`relative h-7 w-14 rounded-full transition ${
                  rejected
                    ? "bg-red-600"
                    : "bg-gray-300 dark:bg-[#444]"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                    rejected
                      ? "left-8"
                      : "left-1"
                  }`}
                />
              </button>

            </div>

            {/* Rejection Reason */}
            {rejected && rejectionReason && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">

                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  Rejection Reason
                </p>

                <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                  {rejectionReason}
                </p>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* Rejection Popup */}
      {showRejectPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-[#333] dark:bg-[#1a1a1a]">

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Reject News
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Please provide a reason for rejecting this news.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) =>
                setRejectionReason(e.target.value)
              }
              placeholder="Enter rejection reason..."
              rows={5}
              className="mt-5 w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-red-500 dark:border-[#3a3a3a] dark:bg-[#222] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-red-500"
            />

            <div className="mt-5 flex justify-end gap-3">

              <button
                type="button"
                onClick={handleClosePopup}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-[#3a3a3a] dark:text-gray-300 dark:hover:bg-[#292929]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmRejection}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Confirm Rejection
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Page;