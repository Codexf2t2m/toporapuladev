"use client";

import { useState, useEffect } from "react";
import { Client, Databases, Query } from "appwrite";
import { useRouter } from "next/navigation";
import { 
  Users, 
  FileText, 
  Calendar, 
  ArrowUp, 
  ArrowDown,
  Activity
} from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";

// Initialize Appwrite
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    totalEvents: 0,
    totalArticles: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const inquiriesResponse = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || '',
        [Query.orderDesc('$createdAt')]
      );

      setMetrics({
        totalInquiries: inquiriesResponse.total,
        newInquiries: inquiriesResponse.documents.filter(doc => doc.status === 'new').length,
        totalEvents: 0, // You'll need to implement these
        totalArticles: 0 // You'll need to implement these
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, Admin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Metrics Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="flex items-center text-green-500">
                <ArrowUp className="h-4 w-4" />
                12%
              </span>
            </div>
            <h3 className="text-gray-500 text-sm">Total Inquiries</h3>
            <p className="text-2xl font-bold">{metrics.totalInquiries}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <span className="flex items-center text-green-500">
                <ArrowUp className="h-4 w-4" />
                8%
              </span>
            </div>
            <h3 className="text-gray-500 text-sm">New Inquiries</h3>
            <p className="text-2xl font-bold">{metrics.newInquiries}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <span className="flex items-center text-red-500">
                <ArrowDown className="h-4 w-4" />
                3%
              </span>
            </div>
            <h3 className="text-gray-500 text-sm">Total Events</h3>
            <p className="text-2xl font-bold">{metrics.totalEvents}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="flex items-center text-green-500">
                <ArrowUp className="h-4 w-4" />
                24%
              </span>
            </div>
            <h3 className="text-gray-500 text-sm">Total Articles</h3>
            <p className="text-2xl font-bold">{metrics.totalArticles}</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Inquiries</h2>
            {/* Add your recent inquiries list here */}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>
            {/* Add your activity timeline here */}
          </div>
        </div>
      </main>
    </div>
  );
}

export function InquiriesPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        {/* Your existing inquiries table */}
      </main>
    </div>
  );
}

export function EventsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold mb-8">Events Management</h1>
        {/* Add your events management UI here */}
      </main>
    </div>
  );
}

export function ArticlesPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold mb-8">Articles Management</h1>
        {/* Add your articles management UI here */}
      </main>
    </div>
  );
}