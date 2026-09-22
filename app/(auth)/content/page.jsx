"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import RichEditor from "@/components/RichEditor";
import { base_url } from "@/components/utils";

import {
  FiFileText,
  FiShield,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiLoader,
  FiEye,
  FiSave,
  FiAlertTriangle,
} from "react-icons/fi";

axios.defaults.withCredentials = true;

const pagesSelect = [
  {
    value: "terms and conditon",
    label: "Terms & Conditions",
    icon: FiFileText,
  },
  {
    value: "privicy policy",
    label: "Privacy Policy",
    icon: FiShield,
  },
];

const Page = () => {
  const [selectPage, setSelectPage] = useState("terms and conditon");
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [editData, setEditData] = useState(null);

  // Delete confirmation modal
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchContent = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${base_url}/content/get/${selectPage}`
      );

      const data = response.data;

      if (data.success) {
        // Store complete object, not only des
        setPageData(data.page);
      } else {
        setPageData(null);
      }
    } catch (error) {
      setPageData(null);

      if (error?.response?.status !== 404) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to fetch content"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [selectPage]);



  const handleDelete = async () => {
    if (!pageData?._id) return;

    try {
      setDeleteLoading(true);

      const response = await axios.delete(
        `${base_url}/content/delete/${pageData._id}`
      );

      const data = response.data;

      if (data.success) {
        toast.success(
          data.message || "Content deleted successfully"
        );

        setPageData(null);
        setShowDelete(false);
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setDeleteLoading(false);
    }
  };


  const currentPage = pagesSelect.find(
    (item) => item.value === selectPage
  );

  const CurrentIcon = currentPage?.icon || FiFileText;

  return (
    <div className=" overflow-auto h-screen bg-slate-50 p-4 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

     

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <FiFileText size={21} />
              </div>

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Website Content
                </h1>

                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Manage your website pages and policies
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setEditData(null);
              setShowCreate(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <FiPlus size={18} />
            Add Content
          </button>

        </div>

       

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">

          {pagesSelect.map((item) => {
            const Icon = item.icon;
            const active = selectPage === item.value;

            return (
              <button
                key={item.value}
                onClick={() => setSelectPage(item.value)}
                className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white shadow-lg dark:border-white dark:bg-white dark:text-slate-900"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    active
                      ? "bg-white/10 dark:bg-slate-900/10"
                      : "bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  <Icon size={20} />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold">
                    {item.label}
                  </p>

                  <p
                    className={`mt-0.5 text-xs ${
                      active
                        ? "text-white/60 dark:text-slate-600"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    Manage {item.label.toLowerCase()}
                  </p>
                </div>

                {active && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-current" />
                )}
              </button>
            );
          })}

        </div>

     

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          {/* Card Header */}

          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <CurrentIcon size={19} />
              </div>

              <div>
                <h2 className="font-semibold">
                  {currentPage?.label}
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Page content
                </p>
              </div>

            </div>

            {/* ACTION BUTTONS */}

            {pageData && (
              <div className="flex items-center gap-2">

                {/* EDIT */}

                <button
                  onClick={() => {
                    setEditData(pageData);
                    setShowCreate(true);
                  }}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <FiEdit2 size={16} />
                  <span>Edit</span>
                </button>

                {/* DELETE */}

                <button
                  onClick={() => setShowDelete(true)}
                  className="flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                >
                  <FiTrash2 size={16} />
                  <span>Delete</span>
                </button>

              </div>
            )}

          </div>

          {/* ================= PREVIEW ================= */}

          <div className="min-h-[450px] p-5 sm:p-8">

            {loading ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center">

                <FiLoader
                  size={30}
                  className="animate-spin text-slate-400"
                />

                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  Loading content...
                </p>

              </div>
            ) : pageData?.des ? (

              <div className="mx-auto max-w-4xl">

                <div className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <FiEye size={15} />
                  Content Preview
                </div>

                <article
                
                  dangerouslySetInnerHTML={{
                    __html: pageData.des,
                  }}
                />

              </div>

            ) : (

              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">

                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <FiFileText
                    size={28}
                    className="text-slate-400"
                  />
                </div>

                <h3 className="text-lg font-semibold">
                  No content available
                </h3>

                <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
                  There is no content added for this page yet.
                </p>

                <button
                  onClick={() => {
                    setEditData(null);
                    setShowCreate(true);
                  }}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
                >
                  <FiPlus size={17} />
                  Add Content
                </button>

              </div>

            )}

          </div>

        </div>
      </div>

   

      {showCreate && (
        <CreateContent
          editData={editData}
          selectedPage={selectPage}
          onClose={() => {
            setShowCreate(false);
            setEditData(null);
          }}
          onSuccess={() => {
            setShowCreate(false);
            setEditData(null);
            fetchContent();
          }}
        />
      )}

      

      {showDelete && (
        <DeleteModal
          onClose={() => setShowDelete(false)}
          onDelete={handleDelete}
          loading={deleteLoading}
        />
      )}

    </div>
  );
};

