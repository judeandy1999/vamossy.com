"use client";
import React, { useRef } from "react";
import { whoWeAre, whatWeBelieve } from "@/data/data";
import { motion, useInView } from "framer-motion";

const ListIcon = () => (
  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-3 flex-shrink-0" />
);

const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 }
  })
};

export default function AboutBeliefSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section className="relative overflow-hidden px-6 lg:px-12 py-20 md:py-28 bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="relative z-10 max-w-7xl mx-auto" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Who We Are */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-white text-2xl md:text-4xl font-bold mb-4">
                {whoWeAre.title}
              </h2>
              <div className="h-1 w-20 bg-yellow-400 mb-8" />
            </motion.div>
            
            <div className="space-y-6">
              {whoWeAre.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-4"
                  custom={idx}
                  variants={listItemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <ListIcon />
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* What We Believe */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h2 className="text-white text-2xl md:text-4xl font-bold mb-4">
                {whatWeBelieve.title}
              </h2>
              <div className="h-1 w-20 bg-yellow-400 mb-8" />
            </motion.div>
            
            <div className="space-y-6">
              {whatWeBelieve.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-4"
                  custom={idx}
                  variants={listItemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <ListIcon />
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}