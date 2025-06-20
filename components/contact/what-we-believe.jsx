"use client";
import React from "react";
import { motion } from "framer-motion";
import { whatWeBelieve } from "../../data/data";

const bulletIcon = "/list-icon.webp";

const listVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, type: "spring", stiffness: 80 },
  }),
};

const stepVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: 0.5 + i * 0.2, type: "spring", stiffness: 80 },
  }),
};

export default function WhatWeBelieve() {
  const items = whatWeBelieve?.items || [];

  return (
    <section className="w-full py-16 bg-[#232323]">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3 text-white"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="border-l-4 border-yellow-400 pl-3">
            What We Believe
          </span>
        </motion.h2>
        <div className="bg-[#323232] rounded-xl shadow-lg p-6 md:p-10 mb-10">
          <ul className="space-y-6">
            {items.map((item, idx) => (
              <motion.li
                key={idx}
                className="flex items-start gap-4"
                custom={idx}
                initial="hidden"
                whileInView="visible"
                variants={listVariants}
              >
                <img
                  src={bulletIcon}
                  alt=""
                  className="mt-1 w-5 h-5"
                  style={{ minWidth: 20 }}
                  loading="lazy"
                />
                <span className="text-base md:text-lg text-white">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
        {/* Steps Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {(whatWeBelieve?.steps || [
            {
              number: 1,
              text: "A strategist reads your submission — not a bot.",
            },
            {
              number: 2,
              text: "We triage your goals using our GPT-powered intake layer.",
            },
            {
              number: 3,
              text: "You’ll receive one of the following:",
              list: [
                "A request to book a free strategic blueprint call",
                "A guided async audit brief request",
                "A response from our lead growth architect, Gergo",
              ],
            },
          ]).map((step, idx) => (
            <motion.div
              key={idx}
              className="bg-[#323232] rounded-xl shadow-md p-6 flex flex-col items-center border border-yellow-400"
              custom={idx}
              initial="hidden"
              whileInView="visible"
              variants={stepVariants}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-yellow-400 text-xl font-bold rounded-full mb-4 text-black">
                {step.number}
              </div>
              <div className="text-center font-semibold mb-2 text-white">
                {step.text}
              </div>
              {step.list && (
                <ul className="text-left mt-2 space-y-1 text-sm text-white">
                  {step.list.map((li, i) => (
                    <li key={i}>• {li}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}