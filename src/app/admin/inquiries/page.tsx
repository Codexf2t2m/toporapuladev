"use client";

import { useState, useEffect } from "react";
import { Client, Databases, Query } from "appwrite";
import { Mail, Clock, Check, AlertCircle, ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/dashboard/Sidebar";
import emailjs from '@emailjs/browser';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);

// Initialize EmailJS with better error handling
const initEmailJS = () => {
  try {
    if (typeof window !== 'undefined') {
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      
      if (!publicKey) {
        console.error('EmailJS initialization failed: Missing public key');
        return false;
      }
      
      console.log('Initializing EmailJS with public key');
      emailjs.init(publicKey);
      return true;
    }
    return false;
  } catch (error) {
    console.error('EmailJS initialization error:', error);
    return false;
  }
};

// Email validation function
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format email address (trim spaces and lowercase)
const formatEmail = (email: string) => {
  return email ? email.trim().toLowerCase() : '';
};

// Call initialization
const emailJSInitialized = initEmailJS();

interface Inquiry {
  $id: string;
  name: string;
  email: string;
  company: string;
  jobDetail: string;
  projectImageUrl?: string;
  status: 'new' | 'in-progress' | 'completed';
  $createdAt: string;
  decline_reason?: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [reply, setReply] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailJSStatus, setEmailJSStatus] = useState({
    initialized: emailJSInitialized,
    serviceId: !!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    acceptTemplateId: !!process.env.NEXT_PUBLIC_EMAILJS_ACCEPT_TEMPLATE_ID,
    rejectTemplateId: !!process.env.NEXT_PUBLIC_EMAILJS_REJECT_TEMPLATE_ID
  });

  useEffect(() => {
    fetchInquiries();
    
    // Log EmailJS configuration status on component mount
    console.log('EmailJS configuration status:', emailJSStatus);
  }, []);

  const fetchInquiries = async () => {
    try {
      console.log('Fetching inquiries...');
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || '',
        [Query.orderDesc('$createdAt')]
      );
      console.log(`Fetched ${response.documents.length} inquiries`);
      setInquiries(response.documents as unknown as Inquiry[]);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Inquiry['status']) => {
    try {
      console.log(`Updating inquiry ${id} status to ${status}`);
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || '',
        id,
        { status }
      );
      console.log('Status updated successfully');
      fetchInquiries();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const validateEmailConfig = () => {
    if (!emailJSStatus.initialized) {
      setEmailError('EmailJS not properly initialized. Check your environment variables.');
      return false;
    }
    
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const acceptTemplateId = process.env.NEXT_PUBLIC_EMAILJS_ACCEPT_TEMPLATE_ID;
    const rejectTemplateId = process.env.NEXT_PUBLIC_EMAILJS_REJECT_TEMPLATE_ID;
    
    if (!serviceId || !acceptTemplateId || !rejectTemplateId) {
      console.error('Missing EmailJS configuration:', {
        serviceId: !!serviceId,
        acceptTemplateId: !!acceptTemplateId,
        rejectTemplateId: !!rejectTemplateId
      });
      setEmailError('Missing EmailJS configuration. Check your environment variables.');
      return false;
    }
    
    return true;
  };

  const sendReply = async () => {
    if (!selectedInquiry || !reply.trim()) return;
    
    // Validate email configuration
    if (!validateEmailConfig()) return;
    
    // Validate recipient email
    const recipientEmail = formatEmail(selectedInquiry.email);
    if (!isValidEmail(recipientEmail)) {
      setEmailError(`Invalid recipient email address: ${selectedInquiry.email}`);
      return;
    }
    
    setEmailSending(true);
    setEmailError(null);
    setEmailSuccess(false);
    
    try {
      console.log('Preparing to send reply email to:', recipientEmail);
      
      // Dynamically get EmailJS service and template IDs from environment
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_ACCEPT_TEMPLATE_ID || '';
      
      if (!serviceId || !templateId) {
        throw new Error('Missing EmailJS service or template ID');
      }
      
      console.log('Using EmailJS configuration:', {
        serviceId,
        templateId
      });
      
      // Send email using EmailJS with parameters matching your template
      const emailParams = {
        to: recipientEmail,                                      // "To Email" in template
        from_name: 'Your Company Name',                          // "From Name" in template
        from_email: 'your-sending-email@yourdomain.com',         // "From Email" in template
        reply_to: 'your-reply-email@yourdomain.com',             // "Reply To" in template
        message_html: reply,                                     // Content in template
        subject: `Re: Your Inquiry - ${selectedInquiry.company || 'Project'}`,
      };
      
      console.log('Sending email with params:', emailParams);
      
      const response = await emailjs.send(
        serviceId,
        templateId,
        emailParams
      );
      
      console.log('Email sent successfully:', response);
      setEmailSuccess(true);
      
      // Update status to in-progress
      await updateStatus(selectedInquiry.$id, 'in-progress');
      
      // Reset form after short delay to show success message
      setTimeout(() => {
        setReply("");
        setSelectedInquiry(null);
        setEmailSuccess(false);
      }, 2000);
      
    } catch (error: any) {
      console.error('Error sending email:', error);
      // Provide more detailed error message
      const errorMessage = error.text || error.message || 'Failed to send email. Please try again.';
      console.error('Detailed error:', {
        message: errorMessage,
        status: error.status,
        name: error.name
      });
      setEmailError(`Error: ${errorMessage}`);
    } finally {
      setEmailSending(false);
    }
  };

  const handleDecline = async (inquiry: Inquiry) => {
    if (!declineReason.trim()) return;
    
    // Validate email configuration
    if (!validateEmailConfig()) return;
    
    // Validate recipient email
    const recipientEmail = formatEmail(inquiry.email);
    if (!isValidEmail(recipientEmail)) {
      setEmailError(`Invalid recipient email address: ${inquiry.email}`);
      return;
    }

    setEmailSending(true);
    setEmailError(null);
    
    try {
      console.log('Preparing to send decline email to:', recipientEmail);
      
      // Dynamically get EmailJS service and template IDs from environment
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_REJECT_TEMPLATE_ID || '';
      
      if (!serviceId || !templateId) {
        throw new Error('Missing EmailJS service or template ID');
      }
      
      console.log('Using EmailJS configuration:', {
        serviceId,
        templateId
      });
      
      // Send decline email using EmailJS with parameters matching your template
      const emailParams = {
        to: recipientEmail,                                    // "To Email" in template
        from_name: 'Your Company Name',                        // "From Name" in template
        from_email: 'your-sending-email@yourdomain.com',       // "From Email" in template
        reply_to: 'your-reply-email@yourdomain.com',           // "Reply To" in template
        message_html: declineReason,                           // Content in template
        subject: `Regarding Your Inquiry - ${inquiry.company || 'Project'}`,
      };
      
      console.log('Sending decline email with params:', emailParams);
      
      const response = await emailjs.send(
        serviceId,
        templateId,
        emailParams
      );
      
      console.log('Decline email sent successfully:', response);

      // Then delete the document from Appwrite
      console.log(`Deleting inquiry document with ID: ${inquiry.$id}`);
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || '',
        inquiry.$id
      );
      console.log('Inquiry document deleted successfully');

      // Refresh the inquiries list
      await fetchInquiries();
      
      // Reset and close modal
      setDeclineReason("");
      setShowDeclineModal(false);
      setSelectedInquiry(null);
    } catch (error: any) {
      console.error('Error declining inquiry:', error);
      // Provide more detailed error message
      const errorMessage = error.text || error.message || 'Failed to send decline email. Please try again.';
      console.error('Detailed error:', {
        message: errorMessage,
        status: error.status,
        name: error.name
      });
      setEmailError(`Error: ${errorMessage}`);
    } finally {
      setEmailSending(false);
    }
  };

  const getStatusColor = (status: Inquiry['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Debug function to check email template parameters
  const debugEmailParams = () => {
    if (!selectedInquiry) return;
    
    // Example parameters to match your templates
    const testParams = {
      to: formatEmail(selectedInquiry.email),
      from_name: 'Your Company Name',
      from_email: 'your-sending-email@yourdomain.com',
      reply_to: 'your-reply-email@yourdomain.com',
      message_html: 'Test message content',
      subject: 'Test Subject'
    };
    
    console.log('Template parameters example:', testParams);
    console.log('Validate recipient:', isValidEmail(formatEmail(selectedInquiry.email)));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Inquiries</h1>
            <p className="text-gray-500">Manage and respond to client inquiries</p>
          </div>
          {/* Debug buttons - only visible in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="flex space-x-2">
              <button 
                onClick={() => debugEmailParams()}
                className="text-xs bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded"
              >
                Debug Params
              </button>
            </div>
          )}
        </div>

        {!emailJSStatus.initialized && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            <p className="font-semibold">⚠️ EmailJS not properly initialized</p>
            <p className="text-sm">Check your environment variables and browser console for details.</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inquiries.length === 0 ? (
              <div className="col-span-3 flex justify-center items-center h-64 text-gray-500">
                No inquiries found
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div key={inquiry.$id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {inquiry.projectImageUrl && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={inquiry.projectImageUrl}
                        alt="Project preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{inquiry.name}</h3>
                        <p className="text-sm text-gray-500">{inquiry.company}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{inquiry.jobDetail}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {inquiry.email}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(inquiry.$createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                      
                      <select
                        value={inquiry.status}
                        onChange={(e) => updateStatus(inquiry.$id, e.target.value as Inquiry['status'])}
                        className="text-sm border rounded-md px-2 py-1"
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">Inquiry Details</h2>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {selectedInquiry.projectImageUrl && (
                  <div className="relative h-64 w-full rounded-lg overflow-hidden">
                    <Image
                      src={selectedInquiry.projectImageUrl}
                      alt="Project preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Client Name</label>
                    <p className="text-gray-900">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-gray-900">{selectedInquiry.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">
                      {selectedInquiry.email}
                      {!isValidEmail(formatEmail(selectedInquiry.email)) && (
                        <span className="ml-2 text-xs text-red-500">Invalid email format</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(selectedInquiry.status)}`}>
                      {selectedInquiry.status}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Project Details</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.jobDetail}</p>
                </div>

                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Reply to Client
                  </label>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="w-full h-32 p-3 border rounded-lg resize-none"
                    placeholder="Type your reply here..."
                    disabled={emailSending || !isValidEmail(formatEmail(selectedInquiry.email))}
                  />
                  
                  {emailError && (
                    <div className="mt-2 text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {emailError}
                    </div>
                  )}
                  
                  {emailSuccess && (
                    <div className="mt-2 text-green-600 flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      Email sent successfully!
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={sendReply}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
                      disabled={!reply.trim() || emailSending || !isValidEmail(formatEmail(selectedInquiry.email))}
                    >
                      {emailSending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : "Send Reply"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowDeclineModal(true)}
                    className="flex items-center text-red-600 hover:text-red-800"
                    disabled={emailSending}
                  >
                    Decline Inquiry
                    <Trash2 className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Decline Inquiry</h2>
            <p className="text-sm text-gray-500 mb-4">
              Email will be sent to: {selectedInquiry.email}
              {!isValidEmail(formatEmail(selectedInquiry.email)) && (
                <span className="ml-2 text-red-500">Invalid email format</span>
              )}
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg resize-none mb-4"
              placeholder="Reason for declining..."
              disabled={emailSending || !isValidEmail(formatEmail(selectedInquiry.email))}
            />
            
            {emailError && (
              <div className="mt-2 mb-4 text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {emailError}
              </div>
            )}
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                disabled={emailSending}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDecline(selectedInquiry)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed flex items-center"
                disabled={!declineReason.trim() || emailSending || !isValidEmail(formatEmail(selectedInquiry.email))}
              >
                {emailSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : "Decline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debug Info (only visible during development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 text-xs overflow-auto max-h-32">
          <p>EmailJS Status: {emailJSStatus.initialized ? '✅' : '❌'}</p>
          <p>Service ID: {emailJSStatus.serviceId ? '✅' : '❌'}</p>
          <p>Accept Template ID: {emailJSStatus.acceptTemplateId ? '✅' : '❌'}</p>
          <p>Reject Template ID: {emailJSStatus.rejectTemplateId ? '✅' : '❌'}</p>
        </div>
      )}
    </div>
  );
}