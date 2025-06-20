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
          className="bg-[#23272f] rounded-2xl shadow-xl border border-[#2e3748] p-8 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl duration-200"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 + idx * 0.12 }}
        >
          <img
            src={card.image}
            alt={card.title}
            className="w-32 h-32 object-cover mb-6 rounded-xl border-2 border-[#1e90ff] shadow-lg"
          />
          <h3 className="text-xl font-bold text-white mb-3 text-center">{card.title}</h3>
          <p className="text-gray-300 text-center">{card.description}</p>
        </motion.div>
      ))}
    </div>
  );
}