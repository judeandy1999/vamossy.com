"use client";
import React, { useRef } from "react";
import { aiSystemsWorkCards } from "../../data/data";
import AiSystemsWorkCards from "./ai-systems-work-cards";
import { motion, useInView } from "framer-motion";

export default function AiSystemWork() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section className="w-full min-h-screen py-16 px-4 mt-10">
      <motion.h2
        ref={ref}
        className="text-4xl md:text-5xl font-extrabold text-white text-center mb-12 drop-shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        Some of our many AI Systems at Work
      </motion.h2>
      <AiSystemsWorkCards cards={aiSystemsWorkCards} />
    </section>
  );
}