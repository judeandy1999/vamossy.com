'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "./ui/button";
import ResultItem from "./ui/result-item";
import { categories, results } from "@/data/data";

export default function RemarkableResults() {
  const [activeCategory, setActiveCategory] = useState("Home Services");

  const activeResults = results.find(
    (result) => result.category === activeCategory
  )?.items;

  const h2Variants = {
    hidden: { opacity: 0, y: -170 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 170 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 50, x: 170 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-[80%] mx-auto text-center">

        <motion.h2
          className="text-[78px] font-semibold mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={h2Variants}
        >
          Remarkable Results
        </motion.h2>

        <motion.div
          className="bg-white px-12 py-4 shadow-sm rounded-sm flex justify-center mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={contentVariants}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-2xl ${
                activeCategory === category
                  ? "text-yellow-500 border-b-2 border-yellow-500"
                  : "text-black hover:text-yellow-500"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={contentVariants}
        >
          {activeResults?.map((item, index) => (
            <ResultItem key={index} resultItem={item} index={index} />
          ))}
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={buttonVariants}
        >
          <Button title={`${activeCategory} Marketing`} href="/" />
        </motion.div>
      </div>
    </section>
  );
}