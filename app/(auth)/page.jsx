"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import {
  Line,
  Bar,
  Doughnut,
} from "react-chartjs-2";

import {
  FaUsers,
  FaUserTie,
  FaBookOpen,
  FaBriefcase,
  FaCalendarAlt,
  FaTrophy,
  FaQuestionCircle,
  FaFileAlt,
  FaGraduationCap,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaArrowUp,
  FaAward,
  FaChartLine,
} from "react-icons/fa";

import { MdOutlineArticle } from "react-icons/md";

import { base_url, img_url } from "@/components/utils";

axios.defaults.withCredentials = true;




ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);


/* =========================================================
   PAGE
========================================================= */

const Page = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);



  /* =======================================================
     FETCH DASHBOARD
  ======================================================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${base_url}/auth/dashboard`
      );

      if (response?.data?.success) {
        setDashboard(response.data);
      } else {
        toast.error("Unable to load dashboard");
      }

    } catch (error) {
      console.error("Dashboard error:", error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);




  const totalArticleViews = useMemo(() => {
    return (dashboard?.recent?.articles || []).reduce(
      (total, article) =>
        total + (article.views || 0),
      0
    );
  }, [dashboard?.recent?.articles]);


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="h-screen overflow-auto bg-[#F7F8FA] p-4 dark:bg-slate-950 sm:p-6 lg:p-8">

        <div className="mx-auto max-w-[1600px]">

          {/* Header */}
          <div className="mb-8">
            <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-200 dark:bg-slate-800" />
            <div className="mt-3 h-4 w-80 animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
          </div>


          {/* Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl bg-white dark:bg-slate-900"
              />
            ))}
          </div>


          {/* Charts */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

            <div className="h-[400px] animate-pulse rounded-2xl bg-white dark:bg-slate-900 xl:col-span-2" />

            <div className="h-[400px] animate-pulse rounded-2xl bg-white dark:bg-slate-900" />

          </div>

        </div>
      </div>
    );
  }


  if (!dashboard) {
    return null;
  }


  const {
    overview = {},
    charts = {},
    recent = {},
  } = dashboard;

  /* =======================================================
     OVERVIEW
  ======================================================= */

  const overviewCards = [
    {
      title: "Total Users",
      value: overview?.users?.total || 0,
      sub: `${overview?.users?.active || 0} active`,
      icon: <FaUsers />,
      iconBg: "bg-blue-100 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },

    {
      title: "Experts",
      value: overview?.experts?.total || 0,
      sub: `${overview?.experts?.active || 0} active`,
      icon: <FaUserTie />,
      iconBg: "bg-purple-100 dark:bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },

    {
      title: "Articles",
      value: overview?.articles?.total || 0,
      sub: `${overview?.articles?.published || 0} published`,
      icon: <FaBookOpen />,
      iconBg: "bg-emerald-100 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },

    {
      title: "Jobs",
      value: overview?.jobs?.total || 0,
      sub: `${overview?.jobs?.published || 0} published`,
      icon: <FaBriefcase />,
      iconBg: "bg-orange-100 dark:bg-orange-500/10",
      iconColor: "text-orange-600 dark:text-orange-400",
    },

    {
      title: "Applications",
      value: overview?.applications?.total || 0,
      sub: "Total applications",
      icon: <FaFileAlt />,
      iconBg: "bg-pink-100 dark:bg-pink-500/10",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
  ];


  /* =======================================================
     MONTHLY CONTENT LINE CHART
  ======================================================= */

  const monthlyContent = charts?.monthlyContent || [];

  const monthlyContentData = {
    labels: monthlyContent.map(
      (item) => item.month
    ),

    datasets: [
      {
        label: "Users",
        data: monthlyContent.map(
          (item) => item.users
        ),
        borderWidth: 2,
        tension: 0.4,
        fill: false,
      },

      {
        label: "Articles",
        data: monthlyContent.map(
          (item) => item.articles
        ),
        borderWidth: 2,
        tension: 0.4,
        fill: false,
      },

      {
        label: "Jobs",
        data: monthlyContent.map(
          (item) => item.jobs
        ),
        borderWidth: 2,
        tension: 0.4,
        fill: false,
      },

      {
        label: "Events",
        data: monthlyContent.map(
          (item) => item.events
        ),
        borderWidth: 2,
        tension: 0.4,
        fill: false,
      },
    ],
  };


  /* =======================================================
     MONTHLY CONTENT OPTIONS
  ======================================================= */

  const lineOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },

      tooltip: {
        mode: "index",
        intersect: false,
      },
    },

    interaction: {
      mode: "index",
      intersect: false,
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#94a3b8",
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
          color: "#94a3b8",
        },

        grid: {
          color: "rgba(148,163,184,0.12)",
        },
      },
    },
  };


  /* =======================================================
     ARTICLE STATUS
  ======================================================= */

  const articleStatus = charts?.articleStatus || [];

  const articleStatusData = {
    labels: articleStatus.map(
      (item) => item.name
    ),

    datasets: [
      {
        data: articleStatus.map(
          (item) => item.value
        ),

        borderWidth: 0,

        spacing: 4,
      },
    ],
  };


  /* =======================================================
     JOB STATUS
  ======================================================= */

  const jobStatus = charts?.jobStatus || [];

  const jobStatusData = {
    labels: jobStatus.map(
      (item) => item.name
    ),

    datasets: [
      {
        data: jobStatus.map(
          (item) => item.value
        ),

        borderWidth: 0,

        spacing: 4,
      },
    ],
  };


  /* =======================================================
     CONTENT DISTRIBUTION
  ======================================================= */

  const contentDistribution =
    charts?.contentDistribution || [];

  const contentDistributionData = {
    labels: contentDistribution.map(
      (item) => item.name
    ),

    datasets: [
      {
        data: contentDistribution.map(
          (item) => item.value
        ),

        borderWidth: 0,

        spacing: 4,
      },
    ],
  };


  /* =======================================================
     STATUS OPTIONS
  ======================================================= */

  const doughnutOptions = {
    responsive: true,

    maintainAspectRatio: false,

    cutout: "68%",

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          usePointStyle: true,
          padding: 18,
        },
      },
    },
  };


  /* =======================================================
     JOB + APPLICATION BAR
  ======================================================= */

  const jobs = charts?.jobs || [];
  const applications = charts?.applications || [];

  const jobApplicationData = {
    labels: jobs.map(
      (item) => item.month
    ),

    datasets: [
      {
        label: "Jobs",

        data: jobs.map(
          (item) => item.value
        ),

        borderRadius: 6,
      },

      {
        label: "Applications",

        data: applications.map(
          (item) => item.value
        ),

        borderRadius: 6,
      },
    ],
  };


  const barOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#94a3b8",
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
          color: "#94a3b8",
        },

        grid: {
          color: "rgba(148,163,184,0.12)",
        },
      },
    },
  };


  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  /* =======================================================
     IMAGE URL
  ======================================================= */

  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http")) {
      return image;
    }

    return `${img_url}${image}`;
  };


  /* =======================================================
     CARD COMPONENT
  ======================================================= */

  const StatCard = ({
    title,
    value,
    sub,
    icon,
    iconBg,
    iconColor,
  }) => {
    return (
      <div
        className="
          group
          rounded-2xl
          border border-gray-200
          bg-white
          p-5
          shadow-sm
          transition
          duration-300
          hover:-translate-y-1
          hover:shadow-lg

          dark:border-slate-800
          dark:bg-slate-900
          dark:shadow-none
        "
      >

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
              {title}
            </p>

            <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </h3>

            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-slate-500">
              <FaArrowUp className="text-emerald-500" />

              <span>
                {sub}
              </span>
            </div>

          </div>


          <div
            className={`
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              text-xl
              ${iconBg}
              ${iconColor}
            `}
          >
            {icon}
          </div>

        </div>

      </div>
    );
  };


  /* =======================================================
     SECTION CARD
  ======================================================= */

  const ChartCard = ({
    title,
    subtitle,
    children,
    className = "",
  }) => {
    return (
      <div
        className={`
          rounded-2xl
          border border-gray-200
          bg-white
          p-5
          shadow-sm

          dark:border-slate-800
          dark:bg-slate-900
          dark:shadow-none

          ${className}
        `}
      >

        <div className="mb-5">

          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}

        </div>

        {children}

      </div>
    );
  };


  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div
      className="
        h-screen overflow-auto
        bg-[#F7F8FA]
        text-gray-900
        transition-colors

        dark:bg-slate-950
        dark:text-white
      "
    >

      <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#2F6F5C]
                  text-xl
                  text-white
                "
              >
                <FaChartLine />
              </div>

              <div>

                <h1 className="text-2xl font-bold sm:text-3xl">
                  Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  Overview of your Sterilization Champions platform
                </p>

              </div>

            </div>

          </div>


          <div
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-2.5
              text-sm
              text-gray-600
              shadow-sm

              dark:border-slate-800
              dark:bg-slate-900
              dark:text-slate-300
            "
          >
            <FaCalendarAlt className="text-[#2F6F5C]" />

            {new Date().toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }
            )}

          </div>

        </div>


        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

          {overviewCards.map((card) => (
            <StatCard
              key={card.title}
              {...card}
            />
          ))}

        </div>


        {/* =================================================
            SECONDARY STATS
        ================================================= */}

        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">

          <MiniStat
            icon={<MdOutlineArticle />}
            label="Published Articles"
            value={overview?.articles?.published}
          />

          <MiniStat
            icon={<FaGraduationCap />}
            label="Education"
            value={overview?.education?.total}
          />

          <MiniStat
            icon={<FaCalendarAlt />}
            label="Events"
            value={overview?.events?.total}
          />

          <MiniStat
            icon={<FaQuestionCircle />}
            label="Challenges"
            value={overview?.challenges?.total}
          />

          <MiniStat
            icon={<FaCheckCircle />}
            label="Active Challenges"
            value={overview?.challenges?.active}
          />

          <MiniStat
            icon={<FaClock />}
            label="Draft Jobs"
            value={overview?.jobs?.draft}
          />

          <MiniStat
            icon={<FaTrophy />}
            label="Champions"
            value={overview?.champions?.total}
          />

          <MiniStat
            icon={<FaAward />}
            label="Hall of Fame"
            value={overview?.champions?.hallOfFame}
          />

        </div>


        {/* =================================================
            MAIN CHART
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

          <ChartCard
            title="Platform Activity"
            subtitle="Monthly users and content activity"
            className="xl:col-span-2"
          >

            <div className="h-[350px]">
              <Line
                data={monthlyContentData}
                options={lineOptions}
              />
            </div>

          </ChartCard>


          <ChartCard
            title="Content Distribution"
            subtitle="Total platform content"
          >

            <div className="h-[350px]">
              <Doughnut
                data={contentDistributionData}
                options={doughnutOptions}
              />
            </div>

          </ChartCard>

        </div>


        {/* =================================================
            STATUS CHARTS
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">


          <ChartCard
            title="Article Status"
            subtitle="Published, draft and rejected articles"
          >

            <div className="h-[300px]">
              <Doughnut
                data={articleStatusData}
                options={doughnutOptions}
              />
            </div>

          </ChartCard>


          <ChartCard
            title="Job Status"
            subtitle="Current job posting status"
          >

            <div className="h-[300px]">
              <Doughnut
                data={jobStatusData}
                options={doughnutOptions}
              />
            </div>

          </ChartCard>


          <ChartCard
            title="Jobs & Applications"
            subtitle="Monthly job and application activity"
          >

            <div className="h-[300px]">
              <Bar
                data={jobApplicationData}
                options={barOptions}
              />
            </div>

          </ChartCard>

        </div>


        {/* =================================================
            CHALLENGE ACTIVITY
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

          <ChartCard
            title="Challenge Activity"
            subtitle="Challenges and submitted answers"
          >

            <div className="h-[300px]">

              <Bar
                data={{
                  labels: (
                    charts?.challenges || []
                  ).map(
                    (item) => item.month
                  ),

                  datasets: [
                    {
                      label: "Challenges",

                      data: (
                        charts?.challenges || []
                      ).map(
                        (item) => item.value
                      ),

                      borderRadius: 6,
                    },

                    {
                      label: "Answers",

                      data: (
                        charts?.answers || []
                      ).map(
                        (item) => item.value
                      ),

                      borderRadius: 6,
                    },
                  ],
                }}

                options={barOptions}
              />

            </div>

          </ChartCard>


          <ChartCard
            title="Monthly Users"
            subtitle="New user registrations"
          >

            <div className="h-[300px]">

              <Line

                data={{
                  labels: (
                    charts?.users || []
                  ).map(
                    (item) => item.month
                  ),

                  datasets: [
                    {
                      label: "New Users",

                      data: (
                        charts?.users || []
                      ).map(
                        (item) => item.value
                      ),

                      fill: true,

                      tension: 0.4,

                      borderWidth: 2,
                    },
                  ],
                }}

                options={lineOptions}
              />

            </div>

          </ChartCard>

        </div>


        {/* =================================================
            RECENT SECTION
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">


          {/* =================================================
              RECENT CHAMPIONS
          ================================================= */}

          <ChartCard
            title="Recent Champions"
            subtitle="Latest recognition records"
          >

            <div className="space-y-4">

              {(recent?.champions || []).map(
                (champion) => {

                  const image =
                    getImageUrl(
                      champion?.userId?.image
                    );

                  return (
                    <div
                      key={champion._id}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-gray-100
                        p-3

                        dark:border-slate-800
                      "
                    >

                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-full
                          bg-[#2F6F5C]
                          font-bold
                          text-white
                        "
                      >

                        {image ? (
                          <img
                            src={image}
                            alt={
                              champion?.userId?.fullname ||
                              "Champion"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          champion?.userId?.fullname
                            ?.charAt(0)
                            ?.toUpperCase()
                        )}

                      </div>


                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {
                            champion?.userId
                              ?.fullname ||
                            "Unknown User"
                          }
                        </p>

                        <p className="mt-1 text-xs capitalize text-gray-500 dark:text-slate-400">
                          {champion?.type?.replace(
                            "_",
                            " "
                          )}
                        </p>

                      </div>


                      <FaTrophy className="shrink-0 text-[#B08D57]" />

                    </div>
                  );
                }
              )}

            </div>

          </ChartCard>


          {/* =================================================
              RECENT ARTICLES
          ================================================= */}

          <ChartCard
            title="Recent Articles"
            subtitle={`${totalArticleViews} views from recent articles`}
          >

            <div className="space-y-4">

              {(recent?.articles || []).map(
                (article) => (

                  <div
                    key={article._id}
                    className="
                      flex
                      gap-3
                      rounded-xl
                      border
                      border-gray-100
                      p-3

                      dark:border-slate-800
                    "
                  >

                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-800">

                      {article?.thumbnail ? (
                        <img
                          src={getImageUrl(
                            article.thumbnail
                          )}
                          alt={article.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <FaBookOpen />
                        </div>
                      )}

                    </div>


                    <div className="min-w-0 flex-1">

                      <h4 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                        {article.title}
                      </h4>

                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400">

                        <span>
                          {article.category}
                        </span>

                        <span className="flex items-center gap-1">
                          <FaEye />
                          {article.views || 0}
                        </span>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </ChartCard>


          {/* =================================================
              RECENT JOBS
          ================================================= */}

          <ChartCard
            title="Recent Jobs"
            subtitle="Latest job postings"
          >

            <div className="space-y-4">

              {(recent?.jobs || []).map(
                (job) => (

                  <div
                    key={job._id}
                    className="
                      rounded-xl
                      border
                      border-gray-100
                      p-4

                      dark:border-slate-800
                    "
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <h4 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                          {job.title}
                        </h4>

                        <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                          {job.category}
                        </p>

                      </div>


                      <span
                        className="
                          shrink-0
                          rounded-full
                          bg-emerald-100
                          px-2.5
                          py-1
                          text-[10px]
                          font-bold
                          text-emerald-700

                          dark:bg-emerald-500/10
                          dark:text-emerald-400
                        "
                      >
                        {job.status}
                      </span>

                    </div>


                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">

                      <span className="flex items-center gap-1">
                        <FaBriefcase />
                        {job?.location?.city ||
                          "India"}
                      </span>

                      <span className="flex items-center gap-1">
                        <FaUsers />
                        {job.applicationsCount || 0}
                        {" "}applications
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          </ChartCard>


        </div>


        {/* =================================================
            FOOTER SUMMARY
        ================================================= */}

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-5
            dark:border-slate-800
            dark:bg-slate-900
          "
        >

          <div className="flex flex-wrap items-center justify-between gap-5">

            <div>

              <h3 className="font-semibold text-gray-900 dark:text-white">
                Platform Summary
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Current content and community overview
              </p>

            </div>


            <div className="flex flex-wrap gap-3">

              <SummaryBadge
                icon={<FaBookOpen />}
                text={`${overview?.articles?.published || 0} Published Articles`}
              />

              <SummaryBadge
                icon={<FaBriefcase />}
                text={`${overview?.jobs?.published || 0} Published Jobs`}
              />

              <SummaryBadge
                icon={<FaCalendarAlt />}
                text={`${overview?.events?.published || 0} Published Events`}
              />

              <SummaryBadge
                icon={<FaTrophy />}
                text={`${overview?.champions?.hallOfFame || 0} Hall of Fame`}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


/* =========================================================
   MINI STAT
========================================================= */

const MiniStat = ({
  icon,
  label,
  value,
}) => {

  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-gray-200
        bg-white
        p-3

        dark:border-slate-800
        dark:bg-slate-900
      "
    >

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2F6F5C]/10 text-[#2F6F5C] dark:bg-[#2F6F5C]/20">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="truncate text-[11px] text-gray-500 dark:text-slate-500">
          {label}
        </p>

        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {value || 0}
        </p>

      </div>

    </div>
  );
};


/* =========================================================
   SUMMARY BADGE
========================================================= */

const SummaryBadge = ({
  icon,
  text,
}) => {

  return (
    <div
      className="
        flex
        items-center
        gap-2
        rounded-lg
        bg-gray-100
        px-3
        py-2
        text-xs
        font-medium
        text-gray-600

        dark:bg-slate-800
        dark:text-slate-300
      "
    >
      <span className="text-[#2F6F5C]">
        {icon}
      </span>

      {text}
    </div>
  );
};


export default Page;