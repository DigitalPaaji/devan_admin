
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  FaTrophy,
  FaMedal,
  FaCrown,
  FaStar,
  FaCalendarAlt,
  FaUser,
  FaAward,
  FaSyncAlt,
  FaChevronRight,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import { base_url, img_url } from "@/components/utils";

axios.defaults.withCredentials = true;

// ===============================
// Helper Functions
// ===============================

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name) => {
  if (!name) return "U";

  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const getImageUrl = (image) => {
  if (!image) return null;

  if (image.startsWith("http")) return image;

  return `${img_url}${image}`;
};

// ===============================
// Tabs
// ===============================

const tabs = [
  {
    id: "WEEK",
    label: "Weekly",
    icon: FaTrophy,
    description: "Weekly champion records",
  },
  {
    id: "MONTH",
    label: "Monthly",
    icon: FaMedal,
    description: "Monthly champion records",
  },
  {
    id: "YEAR",
    label: "Yearly",
    icon: FaCrown,
    description: "Yearly champion records",
  },
  {
    id: "HOF",
    label: "Hall of Fame",
    icon: FaStar,
    description: "Recognized champions",
  },
];

// ===============================
// Champion Row
// ===============================

const ChampionRow = ({ champion, index, onView }) => {
  const user = champion.userId;

  const image = getImageUrl(user?.image);

  return (
    <div
      className="
        group flex flex-col gap-4 rounded-2xl
        border border-gray-200 bg-white p-4
        transition hover:border-emerald-300 hover:shadow-sm
        dark:border-slate-700 dark:bg-slate-900
        dark:hover:border-emerald-700
        sm:flex-row sm:items-center
      "
    >
      {/* Rank */}
      <div
        className="
          flex h-10 w-10 shrink-0 items-center justify-center
          rounded-xl bg-amber-50 text-sm font-bold text-amber-700
          dark:bg-amber-950/40 dark:text-amber-400
        "
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Champion Profile */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {image ? (
          <img
            src={image}
            alt={user?.fullname || "Champion"}
            className="
              h-12 w-12 shrink-0 rounded-full object-cover
              ring-2 ring-gray-100 dark:ring-slate-700
            "
          />
        ) : (
          <div
            className="
              flex h-12 w-12 shrink-0 items-center justify-center
              rounded-full bg-emerald-100 font-semibold text-emerald-700
              dark:bg-emerald-900/40 dark:text-emerald-300
            "
          >
            {getInitials(user?.fullname)}
          </div>
        )}

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {user?.fullname || "Unknown User"}
          </h3>

          <p className="truncate text-xs text-gray-500 dark:text-slate-400">
            {user?.email || "No email available"}
          </p>

          <div className="mt-1 flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500">
            <FaUser size={11} />
            <span>Champion</span>
          </div>
        </div>
      </div>

      {/* Period */}
      <div className="min-w-0 sm:w-52">
        <div className="mb-1 flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500">
          <FaCalendarAlt size={12} />
          <span>Period</span>
        </div>

        <p className="text-sm font-medium text-gray-700 dark:text-slate-200">
          {formatDate(champion.periodStart)}
        </p>

        <p className="text-xs text-gray-400 dark:text-slate-500">
          to {formatDate(champion.periodEnd)}
        </p>
      </div>

      {/* Status */}
      <div className="sm:w-24">
        <span
          className={`
            inline-flex items-center gap-1.5 rounded-full px-3 py-1
            text-xs font-medium
            ${
              champion.isActive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400"
            }
          `}
        >
          {champion.isActive ? (
            <FaCheckCircle size={11} />
          ) : (
            <FaTimesCircle size={11} />
          )}

          {champion.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* View */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onView(champion)}
          className="
            flex h-9 w-9 items-center justify-center rounded-lg
            text-gray-400 transition hover:bg-gray-100 hover:text-gray-700
            dark:hover:bg-slate-800 dark:hover:text-white
          "
          aria-label="View champion"
        >
          <FaChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

// ===============================
// Empty State
// ===============================

const EmptyState = ({ label }) => {
  return (
    <div
      className="
        flex min-h-[240px] flex-col items-center justify-center
        rounded-2xl border border-dashed border-gray-300
        bg-white px-6 text-center
        dark:border-slate-700 dark:bg-slate-900
      "
    >
      <div
        className="
          mb-4 flex h-14 w-14 items-center justify-center
          rounded-2xl bg-gray-100 text-gray-400
          dark:bg-slate-800 dark:text-slate-500
        "
      >
        <FaTrophy size={25} />
      </div>

      <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-200">
        No {label} Champions
      </h3>

      <p className="mt-1 text-sm text-gray-400 dark:text-slate-500">
        Champion records will appear here.
      </p>
    </div>
  );
};

// ===============================
// Main Page
// ===============================

const Champions = () => {
  const [champions, setChampions] = useState(null);

  const [activeTab, setActiveTab] = useState("WEEK");

  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedChampion, setSelectedChampion] = useState(null);

  // ===============================
  // Fetch Champions
  // ===============================

  const fetchChamp = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await axios.get(
        `${base_url}/questions/get/all/champions`
      );

      const data = response.data;

      if (data.success) {
        setChampions(data);
      } else {
        toast.error("Failed to fetch champions");
      }
    } catch (error) {
      console.error("Fetch Champions Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to load champions"
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChamp();
  }, []);

  // ===============================
  // Get Active List
  // ===============================

  const getActiveChampions = () => {
    if (!champions) return [];

    switch (activeTab) {
      case "WEEK":
        return champions.weeklychampoin || [];

      case "MONTH":
        return champions.Monthlychampoin || [];

      case "YEAR":
        return champions.yearlychampoin || [];

      case "HOF":
        return champions.HOFchampoin || [];

      default:
        return [];
    }
  };

  const activeChampions = getActiveChampions();

  // ===============================
  // Search Filter
  // ===============================

  const filteredChampions = activeChampions.filter((champion) => {
    const name = champion?.userId?.fullname || "";

    const email = champion?.userId?.email || "";

    const keyword = search.toLowerCase().trim();

    return (
      name.toLowerCase().includes(keyword) ||
      email.toLowerCase().includes(keyword)
    );
  });

  // ===============================
  // Active Tab Data
  // ===============================

  const activeTabData = tabs.find(
    (tab) => tab.id === activeTab
  );

  // ===============================
  // Count
  // ===============================

  const getCount = (id) => {
    if (!champions) return 0;

    switch (id) {
      case "WEEK":
        return champions.weeklychampoin?.length || 0;

      case "MONTH":
        return champions.Monthlychampoin?.length || 0;

      case "YEAR":
        return champions.yearlychampoin?.length || 0;

      case "HOF":
        return champions.HOFchampoin?.length || 0;

      default:
        return 0;
    }
  };

  const totalChampions = tabs.reduce(
    (total, tab) => total + getCount(tab.id),
    0
  );

  // ===============================
  // View Champion
  // ===============================

  const handleView = (champion) => {
    setSelectedChampion(champion);
  };

  // ===============================
  // Close Modal
  // ===============================

  const closeModal = () => {
    setSelectedChampion(null);
  };


const handelHallofFame= async(id)=>{
try {
  const resposne = await axios.post(`${base_url}/questions/add/hallofhame`,{id})
  const data = await resposne.data;
  if(data.success){
    toast.success(data.message)
    fetchChamp()
  }else{
    toast.error(data.message)
  }
} catch (error) {
  toast.error(error?.response?.data?.message)

}
}



  return (
    <div
      className="
        h-screen  overflow-auto bg-[#f8fafc] px-4 py-6
        text-gray-900 dark:bg-slate-950 dark:text-white
        sm:px-6 lg:px-8
      "
    >
      <div className="mx-auto max-w-[1500px]">

        {/* =================================
            Header
        ================================= */}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
              <FaAward size={16} />

              <span>Recognition Management</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Champions
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Manage weekly, monthly, yearly and Hall of Fame champions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchChamp(true)}
            disabled={isRefreshing}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl bg-[#2F6F5C] px-4 py-2.5
              text-sm font-semibold text-white transition
              hover:bg-[#245947] disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <FaSyncAlt
              size={14}
              className={isRefreshing ? "animate-spin" : ""}
            />

            Refresh
          </button>
        </div>

        {/* =================================
            Overview Cards
        ================================= */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            const count = getCount(tab.id);

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearch("");
                }}
                className={`
                  rounded-2xl border p-5 text-left transition
                  ${
                    activeTab === tab.id
                      ? "border-[#2F6F5C] bg-[#2F6F5C]/5 shadow-sm dark:border-emerald-700 dark:bg-emerald-950/20"
                      : "border-gray-200 bg-white hover:border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="
                      flex h-10 w-10 items-center justify-center
                      rounded-xl bg-amber-50 text-amber-600
                      dark:bg-amber-950/40 dark:text-amber-400
                    "
                  >
                    <Icon size={19} />
                  </div>

                  <FaChevronRight
                    size={14}
                    className="text-gray-400 dark:text-slate-500"
                  />
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    {tab.label}
                  </p>

                  <h2 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                    {isLoading ? "—" : count}
                  </h2>

                  <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
                    {tab.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* =================================
            Main Content
        ================================= */}

        <div
          className="
            rounded-2xl border border-gray-200 bg-white p-4
            dark:border-slate-700 dark:bg-slate-900
            sm:p-6
          "
        >
          {/* Section Header */}

          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />

                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {activeTabData?.label} Champions
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                {activeTabData?.description}
              </p>
            </div>

            <div
              className="
                inline-flex w-fit items-center rounded-full
                bg-gray-100 px-3 py-1.5 text-xs font-medium
                text-gray-600 dark:bg-slate-800 dark:text-slate-300
              "
            >
              {filteredChampions.length} Records
            </div>
          </div>

          {/* =================================
              Tabs
          ================================= */}

          <div className="mb-6 flex gap-2 overflow-x-auto border-b border-gray-200 pb-3 dark:border-slate-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearch("");
                  }}
                  className={`
                    flex shrink-0 items-center gap-2 rounded-xl
                    px-4 py-2.5 text-sm font-medium transition
                    ${
                      activeTab === tab.id
                        ? "bg-[#2F6F5C] text-white"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    }
                  `}
                >
                  <Icon size={14} />

                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* =================================
              Search
          ================================= */}

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <FaSearch
                size={14}
                className="
                  pointer-events-none absolute left-3 top-1/2
                  -translate-y-1/2 text-gray-400
                  dark:text-slate-500
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search champion..."
                className="
                  h-11 w-full rounded-xl border
                  border-gray-200 bg-gray-50 pl-10 pr-4
                  text-sm text-gray-900 outline-none transition
                  placeholder:text-gray-400
                  focus:border-[#2F6F5C] focus:ring-2
                  focus:ring-[#2F6F5C]/10
                  dark:border-slate-700 dark:bg-slate-800
                  dark:text-white dark:placeholder:text-slate-500
                "
              />
            </div>

            <div className="text-xs text-gray-400 dark:text-slate-500">
              {filteredChampions.length} of {activeChampions.length} records
            </div>
          </div>

          {/* =================================
              Loading / Empty / List
          ================================= */}

          {isLoading ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-3">
              <FaSyncAlt
                size={26}
                className="animate-spin text-[#2F6F5C]"
              />

              <p className="text-sm text-gray-500 dark:text-slate-400">
                Loading champions...
              </p>
            </div>
          ) : filteredChampions.length === 0 ? (
            <EmptyState label={activeTabData?.label || "Champion"} />
          ) : (
            <div className="space-y-3">

              {/* Column Header */}

              <div
                className="
                  hidden items-center gap-4 px-4 pb-2 text-xs
                  font-semibold uppercase tracking-wider
                  text-gray-400 dark:text-slate-500
                  sm:flex
                "
              >
                <div className="w-10">Rank</div>

                <div className="flex-1">Champion</div>

                <div className="w-52">Period</div>

                <div className="w-24">Status</div>

                <div className="w-9" />
              </div>

              {filteredChampions.map((champion, index) => (
                <ChampionRow
                  key={champion._id}
                  champion={champion}
                  index={index}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </div>

        {/* =================================
            Footer
        ================================= */}

        <div className="mt-5 flex flex-col justify-between gap-2 text-sm text-gray-500 dark:text-slate-400 sm:flex-row">
          <p>
            Total records:{" "}
            <span className="font-semibold text-gray-700 dark:text-slate-200">
              {totalChampions}
            </span>
          </p>

          <p>DEVAN · Champions Management</p>
        </div>
      </div>

      {/* =================================
          Champion Details Modal
      ================================= */}

      {selectedChampion && (
        <div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/50 p-4 backdrop-blur-sm
          "
          onClick={closeModal}
        >
          <div
            className="
              w-full max-w-lg rounded-2xl border border-gray-200
              bg-white p-6 shadow-2xl
              dark:border-slate-700 dark:bg-slate-900
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Champion Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  {selectedChampion.userId?.fullname || "Unknown"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="
                  flex h-9 w-9 items-center justify-center rounded-lg
                  text-gray-400 hover:bg-gray-100 hover:text-gray-700
                  dark:hover:bg-slate-800 dark:hover:text-white
                "
              >
                <FaTimesCircle size={19} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getImageUrl(selectedChampion.userId?.image) ? (
                  <img
                    src={getImageUrl(selectedChampion.userId?.image)}
                    alt={selectedChampion.userId?.fullname || "Champion"}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="
                      flex h-16 w-16 items-center justify-center
                      rounded-full bg-emerald-100 text-lg font-bold
                      text-emerald-700 dark:bg-emerald-900/40
                      dark:text-emerald-300
                    "
                  >
                    {getInitials(selectedChampion.userId?.fullname)}
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {selectedChampion.userId?.fullname || "Unknown"}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {selectedChampion.userId?.email || "No email"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 dark:bg-slate-800">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    Type
                  </span>

                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedChampion.type}
                  </span>
                </div>

                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    Period Start
                  </span>

                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(selectedChampion.periodStart)}
                  </span>
                </div>

                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    Period End
                  </span>

                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(selectedChampion.periodEnd)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    Status
                  </span>

                  <span
                    className={
                      selectedChampion.isActive
                        ? "text-sm font-semibold text-emerald-600 dark:text-emerald-400"
                        : "text-sm font-semibold text-red-600 dark:text-red-400"
                    }
                  >
                    {selectedChampion.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">
                  Description
                </p>

                <p className="text-sm text-gray-600 dark:text-slate-300">
                  {selectedChampion.description || "No description available."}
                </p>
              </div>
{selectedChampion.type=="hall_of_fame" ? "" :
              <button
                type="button"
                onClick={()=>handelHallofFame(selectedChampion.userId._id)}
                className="
                  w-full rounded-xl bg-[#2F6F5C] px-4 py-3
                  text-sm font-semibold text-white transition
                  hover:bg-[#245947]
                "
              >
                Make Hall Of Fame
              </button>

}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Champions;
