"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  FileText, 
  Calendar, 
  LogOut,
  LayoutDashboard 
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear all possible storage locations
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });

      // Force reload to clear any React state
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="fixed left-0 h-screen w-64 bg-gray-900 text-white p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      
      <nav className="space-y-2">
        <Link 
          href="/admin/dashboard"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link 
          href="/admin/inquiries"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800"
        >
          <Users className="h-5 w-5" />
          <span>Client Inquiries</span>
        </Link>

        <Link 
          href="/admin/events"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800"
        >
          <Calendar className="h-5 w-5" />
          <span>Events Management</span>
        </Link>

        <Link 
          href="/admin/articles"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800"
        >
          <FileText className="h-5 w-5" />
          <span>Articles Management</span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-600 w-full text-left mt-8"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}