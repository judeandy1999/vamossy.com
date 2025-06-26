"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function AiSystemsWorkCards({ cards }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <div
      ref={ref}
      className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 flex flex-col items-center shadow-lg hover:shadow-yellow-400/20 transition-all duration-300 hover:-translate-y-2"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 + idx * 0.12 }}
        >
          <div className="w-38 h-38 mb-6 rounded-xl border-2 border-yellow-400/60 shadow-yellow-400/20 shadow-lg overflow-hidden flex items-center justify-center bg-gray-900/80">
            <img
              src={card.image}
              alt={card.title}
              className="object-cover w-full h-full"
              draggable={false}
            />
          </div>
          <h3 className="text-white text-2xl md:text-3xl font-semibold mb-3 text-center leading-tight">
            {card.title}
          </h3>
          <p className="text-gray-300 text-base md:text-lg text-center font-light">
            {card.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}