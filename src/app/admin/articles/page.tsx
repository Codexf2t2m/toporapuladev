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

import { Models } from 'appwrite';

interface Article extends Models.Document {
  title: string;
  content: string;
  author: string;
  category: string;
  readTime: string;
  image?: string;
  isPublished: boolean;
  date: string;
  description: string; // Add this
}

const ARTICLES_COLLECTION_ID = '682ac63e0033973dcb03'; // Your articles collection ID

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [articleImage, setArticleImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    category: "",
    readTime: "",
    description: "", // Add this
    isPublished: true,
    date: new Date().toISOString().split('T')[0]
  });

  // Add these after your existing state declarations
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (articleImage) {
        const fileResponse = await storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || '',
          ID.unique(),
          articleImage
        );

        imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
      }

      const article = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        ARTICLES_COLLECTION_ID, // Use the correct collection ID
        ID.unique(),
        {
          ...formData,
          image: imageUrl,
          createdAt: new Date().toISOString(),
        }
      );

      // Reset and refresh
      setFormData({
        title: "",
        content: "",
        author: "",
        category: "",
        readTime: "",
        description: "", // Add this
        date: new Date().toISOString().split('T')[0],
        isPublished: true
      });
      setArticleImage(null);
      setShowModal(false);
      fetchArticles();

    } catch (error) {
      console.error('Error creating article:', error);
      alert(`Failed to create article: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        ARTICLES_COLLECTION_ID // Use the correct collection ID
      );
      setArticles(response.documents as Article[]);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Appwrite Config:', {
      endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
      projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
    });
    fetchArticles();
  }, []);

  useEffect(() => {
    console.log('Environment variables check:', {
      endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
      projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID
    });
  }, []);

  // Add these before your return statement
  const handleDelete = async (articleId: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }
  
    try {
      setLoading(true);
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        ARTICLES_COLLECTION_ID,
        articleId
      );
      await fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      author: article.author,
      category: article.category,
      readTime: article.readTime,
      description: article.description,
      date: article.date,
      isPublished: article.isPublished
    });
    setShowModal(true);
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
  
    setLoading(true);
    try {
      let imageUrl = editingArticle.image || "";
  
      if (articleImage) {
        const fileResponse = await storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || '',
          ID.unique(),
          articleImage
        );
  
        imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
      }
  
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        ARTICLES_COLLECTION_ID,
        editingArticle.$id,
        {
          ...formData,
          image: imageUrl
        }
      );
  
      setFormData({
        title: "",
        content: "",
        author: "",
        category: "",
        readTime: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        isPublished: true
      });
      setArticleImage(null);
      setEditingArticle(null);
      setShowModal(false);
      fetchArticles();
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Failed to update article');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      title: "",
      content: "",
      author: "",
      category: "",
      readTime: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      isPublished: true
    });
    setArticleImage(null);
    setEditingArticle(null);
    setShowModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Articles Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 inline-block mr-2" />
            Create Article
          </button>
        </div>

        {/* Article Creation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={editingArticle ? handleUpdate : handleSubmit}>
                <h2 className="text-xl font-bold mb-4">{editingArticle ? 'Edit Article' : 'Create New Article'}</h2>
                
                <div className="space-y-4">
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
                    <label className="block text-sm font-medium mb-1">Content</label>
                    <textarea
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full p-2 border rounded h-32"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Author</label>
                      <input
                        type="text"
                        required
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setArticleImage(e.target.files?.[0] || null)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Read Time</label>
                    <input
                      type="text"
                      required
                      value={formData.readTime}
                      onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                      className="w-full p-2 border rounded"
                      placeholder="e.g., 5 min read"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full p-2 border rounded h-20"
                      placeholder="Brief description of the article..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (editingArticle ? 'Updating...' : 'Creating...') : (editingArticle ? 'Update Article' : 'Create Article')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.$id} className="bg-white rounded-lg shadow p-6">
              {article.image && (
                <div className="relative h-48 w-full mb-4">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-4">By {article.author}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-blue-600">{article.category}</span>
                <span className="text-sm text-gray-500">{article.readTime}</span>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(article)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(article.$id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}