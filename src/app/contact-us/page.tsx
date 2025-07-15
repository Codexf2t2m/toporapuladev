"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Client, Storage, Databases, ID } from 'appwrite';

// Initialize Appwrite
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const storage = new Storage(client);
const databases = new Databases(client);

export interface ContactFormData {
  name: string;
  email: string;
  phone: number; // Changed to number to match schema
  company: string;
  country: string;
  jobtittle: string; // Note the spelling matches your schema
  jobDetail: string; // Note the singular form matches your schema
  projectImage?: File;  // Add this for the actual file
  projectImageUrl?: string;
  status: 'new' | 'in-progress' | 'completed';
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    let imageUrl = null;

    // Upload image if provided
    if (formData.projectImage) {
      const imageResponse = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || '',
        ID.unique(),
        formData.projectImage
      );
      imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${imageResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
    }

    // Create inquiry document
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || '',
      ID.unique(),
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        country: formData.country,
        jobtittle: formData.jobtittle,
        jobDetail: formData.jobDetail,
        projectImageUrl: imageUrl,
        status: 'new',
      }
    );
    return response;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
}

function ContactUsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    jobtittle: "",
    jobDetail: "", // Changed from jobDetails to jobDetail to match schema
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image must be less than 5MB');
        return;
      }
      setProjectImage(file);
      setError('');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    console.log('Form submission started'); // Log start
    console.log('Form data:', formData); // Log form data
    console.log('Project image:', projectImage); // Log image data

    try {
      let imageUrl = null;

      if (projectImage) {
        try {
          console.log('Attempting to upload image...');
          
          // Upload image to storage
          const imageResponse = await storage.createFile(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || '',
            ID.unique(),
            projectImage
          );

          console.log('Image upload response:', imageResponse);

          // Generate the correct image URL - Fixed URL generation
          imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${imageResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

          console.log('Generated image URL:', imageUrl);

        } catch (imageError: any) {
          console.error('Image upload error details:', {
            message: imageError.message,
            code: imageError.code,
            type: imageError.type
          });
          setError('Failed to upload image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      // Create the document with all form data
      const documentData = {
        name: formData.name,
        email: formData.email,
        phone: parseInt(formData.phone || '0'), // Add fallback for empty string
        company: formData.company,
        country: formData.country,
        jobtittle: formData.jobtittle,
        jobDetail: formData.jobDetail,
        projectImageUrl: imageUrl,
        status: 'new'
      };

      console.log('Attempting to create document with data:', documentData);

      const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || '',
        ID.unique(),
        documentData
      );

      console.log('Document created successfully:', response);
      router.push('/thank-you');
    } catch (error: any) {
      console.error('Form submission error details:', {
        message: error.message,
        code: error.code,
        type: error.type,
        response: error.response
      });
      setError(`Failed to submit form: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      console.log('Form submission completed');
    }
  };

  return (
    <section className="py-12 px-4 md:px-[94px] bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-primary mb-6">Contact Us</h1>
        <p className="text-gray-600 mb-6">
          Let us know your requirements, and we’ll get back to you as soon as
          possible.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="jobtittle"
              placeholder="Job Title"
              value={formData.jobtittle}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <textarea
            name="jobDetail" // Changed from jobDetails to jobDetail
            placeholder="Job Details"
            value={formData.jobDetail} // Changed from jobDetails to jobDetail
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            rows={5}
            required
          ></textarea>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Image (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
            {projectImage && (
              <div className="mt-4">
                <div className="relative w-full h-32">
                  <img
                    src={URL.createObjectURL(projectImage)}
                    alt="Preview"
                    className="rounded-lg object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => setProjectImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Selected: {projectImage.name}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
        >
          ← Back to Home
        </button>
      </div>
    </section>
  );
}

export default ContactUsPage;
