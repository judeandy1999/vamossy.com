"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Title from "@/components/ui/title";
import Container from "@/components/ui/container";

export default function AboutHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <Container variant="transparent-gradient" className="relative flex items-center h-[100vh] overflow-hidden">
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center px-6 mx-auto"
        ref={ref}
      >
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-yellow-400 text-sm md:text-xl font-semibold tracking-wider uppercase">
            About Our Agency
          </span>
        </motion.div>
        <Title
          title="From Prompt to Profit"
          variant="h2"
          className="text-white text-4xl md:text-6xl lg:text-7xl font-bold"
          animationVariant="topToBottom"
        />
        
        <motion.p
          className="text-gray-300 text-lg md:text-xl lg:text-2xl max-w-4xl leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          We don't run campaigns — we engineer systems that scale your store with AI precision and digital growth logic.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col md:flex-row gap-8 w-full max-w-2xl mx-auto justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {[
            { number: "11+", label: "Years eCommerce Experience" },
            { number: "9+", label: "Years Digital Marketing" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center flex-1">
              <div className="text-2xl md:text-4xl font-bold text-yellow-400 mb-1">
                {stat.number}
              </div>
              <div className="text-lg md:text-xl text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </Container>
  );
}