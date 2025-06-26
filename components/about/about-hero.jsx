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
        <Title
          title="About Our Agency"
          variant="h3"
          className="text-yellow-400 text-3xl md:text-5xl font-bold"
          animationVariant="topToBottom"
        />
        <Title
          title="FROM PROMPT TO PROFIT"
          variant="h2"
          className="text-white text-3xl md:text-5xl font-bold"
          animationVariant="topToBottom"
        />
        <Title
          title="We don't run campaigns — we engineer systems that scale your store with AI precision and digital growth logic."
          variant="h4"
          className="text-xl md:text-2xl leading-relaxed !mt-0"
          animationVariant="topToBottom"
        />

        <motion.div
          className="mt-8 flex flex-col max-w-4xl md:flex-row gap-2 w-full justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {[
            { number: "11+", label: "Years eCommerce Experience" },
            { number: "9+", label: "Years Digital Marketing" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="flex-1 py-8 text-center border border-yellow-400 p-6 rounded-xl bg-yellow-500/10 shadow-lg mx-1"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-yellow-400 mb-2 drop-shadow">
                {stat.number}
              </div>
              <div className="text-lg md:text-2xl text-gray-200 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </Container>
  );
}