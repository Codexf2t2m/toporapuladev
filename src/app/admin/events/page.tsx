"use client";

import { useState, useEffect } from "react";
import { Client, Databases, Storage, ID } from "appwrite";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/dashboard/Sidebar";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);
const storage = new Storage(client);

const EVENTS_COLLECTION_ID = '682ac580000cc94eaac7';

interface Event {
  $id?: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image?: string;
  link: string;
  isPublished: boolean;
}

export default function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split('T')[0],
    location: "",
    description: "",
    link: "",
    isPublished: true
  });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        EVENTS_COLLECTION_ID
      );
      setEvents(response.documents as unknown as Event[]);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting event creation...', formData);
      let imageUrl = "";

      if (eventImage) {
        console.log('Uploading image...');
        try {
          const fileResponse = await storage.createFile(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || '',
            ID.unique(),
            eventImage
          );
          console.log('Image uploaded successfully:', fileResponse);

          imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          throw new Error('Failed to upload image');
        }
      }

      console.log('Creating event document with data:', {
        ...formData,
        image: imageUrl
      });

      const event = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        EVENTS_COLLECTION_ID,
        ID.unique(),
        {
          ...formData,
          image: imageUrl,
          // Ensure date is in correct format
          date: new Date(formData.date).toISOString().split('T')[0],
          // Ensure all required fields are present
          title: formData.title.trim(),
          location: formData.location.trim(),
          description: formData.description.trim(),
          link: formData.link.trim(),
          isPublished: true
        }
      );

      console.log('Event created successfully:', event);

      setFormData({
        title: "",
        date: new Date().toISOString().split('T')[0],
        location: "",
        description: "",
        link: "",
        isPublished: true
      });
      setEventImage(null);
      setShowModal(false);
      await fetchEvents();

    } catch (error) {
      console.error('Detailed error:', error);
      // Show more detailed error message
      alert(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setLoading(true);
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        EVENTS_COLLECTION_ID,
        eventId
      );
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
      link: event.link || "",
      isPublished: event.isPublished
    });
    setShowModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.$id) {
      console.error('No event ID found for update');
      alert('Cannot update event: Missing event ID');
      return;
    }

    setLoading(true);
    try {
      console.log('Starting event update...', { eventId: editingEvent.$id, formData });
      let imageUrl = editingEvent.image || "";

      if (eventImage) {
        console.log('Uploading new image...');
        try {
          const fileResponse = await storage.createFile(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || '',
            ID.unique(),
            eventImage
          );
          console.log('New image uploaded successfully:', fileResponse);

          imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          throw new Error('Failed to upload new image');
        }
      }

      const updateData = {
        ...formData,
        image: imageUrl,
        // Ensure date is in correct format
        date: new Date(formData.date).toISOString().split('T')[0],
        // Ensure all required fields are present and trimmed
        title: formData.title.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        link: formData.link.trim(),
        isPublished: formData.isPublished
      };

      console.log('Updating event with data:', updateData);

      const updatedEvent = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        EVENTS_COLLECTION_ID,
        editingEvent.$id,
        updateData
      );

      console.log('Event updated successfully:', updatedEvent);

      // Reset form and state
      setFormData({
        title: "",
        date: new Date().toISOString().split('T')[0],
        location: "",
        description: "",
        link: "",
        isPublished: true
      });
      setEventImage(null);
      setEditingEvent(null);
      setShowModal(false);
      await fetchEvents(); // Refresh the events list

    } catch (error) {
      console.error('Detailed update error:', error);
      alert(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Events Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 inline-block mr-2" />
            Create Event
          </button>
        </div>

        {/* Create Event Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
              <form onSubmit={editingEvent ? handleUpdate : handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold mb-4">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-2 border rounded h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Event Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEventImage(e.target.files?.[0] || null)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Registration Link</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="https://"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingEvent(null);
                      setFormData({
                        title: "",
                        date: new Date().toISOString().split('T')[0],
                        location: "",
                        description: "",
                        link: "",
                        isPublished: true
                      });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.$id} className="bg-white rounded-lg shadow p-6 relative">
              {event.image && (
                <div className="relative h-48 w-full mb-4">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="absolute top-2 right-2 flex space-x-2 bg-white/80 rounded-lg p-1">
                <button
                  onClick={() => handleEdit(event)}
                  className="p-1.5 text-blue-600 hover:text-blue-800 bg-white rounded-lg"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(event.$id!)}
                  className="p-1.5 text-red-600 hover:text-red-800 bg-white rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-2">{event.location}</p>
              <p className="text-gray-500 text-sm mb-4">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 line-clamp-3 mb-4">{event.description}</p>
              {event.link && (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Registration Link
                </a>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}