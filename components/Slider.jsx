"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  FiActivity,
  FiAward,
  FiBarChart2,
  FiBookOpen,
  FiBriefcase,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiGlobe,
  FiHome,
  FiMenu,
  FiMoon,
  FiShield,
  FiSun,
  FiUpload,
  FiUserCheck,
  FiUsers,
  FiX,
} from "react-icons/fi";

const menuItems = [
  {
    title: "Dashboard",
    icon: FiHome,
    href: "/",
  },
  {
    title: "Manage Users",
    icon: FiUsers,
    href: "/users",
  },
  {
    title: "Manage Expert Panel",
    icon: FiShield,
    href: "/experts",
  },
  {
    title: "Weekly Challenges",
    icon: FiActivity,
    href: "/challenges",
  },
  {
    title: "Select Champions",
    icon: FiUserCheck,
    href: "/champions",
  },
  {
    title: "Champion Certificates",
    icon: FiUpload,
    href: "/certificates",
  },
  {
    title: "Learning Center",
    icon: FiBookOpen,
    href: "/learning-center",
  },
  {
    title: "Manage News",
    icon: FiFileText,
    href: "/news",
  },
  {
    title: "Manage Jobs",
    icon: FiBriefcase,
    href: "/jobs",
  },
  {
    title: "Manage Events",
    icon: FiCalendar,
    href: "/events",
  },
  {
    title: "Hall of Fame",
    icon: FiAward,
    href: "/hall-of-fame",
  },
  {
    title: "Website Content",
    icon: FiGlobe,
    href: "/content",
  },
  {
    title: "Reports & Analytics",
    icon: FiBarChart2,
    href: "/reports",
  },
];

const Slider = () => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedState = localStorage.getItem("admin-sidebar-collapsed");

    if (savedState !== null) {
      setCollapsed(savedState === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setCollapsed((previous) => {
      const newState = !previous;

      localStorage.setItem(
        "admin-sidebar-collapsed",
        String(newState)
      );

      return newState;
    });
  };

  const isActiveRoute = (href) => {
    if (href === "/") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
            <FiFileText size={20} />
          </div>

          <div>
            <h2 className="font-bold text-black dark:text-white">
              Admin Panel
            </h2>

            <p className="text-xs text-slate-500">
              Management system
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-black dark:border-slate-700 dark:text-white"
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
       className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white text-black shadow-xl shadow-slate-200/40 transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:shadow-black/20 lg:sticky lg:z-auto ${
    collapsed ? "lg:w-20" : "lg:w-72"
  } ${
    mobileOpen
      ? "translate-x-0"
      : "-translate-x-full lg:translate-x-0"
  }`}
      >
        
        <div
          className={`flex h-20 shrink-0 items-center border-b border-slate-200 dark:border-slate-800 ${
            collapsed ? "justify-center px-3" : "justify-between px-5"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
              <FiFileText size={21} />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold">
                  Admin Panel
                </h2>

                <p className="truncate text-xs text-slate-500">
                  Management system
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-5">
          
         
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(item.href);

            return (
              <div key={item.href} className=" group relative">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex h-12 items-center rounded-xl transition-all duration-200 ${
                    collapsed
                      ? "justify-center px-3"
                      : "gap-3 px-4"
                  } ${
                    active
                      ? "bg-black text-white shadow-md dark:bg-white dark:text-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-black dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="shrink-0 text-xl" />

                  {!collapsed && (
                    <span className="truncate text-sm font-medium">
                      {item.title}
                    </span>
                  )}
                </Link>

                {/* Tooltip when sidebar is collapsed */}
                {collapsed && (
                  <div className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-black px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl transition group-hover:block group-hover:opacity-100 dark:bg-white dark:text-black">
                    {item.title}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer controls */}
        <div className="shrink-0 space-y-2 border-t border-slate-200 p-3 dark:border-slate-800">
          {mounted && (
            <button
              type="button"
              onClick={() =>
                setTheme(
                  resolvedTheme === "dark" ? "light" : "dark"
                )
              }
              className={`flex h-12 w-full items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-black dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white ${
                collapsed ? "justify-center" : "gap-3 px-4"
              }`}
            >
              {resolvedTheme === "dark" ? (
                <FiSun className="shrink-0 text-xl" />
              ) : (
                <FiMoon className="shrink-0 text-xl" />
              )}

              {!collapsed && (
                <span className="text-sm font-medium">
                  {resolvedTheme === "dark"
                    ? "Light Mode"
                    : "Dark Mode"}
                </span>
              )}
            </button>
          )}

          {/* Desktop shrink button */}
          <button
            type="button"
            onClick={toggleSidebar}
            className={`hidden h-12 w-full items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-black lg:flex dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white ${
              collapsed ? "justify-center" : "gap-3 px-4"
            }`}
          >
            {collapsed ? (
              <FiChevronRight className="shrink-0 text-xl" />
            ) : (
              <FiChevronLeft className="shrink-0 text-xl" />
            )}

            {!collapsed && (
              <span className="text-sm font-medium">
                Collapse Sidebar
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Slider;