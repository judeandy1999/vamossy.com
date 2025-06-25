"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function AboutHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section className="relative flex items-center justify-center min-h-screen h-[100vh] overflow-hidden">
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto"
        ref={ref}
      >
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-yellow-400 text-sm md:text-base font-semibold tracking-wider uppercase">
            About Our Agency
          </span>
        </motion.div>
        
        <motion.h1
          className="text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          From Prompt to Profit
        </motion.h1>
        
        <motion.p
          className="text-gray-300 text-lg md:text-xl lg:text-2xl max-w-4xl leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          We don't run campaigns — we engineer AI-powered growth systems that scale eCommerce brands with precision, strategy, and measurable results.
        </motion.p>

        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {[
            { number: "11+", label: "Years eCommerce Experience" },
            { number: "9+", label: "Years Digital Marketing" },
            { number: "100%", label: "AI-Powered Approach" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}