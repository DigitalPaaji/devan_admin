"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const Page = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("DRAFT");

  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchEvent = async () => {
    try {
      const response = await axios.get(
        `${base_url}/events/get/${id}`
      );

      const data = response.data;

      if (data.success) {
        const eventData = data.event;

        setEvent(eventData);
        setStatus(eventData.status);
        setRejectionReason(eventData.rejectionReason || "");
      }
    } catch (error) {
      console.error("Failed to fetch event", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);




  const handleStatusChange = async (value) => {
    if (value === "CANCELLED") {
      setShowCancelPopup(true);
      return;
    }


try {
   const response = await axios.put(`${base_url}/events/update/${id}`,{value}) ;
   const data = await response.data;
   if(data.success){
    toast.success(data.message)
    setStatus(value);
   }
   else{
    toast.error(data.message)

   }
} catch (error) {
        toast.error(error?.response?.data?.message)

}

  };

  const handleCancelConfirm = async() => {
    if (!rejectionReason.trim()) {
      toast.warn("Please enter cancellation reason");
      return;
    }
   try {
       const response = await axios.put(`${base_url}/events/cancel/${id}`,{reason:rejectionReason})
       const data = await response.data;
    if(data.success){
        toast.success(data.message)
      setStatus("CANCELLED");
       setShowCancelPopup(false);
    }
    else{
        toast.error(data.message)
    }
    
} catch (error) {
    toast.error(error?.response?.data?.message)
    
}

 
   
  };

  const handelEventHomepage = async(statuss)=>{
    try {
        const response = await axios.put(`${base_url}/events/hompage/${id}`,{homepage:statuss})
        const data = await response.data;
        if(data.success){
            toast.success(data.message)
            fetchEvent()
        }
        else{
           toast.error(data.message)

       }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
  }







  const handleCancelPopupClose = () => {
    setShowCancelPopup(false);

    setRejectionReason(
      event?.rejectionReason || ""
    );

    setStatus(event?.status || "DRAFT");
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

  if (!event) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-300">
        Event not found
      </div>
    );
  }

  return (
    <div className=" overflow-auto  h-screen bg-gray-50 p-4 dark:bg-[#111] md:p-6">
      <div className="mx-auto max-w-5xl space-y-6">

     
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#2b2b2b] dark:bg-[#181818]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {event.title}
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Event ID: {event._id}
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  handleStatusChange(e.target.value)
                }
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-black dark:border-[#3a3a3a] dark:bg-[#222] dark:text-white dark:focus:border-white"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Image */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#2b2b2b] dark:bg-[#181818]">
            <img
              src={`${img_url}${event.image}`}
              alt={event.title}
              className="h-72 w-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#2b2b2b] dark:bg-[#181818] lg:col-span-2">

            <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
              Event Details
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Venue
                </p>

                <p className="mt-1 font-medium text-gray-900 dark:text-white">
                  {event.venue}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date
                </p>

                <p className="mt-1 font-medium text-gray-900 dark:text-white">
                  {new Date(event.date).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Organizer
                </p>

                <p className="mt-1 font-medium text-gray-900 dark:text-white">
                  {event.organizer.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Organizer Email
                </p>

                <p className="mt-1 font-medium text-gray-900 dark:text-white">
                  {event.organizer.email}
                </p>
              </div>

            </div>

            {/* Description */}
            <div className="mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Description
              </p>

              <div className="mt-2 leading-7 overflow-auto max-w-xl text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{__html:event.description}}>
                
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#2b2b2b] dark:bg-[#181818]">

          <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
            Event Settings
          </h2>

          <div className="flex items-center justify-between">

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Show on Homepage
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Display this event on the website homepage.
              </p>
            </div>

            {/* Toggle */}
            <button
              type="button"
              onClick={() => handelEventHomepage(!event.homepage)}
              className={`relative h-7 w-14 rounded-full transition ${
                event.homepage
                  ? "bg-black dark:bg-white"
                  : "bg-gray-300 dark:bg-[#444]"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full shadow transition ${
                  event.homepage
                    ? "left-8 bg-white dark:bg-black"
                    : "left-1 bg-white"
                }`}
              />
            </button>
          </div>

          {/* Cancellation reason */}
          {status === "CANCELLED" &&
            rejectionReason && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">

                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  Cancellation Reason
                </p>

                <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                  {rejectionReason}
                </p>

              </div>
            )}
        </div>
      </div>

      {/* Cancellation Popup */}
      {showCancelPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-[#333] dark:bg-[#1a1a1a]">

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Cancel Event
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Please provide a reason for cancelling this event.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) =>
                setRejectionReason(e.target.value)
              }
              placeholder="Enter cancellation reason..."
              rows={5}
              className="mt-5 w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-black dark:border-[#3a3a3a] dark:bg-[#222] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white"
            />

            <div className="mt-5 flex justify-end gap-3">

              <button
                type="button"
                onClick={handleCancelPopupClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-[#3a3a3a] dark:text-gray-300 dark:hover:bg-[#292929]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCancelConfirm}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Confirm Cancellation
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;