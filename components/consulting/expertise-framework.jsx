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
    <Container variant="gray-gradient" className="py-16">
      <div className="mb-16">
        <Title
          underlineEffect={true}
          variant="h2"
          title="Our Expertise Framework"
          className="text-white text-4xl md:text-5xl font-extrabold text-center drop-shadow-lg"
        />
        <Title
          variant="h5"
          title="We organize our consulting capabilities into four core verticals:"
          className="text-gray-200 text-center mt-2"
        />
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-10">
        {expertiseData.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-[#181f33] to-[#10131f] p-8 rounded-2xl shadow-2xl border border-[#232b45] flex flex-col h-full"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={cardVariants}
            >
              {/* Title Row */}
              <div className="flex items-center gap-3 mb-1">
                <Icon className="text-yellow-400 text-3xl" />
                <Title
                  as="h3"
                  variant="h3"
                  title={item.title}
                  className="text-white text-xl md:text-xl font-bold text-left !mb-0 !mt-0"
                />
              </div>
              {/* Description */}
              <div className="text-gray-300 text-base mb-7 text-left pl-11">
                {item.description}
              </div>
              {/* Deliverables */}
              <div className="flex flex-col gap-3 mt-auto">
                {item.deliverables.map((deliverable, i) => (
                  <motion.button
                    key={i}
                    className="w-full flex items-center gap-3 text-left text-base bg-yellow-500/90 hover:bg-yellow-400 focus:bg-yellow-400 text-black py-3 px-5 rounded-xl transition-all duration-200 font-medium shadow-md outline-none focus:ring-2 focus:ring-yellow-300"
                    onClick={() => alert(`Download: ${deliverable}`)} // Replace with real logic
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    viewport={{ once: false, amount: 0.2 }}
                  >
                    <Download className="w-5 h-5 text-black opacity-80" />
                    <span className="flex-1">{deliverable}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Container>
  );
}