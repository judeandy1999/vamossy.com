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
      className="bg-[#23272f] rounded-2xl shadow-xl p-6 md:p-8 flex-1 w-full mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{title}</h2>
      <div className="h-1 w-16 bg-yellow-400 mb-6" />
      <ul className="flex flex-col gap-5">
        {items.map((item, idx) => (
          <motion.li
            key={idx}
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + idx * 0.08 }}
          >
            <img
              src="/list-icon.webp"
              alt=""
              className="mt-1 w-5 h-5 min-w-5 min-h-5"
              style={{ filter: "brightness(1.2)" }}
            />
            <span className="text-white text-base md:text-lg">{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function BrandWorkWithUs() {
  return (
    <section className="w-full bg-[#181818] min-h-screen flex items-center py-10 px-2 md:py-16 md:px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-y-8 md:flex-row md:gap-16 w-full">
        <SectionCard {...brandWorkWithUs.left} delay={0.1} />
        <SectionCard {...brandWorkWithUs.right} delay={0.3} />
      </div>
    </section>
  );
}