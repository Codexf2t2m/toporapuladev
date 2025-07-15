"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Info } from "lucide-react";
import Image from "next/image";

// Custom Header Component
interface CustomHeaderProps {
  title: string;
  description?: string;
}

const CustomHeader = ({ title, description }: CustomHeaderProps) => {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{title}</h2>
      {description && <p className="text-lg text-gray-600">{description}</p>}
    </div>
  );
};

// Project Data
const projects = [
  {
    id: 1,
    title: "Bulb world Training Hub",
    shortDescription: "A modern training hub solution with advanced chat area for eloyees and past employees to share ideas teach idealise.",
    thumbnail: "/images/pg.png",
    liveUrl: "https://bulbworlddemo.netlify.app/",
    problem: "The bulb world has various branches and communication adn technology sharing is a bit slow as a result slowing down inovation",
    solution:
      "We built a responsive, performance-optimized platform using Next.js and a headless CMS that loads instantly and provides a seamless training hub experience across all devices.",
    results: "50% increase in innovative ideas and 90% skill transfer.",
    technologies: ["Next.js", "Stripe", "Tailwind CSS", "Sanity CMS"],
    images: ["/images/inno.png", "/images/inno2.png"],
  },
  {
    id: 2,
    title: "StockTrader",
    shortDescription: "A platform for real-time stock tracking and analysis.It alerts users about significant market changes.",
    thumbnail: "/images/oo.png",
    liveUrl: "https://stocktracker-ashy.vercel.app/",
    problem:
      "Healthcare providers struggled with fragmented systems that made patient management inefficient and error-prone.",
    solution:
      "We developed a unified dashboard that centralizes Market data, news events and positiong in one secure platform.",
    results: "Reduced reserach time by 40% and improved trading rofits with scores by 25%.",
    technologies: ["React", "Node.js", "PostgreSQL", "FSCA Compliance"],
    images: [],
  },
  {
    id: 3,
    title: "Financial Analytics Tool",
    shortDescription: "An Ai powered digital teller for FNB Botswana that helps users manage their finances and investments.",
    thumbnail: "/images/fifi.png",
    liveUrl: "https://www.fnbbotswana.co.bw/",
    problem: "FNB customers were tired of queing for issues that can be solved in minutes. some needed fiancial advisors fif does it all.",
    solution:
      "We build a digital teller that uses AI to provide personalized financial advice, investment tracking, and budgeting tools.",
    results: "Helped clients achieve 22% better returns compared to industry benchmarks.",
    technologies: ["Three.js", "Python", "TensorFlow", "AWS"],
    images: [],
  },
  {
    id: 4,
    title: "Fututure Gen Supply Chain",
    shortDescription: "A Ticketing platform for supply chain management with real-time tracking and analytics.Also used to register people for their confrences",
    thumbnail: "/images/too.png",
    liveUrl: "https://fututuregensupplychain.netlify.app/",
    problem: "Traditional online learning platforms lacked engagement and personalization features.",
    solution:
      "We built an interactive platform with ability to register for events and stay up to date with the forums for all the future procument and supply chain professionals.",
    results: "Increased event registration by 45% and improved member engagement.",
    technologies: ["React", "Socket.io", "MongoDB", "WebRTC"],
    images: [],
  },
];

// Project Card Component
interface Project {
  id: number;
  title: string;
  shortDescription: string;
  thumbnail: string;
  liveUrl: string;
  problem: string;
  solution: string;
  results: string;
  technologies: string[];
  images: string[];
}

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative h-[200px] w-full overflow-hidden">
        <Image
          src={project.thumbnail || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{project.shortDescription}</p>
        <div className="flex gap-3 mt-auto">
          <Button asChild variant="outline" size="sm">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <ExternalLink size={16} /> Live Preview
            </a>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="flex items-center gap-1">
                <Info size={16} /> Info
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{project.title}</DialogTitle>
                <DialogDescription>{project.shortDescription}</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="problem" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="problem">Problem</TabsTrigger>
                  <TabsTrigger value="solution">Solution</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>
                <TabsContent value="problem" className="py-4">
                  <h4 className="text-lg font-medium mb-2">The Challenge</h4>
                  <p className="text-gray-700">{project.problem}</p>
                </TabsContent>
                <TabsContent value="solution" className="py-4">
                  <h4 className="text-lg font-medium mb-2">Our Approach</h4>
                  <p className="text-gray-700">{project.solution}</p>
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">Technologies Used:</h5>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="results" className="py-4">
                  <h4 className="text-lg font-medium mb-2">Impact & Results</h4>
                  <p className="text-gray-700">{project.results}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {project.images.map((img, index) => (
                      <div key={index} className="relative h-[200px] rounded-lg overflow-hidden">
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`${project.title} screenshot ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

// MultiPlayerDesignSection Component
function MultiPlayerDesignSection() {
  return (
    <section className="py-12">
      <div className="mb-12">
        <CustomHeader
          title="See What We've Built"
          description="Explore our case studies to see how we've helped businesses bring their ideas to life with innovative software solutions."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

export default MultiPlayerDesignSection;
