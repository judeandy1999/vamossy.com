"use client";
import { FrameworkData } from '@/data/data';
import { motion } from "framer-motion";
import Title from '@/components/ui/title';
import Container from "@/components/ui/container";
import { Download, ArrowRight } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      type: "spring",
      stiffness: 80,
      damping: 20,
    },
  }),
};

const deliverableVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.5 + i * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 100,
    },
  }),
};

export default function FrameworkSection() {
  return (
    <Container variant="gray">
      <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-20">
        <Title
          underlineEffect={true}
          variant="h2"
          title="Our Framework"
          className="text-gray-300 text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-center drop-shadow-2xl px-2 sm:px-4"
        />
        <Title
          variant="h5"
          title="We organize our consulting capabilities into four core verticals"
          className="text-gray-300 text-center mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl mx-auto max-w-4xl leading-relaxed px-4 sm:px-6"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-0">
        {FrameworkData.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-[#1e2749]/20 via-[#1a2139]/20 to-[#151b2e]/20 p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-[#2a3451] flex flex-col h-full backdrop-blur-sm relative overflow-hidden"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={cardVariants}
            >
              {/* Subtle gradient overlay for hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 rounded-2xl sm:rounded-3xl" />
              
              {/* Header Section */}
              <div className="relative z-10 mb-4 sm:mb-6">
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-400/80 to-yellow-500/80 rounded-xl sm:rounded-2xl shadow-lg group-hover:shadow-yellow-400/30 flex-shrink-0">
                    <Icon className="text-black text-xl sm:text-2xl lg:text-3xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-300 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 group-hover:text-yellow-500 leading-tight">
                      {item.title}
                    </h3>
                    <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full group-hover:w-12 sm:group-hover:w-16 transition-all duration-300" />
                  </div>
                </div>
                <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 sm:mb-6 group-hover:text-gray-200">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <ArrowRight className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl font-semibold"> 
                    Deliverables include:
                  </p>
                </div>
              </div>
              
              {/* Deliverables Section */}
              <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
                {item.deliverables.map((deliverable, i) => (
                  <motion.button
                    key={i}
                    className="w-full flex items-center gap-3 sm:gap-4 text-left text-sm sm:text-base md:text-lg bg-[#302c2c] border-1 border-yellow-200/50 hover:from-yellow-400/50 hover:to-yellow-300/50 focus:from-yellow-400 focus:to-yellow-300 text-gray-300 py-3 sm:py-4 px-3 sm:px-5 lg:px-6 rounded-xl sm:rounded-2xl font-medium shadow-lg hover:shadow-xl hover:shadow-gray-600/20 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200"
                    onClick={() => alert(`Download: ${deliverable}`)} // Replace with real logic
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    variants={deliverableVariants}
                    viewport={{ once: false, amount: 0.2 }}
                  >
                    <div className="p-1.5 sm:p-2 bg-black/10 rounded-lg sm:rounded-xl border-1 border-yellow-200/50 group-hover/button:bg-black/20 flex-shrink-0">
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-300 group-hover/button:text-black" />
                    </div>
                    <span className="flex-1 leading-relaxed font-medium min-w-0 text-left pr-2">{deliverable}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 group-hover/button:text-black group-hover/button:translate-x-1 transition-transform duration-200 flex-shrink-0" />
                  </motion.button>
                ))}
              </div>
              <div className="flex-grow"></div>
            </motion.div>
          );
        })}
      </div>
    </Container>
  );
}