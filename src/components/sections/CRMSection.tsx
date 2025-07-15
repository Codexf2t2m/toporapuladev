"use client";

import React from "react";
import { FaMobileAlt, FaCode, FaRobot, FaChartBar } from "react-icons/fa"; // Import React Icons
import CustomHeader from "../common/CustomHeader";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

export function ThreeDMarqueeDemoSecond() {
  const router = useRouter(); // Initialize useRouter

  const images = [
    "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
    "https://assets.aceternity.com/animated-modal.png",
    "https://assets.aceternity.com/animated-testimonials.webp",
    "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
    "https://assets.aceternity.com/github-globe.png",
    "https://assets.aceternity.com/glare-card.png",
    "https://assets.aceternity.com/layout-grid.png",
    "https://assets.aceternity.com/flip-text.png",
    "https://assets.aceternity.com/hero-highlight.png",
    "https://assets.aceternity.com/carousel.webp",
    "https://assets.aceternity.com/placeholders-and-vanish-input.png",
    "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
    "https://assets.aceternity.com/signup-form.png",
    "https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png",
    "https://assets.aceternity.com/spotlight-new.webp",
    "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png",
    "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
    "https://assets.aceternity.com/tabs.png",
    "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
    "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
    "https://assets.aceternity.com/glowing-effect.webp",
    "https://assets.aceternity.com/hover-border-gradient.png",
    "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
    "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
    "https://assets.aceternity.com/macbook-scroll.png",
    "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
    "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
    "https://assets.aceternity.com/multi-step-loader.png",
    "https://assets.aceternity.com/vortex.png",
    "https://assets.aceternity.com/wobble-card.png",
    "https://assets.aceternity.com/world-map.webp",
  ];

  const handleBookConsultation = () => {
    const phoneNumber = "+26774719272";
    const message = "Good day Topo Rapula, I am requesting a consultation on my project. I am available for a call.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSubmitProject = () => {
    router.push("/contact-us"); // Navigate to the contact-us page
  };

  return (
    <div className="relative mx-auto my-10 flex h-screen w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl">
      <h2 className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">
        Imagine a world were your dream idea&apos;s flourish{" "}
        <span className="relative z-20 inline-block rounded-xl bg-blue-500/40 px-4 py-1 text-white underline decoration-sky-500 decoration-[6px] underline-offset-[16px] backdrop-blur-sm">
          we can
        </span>{" "}
        build it.
      </h2>
      <p className="relative z-20 mx-auto max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base">
        Let us handle the gritty messy stuff, while you focus on what matters most: your business. Our team of experts is here to help you navigate the complexities of software development, so you can achieve your goals faster and more efficiently than ever before.
      </p>
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={handleBookConsultation}
          className="rounded-md bg-sky-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
        >
          Book a consultation
        </button>
        <button
          onClick={handleSubmitProject}
          className="rounded-md border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
        >
          Submit a project
        </button>
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images}
      />
    </div>
  );
}

function CRMSection() {
  const services  = [
    {
      icon: <FaMobileAlt className="text-primary text-4xl mb-4" />,
      title: "App Development",
      description:
        "Build user-friendly, scalable, and high-performance apps tailored to your business needs.",
    },
    {
      icon: <FaCode className="text-primary text-4xl mb-4" />,
      title: "Software Engineering",
      description:
        "Delivering robust, secure, and efficient software solutions to solve complex challenges.",
    },
    {
      icon: <FaRobot className="text-primary text-4xl mb-4" />,
      title: "AI Engineering",
      description:
        "Harness the power of AI to automate processes, gain insights, and drive smarter decisions.",
    },
    {
      icon: <FaChartBar className="text-primary text-4xl mb-4" />,
      title: "Data Analysis",
      description:
        "Unlock the potential of your data with actionable insights and predictive analytics.",
    },
  ];

  return (
    <section className="py-16">
      {/* Header Section */}
      <div className="text-mb-12">
        <CustomHeader
          title="Curious about our services?😏"
          description="From app development to AI engineering, we deliver tailored solutions that drive innovation and growth. Let us help you turn your ideas into impactful software."
        />
      </div>

      {/* Services Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-16">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
          >
            {service.icon}
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>

      {/* 3D Marquee Section */}
      <ThreeDMarqueeDemoSecond />
    </section>
  );
}

export default CRMSection;
