import Link from "next/link";
import Iphone15Pro from "../magicui/iphone-15-pro";

export function HeroIphone15ProModal() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-8 py-12 px-4 md:px-[94px] bg-gray-50">
      {/* Video Section */}
      <div className="relative w-full md:w-1/2">
        <video
          src="https://framerusercontent.com/assets/YVwxqIs5jj53TfqCQhpBS26HAk.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      {/* Text Section */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          We Build Cool Stuff
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Just for fun and, of course, for our clients too. From innovative
          designs to cutting-edge technology, we bring ideas to life with
          passion and precision.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <a
            href="https://www.linkedin.com/in/topo-lefika-rapula-0813111b8/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Meet Our Lead Dev
          </a>
          <Link
            href="/contact-us"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
