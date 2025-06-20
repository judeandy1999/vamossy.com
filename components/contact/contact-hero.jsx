"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function ContactHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section className="relative flex items-center justify-center min-h-screen h-[100vh] overflow-hidden bg-cover bg-center"
    >
      <div className="absolute inset-0 z-0" />
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
          Let’s Map Your Growth System
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl font-semibold text-white mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          This is your first step toward a more intelligent, scalable, AI-augmented growth strategy.
        </motion.p>
        <motion.p
          className="text-lg md:text-xl text-white font-medium max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          Whether you’re dealing with plateaued revenue, fragmented funnels, or too much manual work, you’re here because you know your eCommerce business can perform better — smarter. We’re here to engineer that next level with you.
        </motion.p>
      </div>
    </section>
  );
}