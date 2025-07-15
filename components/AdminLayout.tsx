"use client";

import {
    Sidebar,
    SidebarItem,
    SidebarItemGroup,
    SidebarItems,
    DarkThemeToggle,
    SidebarLogo,
} from "flowbite-react";
import {
    HiArrowSmRight,
    HiChartPie,
    HiUser,
    HiMenu,
} from "react-icons/hi";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Sidebar */}
            <div
                className={`fixed z-40 top-0 left-0 h-full w-64 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
            >
                <Sidebar aria-label="Admin Sidebar" className="h-full">
                    <SidebarLogo href="https://flowbite-react.com/favicon.svg" img="https://flowbite-react.com/favicon.svg" imgAlt="Flowbite logo">
                        Internal Textil Grup
                    </SidebarLogo>
                    <SidebarItems>
                        <SidebarItemGroup>
                            <SidebarItem as={Link} href="/" icon={HiChartPie} active={pathname === "/"}>
                                Dashboard
                            </SidebarItem>
                            <SidebarItem as={Link} href="/employee" icon={HiUser} active={pathname === "/employee"}>
                                Karyawan
                            </SidebarItem>
                            <SidebarItem as={Link} href="/logout" icon={HiArrowSmRight} active={pathname === "/logout"}>
                                Logout
                            </SidebarItem>
                        </SidebarItemGroup>
                    </SidebarItems>
                </Sidebar>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                    <button
                        onClick={() => setSidebarOpen((prev) => !prev)}
                        className="text-gray-500 dark:text-gray-300 lg:hidden"
                    >
                        <HiMenu className="w-6 h-6" />
                    </button>
                    <DarkThemeToggle />
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