export default Page;




const CreateContent = ({
  editData,
  selectedPage,
  onClose,
  onSuccess,
}) => {
  const [info, setInfo] = useState({
    page: editData?.page || selectedPage || "",
    des: editData?.des || "",
  });

  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(editData?._id);

  const handleSubmit = async () => {
    try {
      if (!info.page?.trim()) {
        toast.warn("Please select a page");
        return;
      }

      if (!info.des?.trim()) {
        toast.warn("Please enter description");
        return;
      }

      setLoading(true);

      let response;

      if (isEdit) {
        response = await axios.put(
          `${base_url}/content/update/${editData._id}`,
          {info:info.des}
        );
      } else {
        response = await axios.post(
          `${base_url}/content/create`,
          info
        );
      }

      const data = response.data;

      if (data.success) {
        toast.success(
          data.message ||
            (isEdit
              ? "Content updated successfully"
              : "Content created successfully")
        );

        onSuccess();
      } else {
        toast.error(
          data.message || "Something went wrong"
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5">

      <section className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">

        {/* Modal Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">

          <div>
            <h2 className="text-lg font-bold">
              {isEdit
                ? "Edit Content"
                : "Create Content"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {isEdit
                ? "Update your page content"
                : "Add content to your website"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <FiX size={19} />
          </button>

        </div>

        {/* Modal Body */}

        <div className="custom-scrollbar flex-1 overflow-y-auto p-5 sm:p-6">

          {/* PAGE */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-semibold">
              Page
            </label>

            <select
              value={info.page}
              disabled={isEdit}
              onChange={(e) =>
                setInfo((prev) => ({
                  ...prev,
                  page: e.target.value,
                }))
              }
              className="
                w-full rounded-xl border
                border-slate-200
                bg-white px-4 py-3
                text-sm text-slate-900
                outline-none
                transition
                focus:border-slate-500
                focus:ring-2
                focus:ring-slate-200
                disabled:cursor-not-allowed
                disabled:opacity-60
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-white
                dark:focus:ring-slate-800
              "
            >
              <option value="" disabled>
                -- Select Page --
              </option>

              {pagesSelect.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="mb-2 block text-sm font-semibold">
              Description
            </label>

            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
              <RichEditor
                content={info.des}
                setContent={(data) =>
                  setInfo((prev) => ({
                    ...prev,
                    des: data,
                  }))
                }
              />
            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end dark:border-slate-800 dark:bg-slate-900/50">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold transition hover:bg-white disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {loading ? (
              <>
                <FiLoader
                  size={17}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                {isEdit ? (
                  <FiEdit2 size={17} />
                ) : (
                  <FiSave size={17} />
                )}

                {isEdit
                  ? "Update Content"
                  : "Save Content"}
              </>
            )}
          </button>

        </div>

      </section>
    </div>
  );
};


/* =========================================================
   DELETE CONFIRMATION MODAL
========================================================= */

const DeleteModal = ({
  onClose,
  onDelete,
  loading,
}) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">

        {/* Icon */}

        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <FiAlertTriangle size={24} />
        </div>

        <h2 className="text-xl font-bold">
          Delete Content?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Are you sure you want to delete this page content?
          This action cannot be undone.
        </p>

        {/* Buttons */}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <FiLoader
                  size={17}
                  className="animate-spin"
                />
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 size={17} />
                Delete
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
