'use client';

import { motion } from "framer-motion";
import { painPoints } from "@/data/data";

export default function PainPoints() {
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

  const contentVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen py-20 px-4 bg-gradient-to-br from-[#333] via-gray-800 to-gray-900">
      {/* Background overlay */}
      {/* <div className="absolute inset-0 bg-black/40"></div> */}
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={titleVariants}
        >
          <h2 className="text-xl md:text-5xl lg:text-6xl font-semibold mb-4 text-gray-100 tracking-wide">
            {painPoints.title}
          </h2>
          <p className="font-light text-md md:text-xl lg:text-2xl text-gray-200 max-w-5xl mx-auto leading-relaxed">
            {painPoints.subtitle}
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
          {/* Left Side - Image */}
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={imageVariants}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={painPoints.image}
                alt="Digital Marketing Technology"
                className="w-full h-[400px] md:h-[900px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-black-900/30"></div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={containerVariants}
          >
            {painPoints.sections.map((section, index) => (
              <motion.div
                key={index}
                className="group"
                variants={sectionVariants}
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-100 mb-4">
                    {section.title}
                  </h3>
                  <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
                    {section.description}
                  </p>
                </div>
                
                {/* Connector line */}
                {index < painPoints.sections.length - 1 && (
                  <div className="flex justify-center my-4">
                    <div className="w-px h-6 bg-gradient-to-b from-yellow-500 to-transparent"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={titleVariants}
        >
          <div className="mx-auto bg-gradient-to-r from-yellow-500/10 to-orange-500/10 max-w-5xl rounded-2xl p-8 border border-yellow-500/20">
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
              Extraordinary Strategy + Implementation + Automation + Improvement 
              <br />
              = 
              <br />
              Long term Success
            </h3>
          </div>
        </motion.div>
      </div>
    </section>
  );
}