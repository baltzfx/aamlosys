"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Users,
  LogOut,
  Menu,
  ChevronDown,
  ChevronRight,
  GroupIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  onLogout: () => void;
};

export default function Sidebar({ onLogout }: SidebarProps) {
  const [open, setOpen] = useState(true);
  const [employeeOpen, setEmployeeOpen] = useState(true);

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 h-14 border-b dark:border-gray-700">
        {open && <div className="text-xl font-normal dark:text-white">Admin</div>}
        <Menu
          className="cursor-pointer text-gray-700 dark:text-gray-300"
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4">
        {/* Dashboard */}
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className={`justify-start gap-3 w-full ${
              !open && "justify-center"
            }`}
          >
            <Home size={18} />
            {open && "Dashboard"}
          </Button>
        </Link>

        {/* User Management */}
        <Link href="/users">
          <Button
            variant="ghost"
            className={`justify-start gap-3 w-full ${
              !open && "justify-center"
            }`}
          >
            <Users size={18} />
            {open && "User Management"}
          </Button>
        </Link>

        {/* Employee Management (Parent) */}
        <Button
          variant="ghost"
          onClick={() => setEmployeeOpen(!employeeOpen)}
          className={`justify-start gap-3 w-full ${
            !open && "justify-center"
          }`}
        >
          <Users size={18} />
          {open && "Employee Management"}
          {open && (
            <span className="ml-auto">
              {employeeOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </span>
          )}
        </Button>

        {/* Employee Sub-menu */}
        {employeeOpen && open && (
          <div className="ml-8 flex flex-col gap-1">
            <Link href="/employees">
              <Button
                variant="ghost"
                className="justify-start gap-3 w-full text-sm"
              >
                <Users size={14} />
                Employees
              </Button>
            </Link>

            <Link href="/branches">
              <Button
                variant="ghost"
                className="justify-start gap-3 w-full text-sm"
              >
                <GroupIcon size={14} />
                Branches
              </Button>
            </Link>

            <Link href="/department">
              <Button
                variant="ghost"
                className="justify-start gap-3 w-full text-sm"
              >
                <Users size={14} />
                Departments
              </Button>
            </Link>
          </div>
        )}

        {/* Inventory */}
        <Link href="/inventory">
          <Button
            variant="ghost"
            className={`justify-start gap-3 w-full ${
              !open && "justify-center"
            }`}
          >
            <Users size={18} />
            {open && "Inventory Management"}
          </Button>
        </Link>

        {/* Logout */}
        <Button
          variant="destructive"
          className={`justify-start gap-3 mt-6 w-full ${
            !open && "justify-center"
          }`}
          onClick={onLogout}
        >
          <LogOut size={18} />
          {open && "Logout"}
        </Button>
      </nav>
    </aside>
  );
}
