"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function AboutHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, {margin: "-100px" });

  return (
    <section className="relative flex items-center justify-center min-h-screen h-[100vh] overflow-hidden">
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center px-4"
        ref={ref}
      >
        <motion.h1
          className="text-white text-4xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          “From Prompt to Profit.”
        </motion.h1>
        <motion.p
          className="text-white text-lg md:text-2xl font-semibold max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          We don’t run campaigns — we engineer systems that scale your store with
          AI precision and digital growth logic.
        </motion.p>
      </div>
    </section>
  );
}