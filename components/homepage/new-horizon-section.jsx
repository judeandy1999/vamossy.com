'use client';

import { motion } from "framer-motion";
import { newHorizons } from "@/data/data";

export default function NewHorizons() {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen py-20 px-4 bg-gradient-to-br from-[#262626] via-gray-800 to-gray-900">
      <div className="relative max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={titleVariants}
        >
          <h2 className="text-xl md:text-5xl lg:text-6xl font-semibold mb-4 text-gray-100 tracking-wide">
            {newHorizons.title}
          </h2>
          <p className="font-light text-md md:text-xl lg:text-2xl text-gray-200 max-w-5xl mx-auto leading-relaxed">
            {newHorizons.subtitle}
          </p>
        </motion.div>

        {/* Main Sections */}
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
        >
          {newHorizons.sections.map((section, index) => (
            <motion.div
              key={index}
              className="mb-8"
              variants={itemVariants}
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg md:text-xl font-semibold text-gray-100 mb-4">
                  {section.title}
                </h3>
                {section.description && (
                  <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
                    {section.description}
                  </p>
                )}
              </div>
              
              {/* Connector line */}
              {index < newHorizons.sections.length - 1 && (
                <div className="flex justify-center my-4">
                  <div className="w-px h-6 bg-gradient-to-b from-yellow-500 to-transparent"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Features List */}
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
        >
          <div className="space-y-4">
            {newHorizons.features.map((feature, index) => (
              <motion.div
                key={index}
                className="group"
                variants={itemVariants}
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 flex items-start space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
                    {feature}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Examples Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={titleVariants}
        >
          <h3 className="text-xl md:text-2xl font-semibold text-gray-100 mb-8 text-center">
            {newHorizons.examples.title}
          </h3>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {newHorizons.examples.items.map((item, index) => (
              <motion.div
                key={index}
                className="group"
                variants={cardVariants}
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-4">
                      <svg 
                        className="w-6 h-6 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-100 group-hover:text-yellow-300 transition-colors">
                      Example {index + 1}
                    </h4>
                  </div>
                  
                  <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
                    {item}
                  </p>
                  
                  {/* Hover effect indicator */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={titleVariants}
        >
          <div className="mx-auto bg-gradient-to-r from-yellow-500/10 to-orange-500/10 max-w-5xl rounded-2xl p-8 border border-yellow-500/20">
            <h3 className="text-lg md:text-3xl font-semibold text-white mb-4">
              Ready to explore new horizons?
            </h3>
            <p className="text-xl md:text-2xl font-light text-white mb-4">
              Discover how our advanced AI and prompt engineering can transform your business
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}