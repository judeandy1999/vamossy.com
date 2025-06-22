"use client";
import { expertiseData } from '@/data/data';
import { motion } from "framer-motion";
import Title from '@/components/ui/title';
import Container from "@/components/ui/container";

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

      <Title className="text-yellow-400" variant="h2" title="Our Expertise Framework"/>
      <Title variant="h5" title="We organize our consulting capabilities into four core verticals:"/>
      
      <div className="grid md:grid-cols-2 gap-10">
        {expertiseData.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              className="bg-[#151B2C] p-6 rounded-2xl border border-yellow-500 shadow-lg"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={cardVariants}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="text-yellow-400 text-2xl" />
                <h3 className="text-xl text-white font-semibold">{item.title}</h3>
              </div>
              <p className="text-sm mb-6 text-gray-300">{item.description}</p>
              <div className="space-y-3">
                {item.deliverables.map((deliverable, i) => (
                  <motion.button
                    key={i}
                    className="w-full text-left text-sm bg-yellow-500 hover:bg-yellow-400 text-black py-2 px-4 rounded-lg transition-all duration-200"
                    onClick={() => alert(`Download: ${deliverable}`)} // Replace with real logic
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    viewport={{ once: false, amount: 0.2 }}
                  >
                    {deliverable}
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