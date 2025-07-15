"use client";

import { useState } from "react";
import { X } from "lucide-react";
import MainButton from "./MainButton";
import { useRouter } from "next/navigation"; // Import router for navigation

function NavBar() {
  const router = useRouter(); // Initialize router for navigation

  const links = [
    {
      route: "/",
      name: "Home",
      badgeCount: 0,
    },
    {
      route: "/services",
      name: "Services",
      badgeCount: 0,
    },
    {
      route: "/case-studies",
      name: "Case Studies",
      badgeCount: 4,
    },
    {
      route: "/about-us",
      name: "About Us",
      badgeCount: 0,
    },
    {
      route: "/event",
      name: "Events",
      badgeCount: 0,
    },
  ];

  const [menu, setMenu] = useState(false);
  const toggleMenu = () => {
    setMenu(!menu);
  };

  return (
    <div className="md:sticky md:top-0 md:shadow-none z-20 mt-[5rem] md:mt-0">
      {/* DESKTOP */}
      <div className="hidden lg:block animate-in fade-in zoom-in bg-white p-4">
        <div className="flex justify-between mx-4 items-center">
          <div>
            <img
              src="/images/logo.png"
              alt="logo"
              className="w-[120px] h-auto md:w-[140px] lg:w-[160px]"
            />
          </div>
          <div className="flex gap-[20px] xl:gap-[50px] text-[16px] items-center select-none">
            {links.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 cursor-pointer"
                onClick={() => router.push(item.route)} // Navigate to the route
              >
                <p
                  className={`hover:text-primary flex items-center gap-2 font-[500] text-gray`}
                >
                  {item.name}
                </p>
                {item.badgeCount ? (
                  <div className="h-8 w-8 rounded-full bg-primary flex justify-center items-center font-semibold text-white">
                    {item.badgeCount}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-[20px] select-none">
            <button
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              onClick={() => router.push("/contact-us")} // Navigate to Contact Us page
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div
        className={`block lg:hidden shadow-sm fixed top-0 w-full z-[999] bg-white py-4 animate-in fade-in zoom-in ${
          menu ? "bg-primary py-2" : ""
        }`}
      >
        <div className="flex justify-between mx-[10px]">
          <div className="flex gap-[50px] text-[16px] items-center select-none">
            <img
              src="/images/logo.png"
              alt="logo"
              className="w-[100px] h-auto"
            />
          </div>
          <div className="flex items-center gap-[40px]">
            {menu ? (
              <X
                className="cursor-pointer animate-in fade-in zoom-in text-black w-6 h-6"
                onClick={toggleMenu}
              />
            ) : (
              <img
                src="/images/menu.png"
                alt="menu"
                className="cursor-pointer animate-in fade-in zoom-in w-6 h-6"
                onClick={toggleMenu}
              />
            )}
          </div>
        </div>
        {menu ? (
          <div className="my-8 select-none animate-in slide-in-from-right">
            <div className="flex flex-col gap-8 mt-8 mx-4">
              {links.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-2 cursor-pointer"
                  onClick={() => {
                    toggleMenu();
                    router.push(item.route);
                  }}
                >
                  <p
                    className={`hover:text-primary flex items-center gap-2 font-[500] text-gray`}
                  >
                    {item.name}
                  </p>
                  {item.badgeCount ? (
                    <div className="h-8 w-8 rounded-full bg-primary flex justify-center items-center font-semibold text-white">
                      {item.badgeCount}
                    </div>
                  ) : null}
                </div>
              ))}

              <div className="flex flex-col gap-[20px] select-none">
                <button
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                  onClick={() => {
                    toggleMenu();
                    router.push("/contact-us");
                  }}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default NavBar;
