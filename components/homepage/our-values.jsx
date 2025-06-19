'use client';

import { motion } from "framer-motion";
import { ourValues } from "@/data/data";

export default function OurValues() {
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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen py-20 px-4 bg-gradient-to-br from-[#262626] via-gray-800 to-gray-900">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Mountain Image */}
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={imageVariants}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={ourValues.image}
                alt="Mountain landscape representing our values"
                className="w-full h-[400px] md:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 to-transparent"></div>
            </div>
          </motion.div>

          {/* Right Side - Values Content */}
          <motion.div
            className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border-2 border-yellow-500/50"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={titleVariants}
          >
            {/* Title */}
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-8 text-white text-center tracking-wide">
              {ourValues.title}
            </h2>

            {/* Values List */}
            <motion.div
              className="space-y-4"
              variants={containerVariants}
            >
              {ourValues.values.map((value, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  variants={itemVariants}
                >
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-200 text-base md:text-lg font-light leading-relaxed">
                    {value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Animated wave transition */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg 
          className="relative block w-full h-32" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <motion.path 
            d="M0,60 C150,120 350,0 500,60 C650,120 850,0 1000,60 C1100,120 1200,60 1200,60 L1200,120 L0,120 Z" 
            fill="currentColor"
            className="text-gray-900"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </section>
  );
}