"use client";
import { agencyComparison } from "../../data/data";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Compare() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section className="relative py-20 md:py-28 bg-gray-900 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {agencyComparison.title}
          </h2>
          <div className="h-1 w-20 bg-yellow-400 mx-auto mb-6" />
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            {agencyComparison.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agencyComparison.columns.map((col, idx) => (
            <motion.div
              key={col.heading}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + idx * 0.1 }}
            >
              <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                  {col.heading}
                </h3>
                <div className="w-12 h-0.5 bg-yellow-400 mx-auto" />
              </div>

              <ul className="space-y-4">
                {col.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3"
                  >
                    <span className={`text-lg mt-0.5 ${
                      item.type === "good" 
                        ? "text-green-400" 
                        : "text-red-400"
                    }`}>
                      {item.type === "good" ? "✓" : "✗"}
                    </span>
                    <span className={`text-base leading-relaxed ${
                      item.type === "good" 
                        ? "text-white" 
                        : "text-gray-400"
                    }`}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}