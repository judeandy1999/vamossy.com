"use client";
import React, { useRef } from "react";
import { brandWorkWithUs } from "../../data/data";
import { motion, useInView } from "framer-motion";

function SectionCard({ title, items, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 md:p-10 hover:bg-gray-800/70 transition-all duration-300"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
    >
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {title}
        </h2>
        <div className="h-1 w-16 bg-yellow-400" />
      </div>
      
      <ul className="space-y-5">
        {items.map((item, idx) => (
          <motion.li
            key={idx}
            className="flex items-start gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
          >
            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-3 flex-shrink-0" />
            <span className="text-gray-300 text-base md:text-lg leading-relaxed">
              {item}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function BrandWorkWithUs() {
  return (
    <section className="relative py-20 md:py-28 bg-gray-800 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <SectionCard {...brandWorkWithUs.left} delay={0.1} />
          <SectionCard {...brandWorkWithUs.right} delay={0.3} />
        </div>
      </div>
    </section>
  );
}