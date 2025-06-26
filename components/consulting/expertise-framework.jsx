"use client";
import { expertiseData } from '@/data/data';
import { motion } from "framer-motion";
import Title from '@/components/ui/title';
import Container from "@/components/ui/container";
import { Download } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      type: "spring",
      stiffness: 60,
    },
  }),
};

export default function ExpertiseSection() {
  return (
    <Container variant="gray">
      <div className="mb-12 lg:mb-16">
        <Title
          underlineEffect={true}
          variant="h2"
          title="Our Expertise Framework"
          className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold text-center drop-shadow-lg"
        />
        <Title
          variant="h5"
          title="We organize our consulting capabilities into four core verticals"
          className="text-gray-200 text-center mt-4 text-lg lg:text-2xl mx-auto"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {expertiseData.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-[#1a2139] via-[#151b2e] to-[#0f1220] p-6 lg:p-8 rounded-2xl shadow-2xl border border-[#2a3451] flex flex-col h-full backdrop-blur-sm"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={cardVariants}
            >
              {/* Header Section */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="text-yellow-400 text-3xl" />
                  <h3 className="text-white text-2xl lg:text-2xl font-semibold m-0">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-300 text-xl lg:text-2xl leading-relaxed mb-3">
                  {item.description}
                </p>
                <p className="text-white text-xl lg:text-2xl font-semibold m-0"> 
                  Deliverables include:
                </p>
              </div>
              
              {/* Deliverables Section */}
              <div className="flex flex-col gap-3">
                {item.deliverables.map((deliverable, i) => (
                  <motion.button
                    key={i}
                    className="w-full flex items-center gap-3 text-left text-lg lg:text-xl bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 focus:from-yellow-400 focus:to-yellow-300 text-black py-3 px-4 lg:px-5 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:ring-offset-2 focus:ring-offset-transparent group"
                    onClick={() => alert(`Download: ${deliverable}`)} // Replace with real logic
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    viewport={{ once: false, amount: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4 lg:w-5 lg:h-5 text-black/80 group-hover:text-black transition-colors duration-200" />
                    <span className="flex-1 leading-tight">{deliverable}</span>
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