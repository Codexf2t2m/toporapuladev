import React from "react";
import HeroHeaderSection from "./HeroHeaderSection";
import MainButton from "../common/MainButton";
import { cn } from "@/lib/utils";
import { gilroyBold } from "@/lib/utils";
import { HeroIphone15ProModal } from "../modals/HeroYoutubeModal";

function HeroSection() {
  return (
    <section>
      <HeroHeaderSection />
      <div>
        <div
          className={cn(
            gilroyBold.className,
            "text-4xl md:text-[92px] text-center text-primary md:leading-[5.5rem] my-8"
          )}
        >
          We Build <br /> What You Imagine.
        </div>

        <p className="mb-8 text-[22px] text-center text-[#31373D]">
          Transform your ideas into powerful software solutions.
          From concept to code, we make your tech dreams come true.
        </p>

        <div className="flex gap-[12px] justify-center">
          <MainButton
            text="Start your project"
            size="small"
            className="border-none rounded-[12px]"
          />
          <MainButton
            text="Schedule consultation"
            size="small"
            className="rounded-[12px] border-[1px] border-[#EDEEF0] bg-white hover:bg-white text-[#31373D]"
          />
        </div>

        {/* Add spacing and resize the iPhone mockup */}
        <div className="flex w-full justify-center mt-12"> {/* Added margin-top */}
          <HeroIphone15ProModal />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
