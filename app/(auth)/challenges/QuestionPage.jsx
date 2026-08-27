"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiFile,
  FiFileText,
  FiImage,
  FiLoader,
  FiTrash2,
  FiVideo,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";

const QuestionPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "";

  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [viewQuestion, setViewQuestion] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
const [selectWeekDate,setSelectWeekDate]=useState({
    start:null,
    end:null
})


  // ------------------------------------------------
  // Fetch Questions
  // ------------------------------------------------

  const fetchQuestion = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", page);

      if (status) {
        params.set("status", status);
      }

      const response = await axios.get(
        `${base_url}/questions/get?${params.toString()}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        setQuestions(data.data || []);
        setPagination(
          data.pagination || {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          }
        );
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error("Fetch questions error:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  // ------------------------------------------------
  // URL Filter
  // ------------------------------------------------

  const handleStatusChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }

    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  // ------------------------------------------------
  // Pagination
  // ------------------------------------------------

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(newPage));

    router.push(`?${params.toString()}`);
  };

  // ------------------------------------------------
  // Delete
  // ------------------------------------------------

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      const response = await axios.delete(
        `${base_url}/questions/delete/${deleteId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setQuestions((prev) =>
          prev.filter((item) => item._id !== deleteId)
        );

        setPagination((prev) => ({
          ...prev,
          total: Math.max(prev.total - 1, 0),
        }));

        setDeleteId(null);
      }
    } catch (error) {
      console.error("Delete question error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ------------------------------------------------
  // File Icon
  // ------------------------------------------------

  const getFileIcon = (file) => {
    if (!file) return <FiFile size={20} />;

    const extension = file.split(".").pop()?.toLowerCase();

    if (
      ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(
        extension
      )
    ) {
      return <FiImage size={20} />;
    }

    if (
      ["mp4", "mov", "avi", "mkv", "webm"].includes(extension)
    ) {
      return <FiVideo size={20} />;
    }

    if (extension === "pdf") {
      return <FiFileText size={20} />;
    }

    return <FiFile size={20} />;
  };

  // ------------------------------------------------
  // File Name
  // ------------------------------------------------

  const getFileName = (file) => {
    if (!file) return "No file";

    return file.split("/").pop();
  };

  // ------------------------------------------------
  // Render
  // ------------------------------------------------


const handelChangeStatus =async(e)=>{
    try {
      const newStatus = e.target.value;
  const questionId = viewQuestion?._id;
         

  if (!questionId || !newStatus) return;
const response = await axios.put(`${base_url}/questions/update/status`,{
    questionId,status:newStatus
},{
    withCredentials:true
})

const data = await response.data;
if(data.success){
    toast.success(data.message)
    setViewQuestion(prev=>({...prev,status:newStatus}))

   const NewData=  questions.map((item)=>item._id.toString()==questionId.toString() ?  {...item,status:newStatus}   : item)
    setQuestions(NewData)
}

else{
    toast.error(data.message)
    
}

} catch (error) {
        toast.error(error?.response?.data?.message)
        
    }
}

const handelSelectWeekQuestion = async(e)=>{
    try {
        const {start,end} = selectWeekDate
  const questionId = viewQuestion?._id;
if (start >= end) {

    toast.error("Start date cannot be equal or greater than end date")
return
}



const response = await axios.put(`${base_url}/questions/update/active-question`,{
    start,end,questionId
},{
    withCredentials:true
})

const data = await  response.data;


if(data.success){
 toast.success(data.message)
 setViewQuestion(prev=>({...prev,status:"ACTIVE"}))
 
 const NewData=  questions.map((item)=>item._id.toString()==questionId.toString() ?  {...item,status:"ACTIVE",startDate:start ,submissionDeadline:end}   : item)
 setQuestions(NewData)
}

else{
    toast.error(data.message)
    
}






} catch (error) {
        toast.error(error?.response?.data?.message)   
        
    }
}






  return (
    <div className="h-screen overflow-auto bg-neutral-50 p-4 text-neutral-900 dark:bg-black dark:text-white md:p-6">
      <div className="mx-auto max-w-7xl">
       
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Weekly Questions
            </h1>

            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Manage and review weekly challenge questions.
            </p>
          </div>

       
          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) =>
                handleStatusChange(e.target.value)
              }
              className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
            >
<option value="">All Status</option>
              {["DRAFT","ACTIVE","SUBMISSION_CLOSED","RESULT_ANNOUNCED","COMPLETED"].map((item,index)=>
<option value={item} key={index} >{item}</option>
)}
            
            </select>
          </div>
        </div>

       
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Total Questions
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {pagination.total}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Current Page
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {pagination.page}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Total Pages
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {pagination.totalPages}
            </p>
          </div>
        </div>

       
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    #
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Question
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Expert
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Reference
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
               
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-20">
                      <div className="flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400">
                        <FiLoader
                          size={24}
                          className="animate-spin"
                        />

                        <p className="mt-3 text-sm">
                          Loading questions...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : questions.length === 0 ? (
                
                  <tr>
                    <td colSpan={6} className="px-5 py-20">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                          <FiFileText size={24} />
                        </div>

                        <h3 className="mt-4 font-medium">
                          No questions found
                        </h3>

                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                          Try changing your status filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  questions.map((item, index) => (
                    <tr
                      key={item._id}
                      className="transition hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                    >
                     
                      <td className="px-5 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                        {(page - 1) * pagination.limit +
                          index +
                          1}
                      </td>

                     
                      <td className="max-w-[350px] px-5 py-4">
                        <p className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-white">
                          {item.question}
                        </p>
                      </td>

                  
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            {item.expertId?.email || "Unknown"}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                            Expert
                          </p>
                        </div>
                      </td>

                   
                      <td className="px-5 py-4">
                        {item.referenceImages ? (
                          <a
                            href={`${img_url}${item.referenceImages}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex max-w-[220px] items-center gap-3"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
                              {getFileIcon(
                                item.referenceImages
                              )}
                            </div>

                            <span className="truncate text-sm text-neutral-700 hover:underline dark:text-neutral-300">
                              {getFileName(
                                item.referenceImages
                              )}
                            </span>
                          </a>
                        ) : (
                          <span className="text-sm text-neutral-400">
                            No file
                          </span>
                        )}
                      </td>

                     
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                            item.status === "DRAFT"
                              ? "border-neutral-300 bg-neutral-100 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                              : "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                    
                      <td className="px-5 py-4 text-right">
                     
                          <button
                            onClick={() =>{
                              setViewQuestion(item),
                              setSelectWeekDate({start:item?.startDate?.split("T")[0],end:item?.submissionDeadline?.split("T")[0]})
                            }}
                            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-black hover:text-white dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-white dark:hover:text-black"
                          >
                           <FiEye size={16} />
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
          {!loading && questions.length > 0 && (
            <div className="flex flex-col gap-4 border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Showing page{" "}
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {pagination.totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => goToPage(page - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-300 text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
                >
                  <FiChevronLeft size={18} />
                </button>

                <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-black px-3 text-sm font-medium text-white dark:bg-white dark:text-black">
                  {page}
                </div>

                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => goToPage(page + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-300 text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

     
    {viewQuestion && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
    <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Question Details
          </h2>

          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Weekly challenge question
          </p>
        </div>

        <button
          onClick={() => setViewQuestion(null)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
        >
          <FiX size={19} />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto p-5">

        {/* Expert */}
        <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
          
          {viewQuestion.expertId?.image ? (
            <img
              src={`${img_url}${viewQuestion.expertId.image}`}
              alt={viewQuestion.expertId.email}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-sm font-semibold text-white dark:bg-white dark:text-black">
              {viewQuestion.expertId?.email
                ?.charAt(0)
                ?.toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex gap-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Created by : 
            </p>
 <p className=" text-sm  text-neutral-900 dark:text-white"> { viewQuestion.expertId?.fullname || "Unknown Expert"}</p>

</div>
            <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
              {viewQuestion.expertId?.email || "Unknown Expert"}
            </p>
          </div>

         
<select name="" id="" onChange={(e)=>handelChangeStatus(e)} value={viewQuestion.status} className="rounded-full  px-3 py-1  font-medium border-black bg-white text-black dark:border-white dark:bg-black dark:text-white ">
{["DRAFT","ACTIVE","SUBMISSION_CLOSED","RESULT_ANNOUNCED","COMPLETED"].map((item,index)=>
<option value={item} key={index} disabled={item=="ACTIVE"}>{item}</option>
)}


</select>
         
          {/* <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              viewQuestion.status === "DRAFT"
                ? "border-neutral-300 bg-neutral-100 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
                : "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
            }`}
          >
            {viewQuestion.status}
          </span> */}
        </div>

        {/* Question */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Question
            </h3>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
            <p className="whitespace-pre-wrap text-sm leading-7 text-neutral-700 dark:text-neutral-300">
              {viewQuestion.question}
            </p>
          </div>
        </div>

        {/* Reference File */}
        {viewQuestion.referenceImages && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-white">
              Reference Material
            </h3>

            <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">

              {(() => {
                const file = viewQuestion.referenceImages;
                const extension =
                  file.split(".").pop()?.toLowerCase();

                const fileUrl = `${img_url}${file}`;

                // Image
                if (
                  ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(
                    extension
                  )
                ) {
                  return (
                    <div className="bg-neutral-100 p-3 dark:bg-neutral-900">
                      <img
                        src={fileUrl}
                        alt="Reference"
                        className="max-h-[350px] w-full rounded-lg object-contain"
                      />
                    </div>
                  );
                }

                // Video
                if (
                  ["mp4", "webm", "mov", "avi", "mkv"].includes(
                    extension
                  )
                ) {
                  return (
                    <video
                      controls
                      className="max-h-[350px] w-full bg-black"
                    >
                      <source src={fileUrl} />
                      Your browser does not support video playback.
                    </video>
                  );
                }

                // PDF
                if (extension === "pdf") {
                  return (
                    <iframe
                      src={fileUrl}
                      className="h-[400px] w-full"
                      title="Reference PDF"
                    />
                  );
                }

                // Other files
                return (
                  <div className="flex items-center justify-between gap-4 bg-neutral-50 p-4 dark:bg-neutral-900">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        <FiFile size={21} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                          {file.split("/").pop()}
                        </p>

                        <p className="mt-1 text-xs uppercase text-neutral-500 dark:text-neutral-400">
                          {extension || "File"}
                        </p>
                      </div>
                    </div>

                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-lg bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                      Open File
                    </a>
                  </div>
                );
              })()}

            </div>
          </div>
        )}
      </div>



   <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 md:p-5">
  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

    {/* Start Date */}
    <div className="w-full md:flex-1">
      <label
        htmlFor="startdate"
        className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        Select Start Date
      </label>

      <input
        type="date"
        id="startdate"
        value={selectWeekDate.start}
        onChange={(e) =>
          setSelectWeekDate((prev) => ({
            ...prev,
            start: e.target.value,
          }))
        }
        className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
      />
    </div>

    {/* Button */}
    <div className="w-full md:w-auto">
      <button
        onClick={handelSelectWeekQuestion}
        className="w-full rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-neutral-200 md:w-auto"
      >
        Set Week Question
      </button>
    </div>

    {/* End Date */}
    <div className="w-full md:flex-1">
      <label
        htmlFor="enddate"
        className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        Select End Date
      </label>

      <input
        type="date"
        id="enddate"
        value={selectWeekDate.end}
        onChange={(e) =>
          setSelectWeekDate((prev) => ({
            ...prev,
            end: e.target.value,
          }))
        }
        className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
      />
    </div>
  </div>

  {/* Selected week info */}
  {selectWeekDate.start && selectWeekDate.end && (
    <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Selected Week
      </p>

      <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
        {selectWeekDate.start}{" "}
        <span className="mx-2 text-neutral-400">→</span>{" "}
        {selectWeekDate.end}
      </p>
    </div>
  )}
</div>


      <div className="flex justify-end border-t border-neutral-200 px-5 py-4 dark:border-neutral-800">
        <button
          onClick={() => setViewQuestion(null)}
          className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default QuestionPage;