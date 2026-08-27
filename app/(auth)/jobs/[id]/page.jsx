"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiEdit3,
  FiGlobe,
  FiHome,
  FiMapPin,
  FiPhone,
  FiUser,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const Page = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [homepage, setHomepage] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchJob = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${base_url}/jobs/get/${id}`);

      if (response.data.success) {
        const data = response.data.job;

        setJob(data);
        setHomepage(data.homepage || false);
        setRejected(data.rejected || false);
        setRejectionReason(data.rejectionReason || "");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to fetch job"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const updateJob = async () => {
    try {
      const response = await axios.put(
        `${base_url}/jobs/reject/${id}`,
        { reason: rejected ? rejectionReason : null,
        }
      );

      if (response.data.success) {
        toast.success("Job updated successfully");
setHomepage(false)
        setJob((prev) => ({
          ...prev,
          homepage:false,
          rejected,
          rejectionReason: rejected ? rejectionReason : null,
        }));
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to update job"
      );
    }
  };

const handelHomepage = async()=>{
   if(rejected){
     toast.warn("News Status rejected")
     return
   }
 
   try {
     const response = await axios.put(`${base_url}/jobs/home-updated/${id}`)
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
}


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900 dark:bg-[#0b0d10] dark:text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-500" />

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading job...
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900 dark:bg-[#0b0d10] dark:text-white">
        Job not found
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto  bg-gray-50 text-gray-900 dark:bg-[#0b0d10] dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-[#242932] dark:bg-[#0b0d10]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-100 dark:border-[#242932] dark:bg-[#12151a] dark:hover:bg-[#191d23]"
            >
              <FiArrowLeft size={18} />
            </button>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Job Details
              </p>

              <h1 className="text-lg font-bold sm:text-xl">
                {job.title}
              </h1>
            </div>
          </div>

          {/* Status */}
          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              job.status === "PUBLISHED"
                ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
            }`}
          >
            {job.status}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 dark:border-[#242932] dark:bg-[#12151a] sm:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                  {job.category}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-500/10 dark:text-gray-400">
                  {formatText(job.jobType)}
                </span>

                {job.isFeatured && (
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                    Featured
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold sm:text-3xl">
                {job.title}
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Created on {formatDate(job.createdAt)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat
                icon={<FiUsers />}
                label="Openings"
                value={job.openings}
              />

              <Stat
                icon={<FiGlobe />}
                label="Views"
                value={job.views}
              />

              <Stat
                icon={<FiUser />}
                label="Applications"
                value={job.applicationsCount}
              />

              <Stat
                icon={<FiBriefcase />}
                label="Work Mode"
                value={formatText(job.workMode)}
              />
            </div>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            {/* Job Information */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#242932] dark:bg-[#12151a] sm:p-6">
              <SectionTitle
                icon={<FiBriefcase />}
                title="Job Information"
              />

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={<FiBriefcase />}
                  label="Job Type"
                  value={formatText(job.jobType)}
                />

                <InfoItem
                  icon={<FiHome />}
                  label="Work Mode"
                  value={formatText(job.workMode)}
                />

                <InfoItem
                  icon={<FiMapPin />}
                  label="Location"
                  value={[
                    job.location?.city,
                    job.location?.state,
                    job.location?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                />

                <InfoItem
                  icon={<FiClock />}
                  label="Experience"
                  value={getExperience(job.experience)}
                />

                <InfoItem
                  icon={<FiDollarSign />}
                  label="Salary"
                  value={getSalary(job.salary)}
                />

                <InfoItem
                  icon={<FiUsers />}
                  label="Openings"
                  value={job.openings}
                />
              </div>
            </section>

            {/* Description */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#242932] dark:bg-[#12151a] sm:p-6">
              <SectionTitle
                icon={<FiEdit3 />}
                title="Description"
              />

              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600 dark:text-gray-400">
                {job.description || "No description available."}
              </p>
            </section>

            {/* Responsibilities */}
            <ListSection
              title="Responsibilities"
              icon={<FiCheckCircle />}
              items={job.responsibilities}
            />

            {/* Qualifications */}
            <ListSection
              title="Qualifications"
              icon={<FiCheckCircle />}
              items={job.qualifications}
            />

            {/* Skills */}
            <ListSection
              title="Skills"
              icon={<FiCheckCircle />}
              items={job.skills}
            />
          </div>

          {/* Right */}
          <aside className="space-y-6">
            {/* Expert */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#242932] dark:bg-[#12151a]">
              <SectionTitle
                icon={<FiUser />}
                title="Posted By"
              />

              <div className="mt-5 flex items-center gap-4">
                {job.expertId?.image ? (
                  <img
                    src={`${img_url}${job.expertId.image}`}
                    alt={job.expertId.fullname}
                    className="h-14 w-14 rounded-full border border-gray-200 object-cover dark:border-gray-700"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    <FiUser size={22} />
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="font-semibold">
                    {job.expertId?.fullname}
                  </h3>

                  <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                    {job.expertId?.email}
                  </p>
                </div>
              </div>

              {job.expertId?.phone && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-200 p-3 dark:border-[#242932]">
                  <FiPhone className="text-blue-500" />

                  <span className="text-sm">
                    {job.expertId.phone}
                  </span>
                </div>
              )}

              {job.expertId?.about && (
                <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {job.expertId.about}
                </p>
              )}
            </section>

            {/* Controls */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#242932] dark:bg-[#12151a]">
              <SectionTitle
                icon={<FiEdit3 />}
                title="Job Controls"
              />

              {/* Homepage */}
              <ToggleRow
                title="Show on Homepage"
                description="Display this job on homepage"
                enabled={homepage}
                setEnabled={handelHomepage}
                icon={<FiHome />}
              />

              {/* Rejected */}
              <ToggleRow
                title="Reject Job"
                description="Mark this job as rejected"
                enabled={rejected}
                setEnabled={setRejected}
                icon={<FiXCircle />}
                danger
              />

              {/* Rejection Reason */}
              {rejected && (
                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium">
                    Rejection Reason
                  </label>

                  <textarea
                    rows={5}
                    value={rejectionReason}
                    onChange={(e) =>
                      setRejectionReason(e.target.value)
                    }
                    placeholder="Enter rejection reason..."
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 dark:border-[#2a3039] dark:bg-[#0d1014] dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
              )}

              {/* Save */}
              <button
                onClick={updateJob}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <FiCheckCircle />
                Save Changes
              </button>
            </section>

            {/* Meta */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#242932] dark:bg-[#12151a]">
              <SectionTitle
                icon={<FiCalendar />}
                title="Job Meta"
              />

              <div className="mt-5 space-y-4">
                <MetaRow
                  label="Created"
                  value={formatDate(job.createdAt)}
                />

                <MetaRow
                  label="Updated"
                  value={formatDate(job.updatedAt)}
                />

                <MetaRow
                  label="Slug"
                  value={job.slug}
                />

                <MetaRow
                  label="Currency"
                  value={job.salary?.currency}
                />

                <MetaRow
                  label="Salary Period"
                  value={formatText(job.salary?.period)}
                />
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

/* ================= Components ================= */

const SectionTitle = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500">
        {icon}
      </div>

      <h2 className="font-semibold">{title}</h2>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-[#242932]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-medium">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value }) => {
  return (
    <div className="min-w-[100px] rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-[#242932] dark:bg-[#0d1014]">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500">
        {icon}

        <span className="text-[10px] text-gray-500 dark:text-gray-400">
          {label}
        </span>
      </div>

      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
};

const ListSection = ({ title, icon, items }) => {
  const filteredItems = (items || []).filter(
    (item) => item && item.trim()
  );

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#242932] dark:bg-[#12151a] sm:p-6">
      <SectionTitle icon={icon} title={title} />

      {filteredItems.length > 0 ? (
        <div className="mt-5 space-y-3">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 rounded-xl border border-gray-200 p-4 dark:border-[#242932]"
            >
              <FiCheckCircle className="mt-0.5 shrink-0 text-green-500" />

              <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                {item}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
          No {title.toLowerCase()} added.
        </p>
      )}
    </section>
  );
};

const ToggleRow = ({
  title,
  description,
  enabled,
  setEnabled,
  icon,
  danger = false,
}) => {
  return (
    <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 dark:border-[#242932]">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            danger
              ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500"
              : "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500"
          }`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium">{title}</p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setEnabled(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? danger
              ? "bg-red-500"
              : "bg-blue-600"
            : "bg-gray-300 dark:bg-gray-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

const MetaRow = ({ label, value }) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {label}
      </span>

      <span className="max-w-[60%] break-all text-right text-xs font-medium">
        {value || "-"}
      </span>
    </div>
  );
};

/* ================= Helpers ================= */

const formatText = (value) => {
  if (!value) return "Not specified";

  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getExperience = (experience) => {
  if (!experience) return "Not specified";

  const { min, max } = experience;

  if (min == null && max == null) {
    return "Not specified";
  }

  if (min != null && max != null) {
    return `${min} - ${max} years`;
  }

  if (min != null) {
    return `${min}+ years`;
  }

  return `Up to ${max} years`;
};

const getSalary = (salary) => {
  if (!salary) return "Not specified";

  const { min, max, currency = "INR", period } = salary;

  if (min == null && max == null) {
    return salary.isNegotiable ? "Negotiable" : "Not specified";
  }

  const symbol = currency === "INR" ? "₹" : currency;

  let value = "";

  if (min != null && max != null) {
    value = `${symbol}${Number(min).toLocaleString(
      "en-IN"
    )} - ${symbol}${Number(max).toLocaleString("en-IN")}`;
  } else if (min != null) {
    value = `${symbol}${Number(min).toLocaleString("en-IN")}+`;
  } else {
    value = `Up to ${symbol}${Number(max).toLocaleString(
      "en-IN"
    )}`;
  }

  return `${value} / ${formatText(period)}`;
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default Page;