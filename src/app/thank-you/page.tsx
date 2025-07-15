"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You for Reaching Out!
        </h1>
        
        <p className="text-gray-600 mb-8">
          We've received your inquiry and will get back to you within 24-48 hours. 
          A confirmation email has been sent to your inbox.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold text-gray-700 mb-2">What's Next?</h2>
            <ul className="text-left text-sm text-gray-600 space-y-2">
              <li>• Our team will review your requirements</li>
              <li>• We'll prepare a customized solution</li>
              <li>• You'll receive a detailed response via email</li>
            </ul>
          </div>

          <div className="border-t pt-6">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Return to Homepage
            </button>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Have questions? Contact our support team at support@example.com
        </p>
      </div>
    </div>
  );
}