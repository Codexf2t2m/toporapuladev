"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import CustomHeader from "../common/CustomHeader";
import { Client, Databases, Query, Models } from "appwrite";

// Define correct collection IDs
const EVENTS_COLLECTION_ID = '682ac580000cc94eaac7';
const ARTICLES_COLLECTION_ID = '682ac63e0033973dcb03';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);

interface Event extends Models.Document {
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  link: string;
  isPublished: boolean;
}

interface Article extends Models.Document {
  title: string;
  date: string;
  author: string;
  description: string;
  image: string;
  category: string;
  readTime: string;
  isPublished: boolean;
}

export default function ReadyToBuildSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Event | Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch published events
        const eventsResponse = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
          EVENTS_COLLECTION_ID,
          [
            Query.equal('isPublished', true),
            Query.orderDesc('date'),
            Query.limit(3)
          ]
        );

        // Fetch published articles
        const articlesResponse = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
          ARTICLES_COLLECTION_ID,
          [
            Query.equal('isPublished', true),
            Query.orderDesc('date'),
            Query.limit(3)
          ]
        );

        console.log('Fetched events:', eventsResponse.documents);
        console.log('Fetched articles:', articlesResponse.documents);

        setEvents(eventsResponse.documents as Event[]);
        setArticles(articlesResponse.documents as Article[]);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const openModal = (item: Event | Article) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="bg-gray-50">
      {/* Events Section */}
      <section className="py-12 px-4 md:px-[94px]">
        <div className="mb-12">
          <CustomHeader
            title="Upcoming Events"
            description="See what we launching soon and what we have been up to."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.$id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {event.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                  <Button onClick={() => openModal(event)} variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-12 px-4 md:px-[94px] bg-white">
        <div className="mb-12">
          <CustomHeader
            title="Awards and Accomplishments"
            description="Explore our achievements and accolades."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.$id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              {article.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 line-clamp-2">{article.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">By {article.author}</span>
                  <Button onClick={() => openModal(article)} variant="outline" size="sm">Read More</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{selectedItem.title}</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  &times;
                </button>
              </div>
              {selectedItem.image && (
                <div className="relative h-64 w-full mb-4">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-gray-700 mb-4">{selectedItem.description}</p>
              {'date' in selectedItem && (
                <p className="text-gray-500 mb-2">Date: {new Date(selectedItem.date).toLocaleDateString()}</p>
              )}
              {'location' in selectedItem && (
                <p className="text-gray-500 mb-2">Location: {selectedItem.location}</p>
              )}
              {'author' in selectedItem && (
                <p className="text-gray-500 mb-2">Author: {selectedItem.author}</p>
              )}
              {'category' in selectedItem && (
                <p className="text-gray-500 mb-2">Category: {selectedItem.category}</p>
              )}
              {'readTime' in selectedItem && (
                <p className="text-gray-500 mb-2">Read Time: {selectedItem.readTime}</p>
              )}
              {'link' in selectedItem && (
                <a href={selectedItem.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Visit Link
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
