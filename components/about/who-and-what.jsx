"use client";
import React, { useRef } from "react";
import { whoWeAre, whatWeBelieve } from "@/data/data";
import { motion, useInView } from "framer-motion";

const ListIcon = () => (
  <img
    src="/list-icon.webp"
    alt=""
    className="w-5 h-5 mt-1 flex-shrink-0"
    draggable={false}
  />
);

const listItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12 }
  })
};

export default function AboutBeliefSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section className="relative overflow-hidden px-2 sm:px-6 lg:px-12 py-20 md:py-28 bg-[#373535]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />
      <div className="relative z-20 max-w-7xl mx-auto w-full" ref={ref}>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 md:gap-y-20">
          {/* Who We Are */}
          <div className="max-w-2xl w-full mx-auto">
            <motion.h2
              className="text-white text-3xl md:text-4xl font-bold mb-2"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              {whoWeAre.title}
            </motion.h2>
            <motion.div
              className="h-1 w-28 bg-yellow-400 mb-8"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ originX: 0 }}
            />
            <div className="flex flex-col gap-6">
              {whoWeAre.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start"
                  custom={idx}
                  variants={listItemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <span className="mr-3 flex items-center">
                    <ListIcon />
                  </span>
                  <span className="text-white text-base md:text-lg font-medium leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
          {/* What We Believe */}
          <div className="max-w-2xl w-full mx-auto">
            <motion.h2
              className="text-white text-3xl md:text-4xl font-bold mb-2"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {whatWeBelieve.title}
            </motion.h2>
            <motion.div
              className="h-1 w-28 bg-yellow-400 mb-8"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ originX: 0 }}
            />
            <div className="flex flex-col gap-6">
              {whatWeBelieve.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start"
                  custom={idx}
                  variants={listItemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <span className="mr-3 flex items-center">
                    <ListIcon />
                  </span>
                  <span className="text-white text-base md:text-lg font-medium leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}