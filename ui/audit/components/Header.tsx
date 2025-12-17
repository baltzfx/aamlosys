"use client";

import { User, ChevronDown } from "lucide-react";

type HeaderProps = {
  username: string;
};

export default function Header({ username }: HeaderProps) {
  return (
    <header className="flex items-center justify-end px-6 h-14 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3 cursor-pointer">
        <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span className="text-gray-700 dark:text-gray-200">
          {username || "User"}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300" />
      </div>
    </header>
  );
}
