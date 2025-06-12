'use client';

import { motion } from "framer-motion";
import { ourServices } from "@/data/data";

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <section className="relative min-h-screen py-8 lg:py-20 px-8 bg-transparent">

      <div className="relative max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={titleVariants}
        >
          <h2 className="text-shadow-sm text-xl md:text-5xl lg:text-6xl font-semibold text-gray-100 mb-4">
            Our Services
          </h2>
          <p className="text-shadow-sm mx-auto text-md md:text-xl lg:text-2xl mt-4 font-light text-gray-200 mb-8 max-w-5xl">
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
              className="group relative bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50 shadow-lg shadow-gray-900/50"
              variants={cardVariants}
            >
              {/* Service Icon */}
              <div className="flex justify-center">
                <div className="w-40 h-40 flex items-center justify-center">
                  <img 
                    src={service.icon} 
                    alt={service.title}
                    className="w-40 h-40 object-contain filter"
                  />
                </div>
              </div>

              {/* Service Content */}
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-50 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-200 text-md md:text-lg font-light leading-relaxed mb-4">
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