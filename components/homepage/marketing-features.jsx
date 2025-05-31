'use client';
import { motion } from "framer-motion";
import { features } from "@/data/data";

export default function MarketingFeatures() {

  const titleVariants = {
    hidden: { opacity: 0, y: -80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  const featuresVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="min-h-[60vh] flex items-center bg-black text-white py-16">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-[78px] font-semibold mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={titleVariants}
        >
          Results-driven Marketing
        </motion.h2>
        <motion.div
          className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={featuresVariants}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4"
            >
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-24 h-24"
              />
              <h3 className="text-[30px] font-semibold">{feature.title}</h3>
              <p className="text-[20px] text-gray-400">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}