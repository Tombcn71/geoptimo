"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  Search, 
  FileSearch, 
  Rocket, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Sparkles,
  Users,
  Link as LinkIcon,
  Edit,
  LogOut,
  User
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Prompt Explorer", href: "/dashboard/prompts", icon: Sparkles },
  { name: "Competitors", href: "/dashboard/competitors", icon: Users },
  { name: "Citations", href: "/dashboard/citations", icon: LinkIcon },
  { name: "Content Studio", href: "/dashboard/content", icon: Edit },
  { name: "Audit", href: "/dashboard/audit", icon: FileSearch },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 dark:bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-black dark:text-white" />
            <span className="text-xl font-bold text-black dark:text-white">
              Geoptimo
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-2">
            <Link
              href="/dashboard/profile"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === "/dashboard/profile"
                  ? "bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
              }`}
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 transition-colors">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex-1" />
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <input
                  type="search"
                  placeholder="Search..."
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>
              <ThemeToggle />
              <Link
                href="/dashboard/profile"
                className="h-10 w-10 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-semibold hover:opacity-80 transition-opacity"
                title="Profile"
              >
                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}

