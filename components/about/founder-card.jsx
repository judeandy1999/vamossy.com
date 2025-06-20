"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function FounderCard({ founder }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-transparent px-2">
      <div className="h-8" />
      <motion.h2
        className="text-3xl md:text-5xl font-extrabold mb-8 md:mb-10 text-yellow-400 drop-shadow text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
        ref={ref}
      >
        MEET THE FOUNDER
      </motion.h2>
      {/* Card */}
      <motion.div
        className="flex flex-col md:flex-row items-center w-full max-w-4xl gap-6 md:gap-8 bg-[#23272f]/95 rounded-2xl shadow-2xl px-4 md:px-16 py-6 md:py-10"
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="flex-shrink-0 mb-6 md:mb-0 flex justify-center w-full md:w-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div
            className="relative rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-xl bg-black w-48 h-60 md:w-64 md:h-90"
            style={{ aspectRatio: "4/5" }}
          >
            <Image
              src={founder.image}
              alt={founder.name}
              fill
              className="object-cover"
              style={{ objectPosition: "center 5%" }}
              priority
            />
          </div>
        </motion.div>
        {/* Card Content */}
        <motion.div
          className="flex-1 flex flex-col justify-center w-full"
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-white leading-snug">
            “Hi, I’m {founder.name}. {founder.intro}”
          </p>
          <p className="text-sm md:text-base mb-4 md:mb-6 text-gray-200 whitespace-pre-line leading-relaxed">
            {founder.bio}
          </p>
          <p className="text-yellow-400 font-bold text-base md:text-lg drop-shadow">
            {founder.closing}
          </p>
        </motion.div>
      </motion.div>
      <div className="h-8" />
    </section>
  );
}