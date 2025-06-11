'use client';

import { motion } from "framer-motion";
import { ourServices } from "@/data/data";
import Button from "@/components/ui/button";

export default function OurServices() {
  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.4,
      },
    },
  };

  return (
    <section className="relative min-h-screen py-8 lg:py-24 px-8 bg-transparent">

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={titleVariants}
        >
          <h2 className="text-xl md:text-5xl lg:text-6xl font-semibold text-gray-100 mb-4">
            Our Services
          </h2>
          <p className="text-md md:text-xl lg:text-2xl mt-4 font-light text-gray-200 mb-8">
            Our service range covers the entire field of eCommerce Digital Marketing. Feel free to ask for custom requests!
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
        >
          {ourServices.map((service, index) => (
            <motion.div
              key={index}
              className="group relative bg-[#333]/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg shadow-gray-900/50"
              variants={cardVariants}
            >
              {/* Service Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center group-hover:bg-yellow-400">
                  <img 
                    src={service.icon} 
                    alt={service.title}
                    className="w-12 h-12 object-contain filter brightness-0"
                  />
                </div>
              </div>

              {/* Service Content */}
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-50 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-200 text-md md:text-lg leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Hover Effect Border */}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}