"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

import {
  FaTrophy,
  FaCrown,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaAward,
  FaChevronRight,
  FaRegImage,
  FaQuestionCircle,
  FaCheckCircle,
  FaMedal,
  FaAlignLeft,
  FaImage,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const Page = () => {
const [selectChampid,setSelectChampid]=useState()
const [addChampload,setAddChampLoad]=useState(false)
const [submitData,setSubmitData]=useState({
   type:"MONTH",description:"",periodStart:"",periodEnd:"",image:null
})
const handleChange = (e) => {
  const { name, value, files } = e.target;

  setSubmitData((prev) => ({
    ...prev,
    [name]: files ? files[0] : value,
  }));
};

const handelAddchamp= async(e)=>{
    e.preventDefault()
setAddChampLoad(true)
try {
    if (!selectChampid || !submitData.type  || !submitData.periodStart || !submitData.periodEnd ) {
toast.warn("Period Start and Period End required ")
return }

const formData= new FormData()

formData.append("userId",selectChampid)
formData.append("type",submitData.type)
formData.append("description",submitData.description)
formData.append("periodStart",submitData.periodStart)
formData.append("periodEnd",submitData.periodEnd)
if(submitData.image){

    formData.append("image",submitData.image)
}


    const response = await axios.post(`${base_url}/questions/create/champ`,formData)
    const data = await response.data;
    if(data.success){
        toast.success(data.message)
        setSelectChampid(null)
    }else{
        toast.error(data.message)
    }
    console.log(data)
} catch (error) {
    toast.error(error?.response?.data?.message)
    
}finally{
  setAddChampLoad(false)
  
}


}

  return (
    <div className="h-screen overflow-auto bg-gray-50 px-4 py-8 text-gray-900 transition-colors dark:bg-black dark:text-white md:px-8">
     {selectChampid ? 
       <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">

    <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5 dark:border-zinc-800">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400">
        <FaTrophy />
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Create Champion
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add champion details and champion period
        </p>
      </div>
    </div>

    {/* Form */}
    <div className="space-y-5">
      {/* Type */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Champion Type
        </label>

        <div className="relative">
          <FaTrophy className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <select
            name="type"
            value={submitData.type}
            onChange={handleChange}
            className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          >
            <option value="WEEK">Week</option>
            <option value="MONTH">Month</option>
            <option value="YEAR">Year</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Description
        </label>

        <div className="relative">
          <FaAlignLeft className="pointer-events-none absolute left-4 top-4 text-gray-400" />

          <textarea
            name="description"
            value={submitData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Write champion description..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Start */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Period Start
          </label>

          <div className="relative">
            <FaCalendarAlt className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="date"
              name="periodStart"
              value={submitData.periodStart}
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
          </div>
        </div>

        {/* End */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Period End
          </label>

          <div className="relative">
            <FaCalendarAlt className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="date"
              name="periodEnd"
              value={submitData.periodEnd}
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Champion Certificate
        </label>

        <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-8 transition hover:border-yellow-400 hover:bg-yellow-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-yellow-500 dark:hover:bg-yellow-500/5">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm dark:bg-zinc-950 dark:text-gray-500">
            <FaImage className="text-xl" />
          </div>

          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {submitData.image
              ? submitData.image.name
              : "Click to upload champion image"}
          </p>

          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            PNG, JPG or WEBP
          </p>

          <input
            type="file"
            name="image"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleChange}
            className="hidden"
          />
        </label>

        {/* Preview */}
        {submitData.image && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <img
              src={URL.createObjectURL(submitData.image)}
              alt="Champion preview"
              className="h-16 w-16 rounded-lg object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                {submitData.image.name}
              </p>

              <p className="text-xs text-gray-400">
                {(submitData.image.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSubmitData((prev) => ({
                  ...prev,
                  image: null,
                }))
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/10"
            >
              <FaTimes />
            </button>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 dark:border-zinc-800 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() =>setSelectChampid(null)}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-900"
        >
          <FaTimes />
          Cancel
        </button>

        <button
          type="button"
          onClick={handelAddchamp}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-yellow-500 px-6 text-sm font-bold text-white transition hover:bg-yellow-600 active:scale-[0.98]"
        >
          <FaSave />
          Create Champion
        </button>
      </div>
    </div>
  </div>: 
      <Suspense fallback={<ChampionSkeleton />}>
        <Champions  setSelectChampid={setSelectChampid} />
      </Suspense>}
    </div>
  );
};

export default Page;

/* =========================================================
   CHAMPIONS
========================================================= */

const Champions = ({setSelectChampid}) => {
  const query = useSearchParams();
  const route = useRouter()
  const type = query.get("type") || "week";

  const [champions, setChampions] = useState([]);
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchChampion = async (championType) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${base_url}/questions/get/champions/${championType.toUpperCase()}`
      );

      const data = response.data;

      if (data.success) {
        const championData = data.champions || [];

        setChampions(championData);

        if (championData.length > 0) {
          setSelectedChampion(championData[0]);
        } else {
          setSelectedChampion(null);
        }
      }
    } catch (error) {
      console.error("Error fetching champions:", error);

      setChampions([]);
      setSelectedChampion(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChampion(type);
  }, [type]);

  if (loading) {
    return <ChampionSkeleton />;
  }

  return (
    <div className=" ">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400">
            <FaTrophy className="text-2xl" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              Champions
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Meet our {type.toLowerCase()} challenge champions
            </p>
          </div>
        </div>

        {/* Type */}
        <div className="hidden rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase text-gray-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-300 sm:block">
          {/* {type} Champion */}

<select name="" id="" value={type} onChange={(e)=>route.push(`/champions?type=${e.target.value}`)} >
<option value="week">Week</option>
<option value="month">Month</option>
<option value="year">Year</option>


</select>

        </div>
      </div>

      {/* =====================================================
          NO DATA
      ===================================================== */}

      {champions.length === 0 ? (
        <EmptyChampion />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            {selectedChampion && (
              <ChampionDetails champion={selectedChampion} />
            )}
          </div>

          {/* RIGHT */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  All Champions
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Previous winners
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-zinc-900 dark:text-gray-300">
                {champions.length} Winner
                {champions.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-4">
              {champions.map((champion) => (
                <ChampionCard
                  key={champion._id}
                  champion={champion}
                  setSelectChampid={setSelectChampid}
                  selected={selectedChampion?._id === champion._id}
                  onClick={() => setSelectedChampion(champion)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   CHAMPION DETAILS
========================================================= */

const ChampionDetails = ({ champion }) => {
  const user = champion.userId;
  const challenge = champion.challengeId;
  const answer = champion.answerId;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* TOP GOLD SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 px-6 py-10">
        {/* Background icons */}
        <FaTrophy className="absolute -right-10 -top-10 text-[180px] text-white/10" />

        <FaCrown className="absolute bottom-5 left-5 text-5xl text-white/10" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-xl">
              {user?.image ? (
                <img
                  src={`${img_url}${user.image}`}
                  alt={user?.fullname || "Champion"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUser className="text-4xl text-gray-400" />
              )}
            </div>

            {/* Crown */}
            <div className="absolute -bottom-3 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-yellow-500 text-white shadow-lg">
              <FaCrown />
            </div>
          </div>

          {/* Badge */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            <FaMedal />

            {champion.type}
          </div>

          <h2 className="mt-3 text-2xl font-extrabold text-white">
            {champion.title}
          </h2>

          <p className="mt-1 text-lg font-semibold text-white/90">
            {user?.fullname}
          </p>
        </div>
      </div>

      {/* USER DETAILS */}
      <div className="border-b border-gray-100 p-5 dark:border-zinc-800">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoItem
            icon={<FaUser />}
            label="Name"
            value={user?.fullname}
          />

          <InfoItem
            icon={<FaEnvelope />}
            label="Email"
            value={user?.email}
          />
        </div>
      </div>

      {/* CHALLENGE */}
      <div className="p-5">
        <SectionTitle
          icon={<FaAward />}
          title="Winning Challenge"
        />

        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            <FaQuestionCircle />

            Question
          </div>

          <p className="mt-3 text-sm leading-6 text-gray-800 dark:text-gray-200">
            {challenge?.question || "No question available"}
          </p>

          {/* Reference */}
          {challenge?.referenceImages && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-300">
              <FaRegImage className="text-blue-500" />

              <span>Reference material available</span>
            </div>
          )}
        </div>

        {/* ANSWER */}
        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900/50 dark:bg-green-950/20">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
            <FaCheckCircle />

            Champion's Answer
          </div>

          <p className="mt-3 text-sm leading-6 text-gray-800 dark:text-gray-200">
            {answer?.answer || "No answer available"}
          </p>
        </div>
      </div>

      {/* PERIOD */}
      <div className="border-t border-gray-100 p-5 dark:border-zinc-800">
        <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-zinc-900">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
            <FaCalendarAlt />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Champion Period
            </p>

            <p className="mt-1 text-sm font-bold text-gray-800 dark:text-gray-200">
              {formatDate(champion.periodStart)}
              {" — "}
              {formatDate(champion.periodEnd)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   CHAMPION CARD
========================================================= */

const ChampionCard = ({
  champion,
  selected,
  onClick,
  setSelectChampid
}) => {
  const user = champion.userId;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
        selected
          ? "border-yellow-400 bg-yellow-50 shadow-md ring-2 ring-yellow-100 dark:border-yellow-500 dark:bg-yellow-500/5 dark:ring-yellow-500/10"
          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-yellow-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-yellow-600"
      }`}
    >
      <div className="flex items-center gap-4">
        {/* IMAGE */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900">
          {user?.image ? (
            <img
              src={`${img_url}${user.image}`}
              alt={user?.fullname || "Champion"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <FaUser className="text-xl text-gray-400" />
            </div>
          )}

          <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] text-white">
            <FaCrown />
          </div>
        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-gray-900 dark:text-white">
              {user?.fullname}
            </h3>

            <span className="shrink-0 rounded-full bg-yellow-100 px-2 py-0.5 text-[9px] font-extrabold uppercase text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
              {champion.type}
            </span>
          </div>

          <p className="mt-1 truncate text-sm text-gray-600 dark:text-gray-400">
            {champion.title}
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <FaCalendarAlt />

            {formatDate(champion.periodStart)}
          </div>
        </div>

        {/* ARROW */}
        <div
        onClick={(e)=>{e.preventDefault(),setSelectChampid(user._id)}}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition cursor-pointer ${
            selected
              ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400"
              : "bg-gray-100 text-gray-400 group-hover:bg-yellow-100 group-hover:text-yellow-600 dark:bg-zinc-900 dark:text-gray-500 dark:group-hover:bg-yellow-500/10 dark:group-hover:text-yellow-400"
          }`}
        >
          <FaChevronRight className="text-sm" />
        </div>
      </div>
    </button>
  );
};

/* =========================================================
   INFO ITEM
========================================================= */

const InfoItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm dark:bg-zinc-950 dark:text-gray-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   SECTION TITLE
========================================================= */

const SectionTitle = ({
  icon,
  title,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        {icon}
      </div>

      <h3 className="font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
    </div>
  );
};

/* =========================================================
   EMPTY
========================================================= */

const EmptyChampion = () => {
  return (
    <div className="flex min-h-[450px] items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400">
          <FaTrophy className="text-3xl" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
          No Champion Found
        </h2>

        <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          There is no champion available for this challenge period.
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   SKELETON
========================================================= */

const ChampionSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 h-14 w-64 animate-pulse rounded-xl bg-gray-200 dark:bg-zinc-900" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-[650px] animate-pulse rounded-3xl bg-gray-200 dark:bg-zinc-900" />

        <div className="space-y-4">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200 dark:bg-zinc-900" />

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl bg-gray-200 dark:bg-zinc-900"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   DATE FORMAT
========================================================= */

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};