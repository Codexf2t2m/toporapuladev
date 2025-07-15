"use client";

import React, { useState } from "react";
import { gilroyBold } from "@/lib/utils";
import { cn } from "@/lib/utils";
import MainButton from "../common/MainButton";
import Image from "next/image";
import CustomHeader from "../common/CustomHeader";

interface GalleryImage {
  src: string;
  description: string;
}

function AboutUsSection() {
  const galleryImages: GalleryImage[] = [
    { src: "/images/j.jpg", description: "Our team at the Spark academy Ai hackathon where they built Ai models for clinical settings." },
    { src: "/images/lucy.png", description: "Lucy, our AI assistant, in action erfoming real life medical scans and diagnosis in real time." },
    { src: "/images/j2.jpg", description: "Brainstorming session with the development team." },
    { src: "/images/web.gif", description: "Our latest robot prototype website for a Robotic partner we hae partnered with." },
    { src: "/images/food.png", description: "A mobile App for a food delivery app we designed and built for a client" },
    { src: "/images/scan.png", description: "Our Ai medidcal Ai scanning system in testing" },
  ];

  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <section className="py-12">
      {/* About Us Header */}
      <div className="mb-12">
       <CustomHeader
    title="About Us"
    description="Topo Rapula is a full-stack engineer leading two tech startups. Our teams collaborate on significant projects to deliver exceptional value to our clients. We are committed to building innovative solutions that empower businesses to scale securely and efficiently. Our team of experts works tirelessly to provide cutting-edge technology and outstanding service to our clients worldwide."
    />

      </div>

      {/* Mission and Vision Section */}
      <div className="flex flex-col md:flex-row justify-between gap-16 items-center mb-16">
        <div>
          <h2
            className={cn(
              gilroyBold.className,
              "text-3xl font-bold text-primary mb-4"
            )}
          >
            Our Mission
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            To provide businesses with secure, scalable, and innovative
            solutions that drive growth and success.
          </p>
          <h2
            className={cn(
              gilroyBold.className,
              "text-3xl font-bold text-primary mb-4"
            )}
          >
            Our Vision
          </h2>
          <p className="text-gray-700 text-lg">
            To be the global leader in delivering secure and scalable
            technology, empowering businesses to achieve their full potential.
          </p>
        </div>
        <div>
          <Image
            src="/images/ab.jpg"
            alt="About Us"
            width={500}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Gallery Section */}
      <div className="mb-16">
        <h2
          className={cn(
            gilroyBold.className,
            "text-3xl font-bold text-primary text-center mb-8"
          )}
        >
          Our Journey in Pictures
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative h-64 rounded-lg overflow-hidden shadow-md cursor-pointer"
              onClick={() => openModal(image)}
            >
              <Image
                src={image.src}
                alt={`Gallery Image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Image Description</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  &times;
                </button>
              </div>
              <div className="relative h-64 w-full mb-4">
                <Image
                  src={selectedImage.src}
                  alt="Selected"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-gray-700">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AboutUsSection;
