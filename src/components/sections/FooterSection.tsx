import React from "react";
import MainButton from "../common/MainButton";

function FooterSection() {
  const data = {
    product: [
      "Changelog",
      "Customer stories",
      "Security",
      "Pricing",
      "API",
      "Integrations",
      
    ],
    company: ["About", "Careers", "Blog", "Startup program"],
    attioFor: ["Startups", "Dear flow"],
    support: ["Help Center", "Talk to support", "API docs", "System status"],
  };
  return (
    <section className="bg-[#232529] px-4 md:px-[94px] py-[90px]">
      <div>
        <img
          src="/images/logo.png"
          alt="footer logo"
          className="w-[70px] md:w-[90px] lg:w-[100px] h-auto max-w-full"
        />
      </div>

      <div className="mt-[32px] pb-[50px] flex justify-between w-full gap-8 flex-col md:flex-row flex-wrap">
        <div>
          <p className="text-[#9098A0] mb-[12px]">Product</p>
          <div className="flex flex-col gap-3">
            {data.product.map((item, index) => (
              <p key={index} className="text-[#555E67] hover:cursor-pointer">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[#9098A0] mb-[12px]">Company</p>
          <div className="flex flex-col gap-3">
            {data.company.map((item, index) => (
              <p key={index} className="text-[#555E67] hover:cursor-pointer">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[#9098A0] mb-[12px]">AI for</p>
          <div className="flex flex-col gap-3">
            {data.attioFor.map((item, index) => (
              <p key={index} className="text-[#555E67] hover:cursor-pointer">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[#9098A0] mb-[12px]">Support</p>
          <div className="flex flex-col gap-3">
            {data.support.map((item, index) => (
              <p key={index} className="text-[#555E67] hover:cursor-pointer">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="min-w-[300px]">
          <p className="font-medium text-[#9098A0] mb-4">Contact Developer</p>
          <div className="flex flex-col gap-[12px] justify-start">
            <a
              href="https://www.linkedin.com/in/toporapuladev/" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <MainButton
                text="LinkedIn"
                size="small"
                width="full_width"
                className="border-none bg-[#0077B5] hover:bg-[#005582] rounded-[12px]"
              />
            </a>
            <a
              href="https://cse21-077.github.io/TopoRapulaPortfolio/" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <MainButton
                text="Visit Website"
                size="small"
                width="full_width"
                className="rounded-[12px] border-[1px] border-[#EDEEF0] bg-transparent hover:bg-transparent text-white"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FooterSection;