"use client";

import React, { useState, useEffect } from "react";
import CustomHeader from "../common/CustomHeader";
import { cn } from "@/lib/utils";
import { Marquee } from "../magicui/marquee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Client, Databases, ID, Storage } from "appwrite";
import { Star } from "lucide-react";

// Initialize Appwrite
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);
const storage = new Storage(client);

interface Review {
  $id: string;
  name: string;
  username: string;
  body: string;
  img: string;
  rating: number;
}

const DataModellingSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    username: "",
    body: "",
    img: "https://avatar.iran.liara.run/public/boy?username=test", // Default image URL
    rating: 5,
  });
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch reviews from Appwrite
  const fetchReviews = async () => {
    try {
      setLoading(true);
      console.log("Fetching reviews...");
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID || ''
      );
      console.log(`Fetched ${response.documents.length} reviews`);
      setReviews(response.documents as unknown as Review[]);
      setError(null);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Set up auto-refresh every 60 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing reviews...");
      fetchReviews();
    }, 60000); // 60 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmitReview = async () => {
    try {
      console.log("Submitting review:", newReview);
      let imageUrl = newReview.img; // Default image URL

      if (reviewImage) {
        // Upload image to Appwrite storage
        const fileResponse = await storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || '',
          ID.unique(),
          reviewImage
        );

        // Get image URL from Appwrite storage
        imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
      }

      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID || '',
        ID.unique(),
        {
          name: newReview.name,
          username: newReview.username,
          body: newReview.body,
          img: imageUrl,
          rating: newReview.rating,
        }
      );
      setNewReview({
        name: "",
        username: "",
        body: "",
        img: "https://avatar.iran.liara.run/public/boy?username=test",
        rating: 5,
      });
      setReviewImage(null);
      setIsModalOpen(false);
      
      // Fetch reviews immediately after submission
      fetchReviews(); 
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsModalOpen(false); // Ensure modal closes even on error
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setReviewImage(file);
  };

  const handleRatingChange = (rating: number) => {
    setNewReview((prev) => ({ ...prev, rating: rating }));
  };

  const ReviewCard = ({
    img,
    name,
    username,
    body,
    rating,
  }: {
    img: string;
    name: string;
    username: string;
    body: string;
    rating: number;
  }) => {
    return (
      <figure
        className={cn(
          "relative h-full w-fit sm:w-36 cursor-pointer overflow-hidden rounded-xl border p-4",
          "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
          "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <img className="rounded-full" width="32" height="32" alt="" src={img} />
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium dark:text-white">
              {name}
            </figcaption>
            <p className="text-xs font-medium dark:text-white/40">{username}</p>
          </div>
        </div>
        <blockquote className="mt-2 text-sm">{body}</blockquote>
        <div className="flex items-center mt-2">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-500" />
          ))}
          <span className="text-xs text-gray-500 ml-1">({rating})</span>
        </div>
      </figure>
    );
  };

  // Utility to shuffle array
  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const Marquee3D = () => {
    // Shuffle reviews on each render for uniqueness
    const mixedReviews = shuffleArray(reviews);

    // Display message when there are no reviews or while loading
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <p className="text-xl">Loading reviews...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      );
    }

    if (reviews.length === 0) {
      return (
        <div className="flex items-center justify-center h-96">
          <p className="text-xl">No reviews yet. Be the first to add one!</p>
        </div>
      );
    }

    // Distribute reviews randomly across 4 rows
    const numRows = 4;
    const rows: Review[][] = Array.from({ length: numRows }, () => []);

    mixedReviews.forEach((review) => {
      const rowIndex = Math.floor(Math.random() * numRows); // Distribute randomly across rows
      rows[rowIndex].push(review);
    });

    // Shuffle each row independently
    const shuffledRows = rows.map(row => shuffleArray(row));

    return (
      <div className="relative flex h-96 w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px]">
        <div
          className="flex flex-row items-center gap-4"
          style={{
            transform:
              "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
          }}
        >
          {shuffledRows.map((row, i) => (
            <Marquee
              key={i}
              pauseOnHover={false}
              vertical
              className="[--duration:20s]"
              reverse={i % 2 === 1}
            >
              {row.map((review) => (
                <ReviewCard key={review.$id} {...review} />
              ))}
            </Marquee>
          ))}
        </div>
        {/* Gradients for 3D Effect */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>
    );
  };

  const RatingStars = ({
    value,
    onRatingChange,
  }: {
    value: number;
    onRatingChange: (rating: number) => void;
  }) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                star <= value
                  ? "fill-yellow-500 text-yellow-500"
                  : "fill-transparent text-gray-300"
              }`}
              onClick={() => onRatingChange(star)}
              aria-label={`Rate ${star} stars`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">({value})</span>
      </div>
    );
  };

  return (
    <section>
      <div>
        <CustomHeader
          title="What Our Clients Really Think 💬"
          description="We could tell you we're great — but it's better coming from them. See the real stories behind our 5-star reviews."
        />
        <Marquee3D />
        <div className="flex justify-center mt-20">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-sky-500 hover:bg-sky-700 text-white">Add a Review</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Your Review</DialogTitle>
                <DialogDescription>
                  Share your thoughts with others.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={newReview.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    value={newReview.username}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="body" className="text-right">
                    Review
                  </Label>
                  <Textarea
                    id="body"
                    name="body"
                    value={newReview.body}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Image (Optional)
                  </Label>
                  <Input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rating" className="text-right">
                    Rating
                  </Label>
                  <div className="col-span-3">
                    <RatingStars value={newReview.rating} onRatingChange={handleRatingChange} />
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button onClick={handleSubmitReview}>Submit Review</Button>
                <Button onClick={() => fetchReviews()} variant="outline">Refresh Reviews</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default DataModellingSection;