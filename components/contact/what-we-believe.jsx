"use client";
import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Title from "@/components/ui/title";
import Container from "@/components/ui/container";
import { whatWeBelieve } from "@/data/data";

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
    <Container variant="gray-gradient" className="py-20 relative">
      
      <div className="relative z-10 mx-auto px-4">
        <Title
          variant="h2"
          title="What We Believe"
          underlineEffect={true}
          className="mb-10 text-gray-300 text-center"
        />
        <motion.div
          className="relative h-full mb-10 p-4 sm:p-8 bg-gray-800/50 backdrop-blur-sm border-2 border-yellow-500/50 rounded-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <ul className="space-y-4 sm:space-y-6">
            {items.map((item, idx) => (
              <motion.li
                key={idx}
                className="flex items-center items-center gap-3 sm:gap-4"
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={listVariants}
              >
                <div className="relative w-7 h-7 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse opacity-75"></div>
                  <div className="relative w-full h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/25">
                    <Play size={16} className="text-gray-300 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <span className="flex-1 min-w-0 text-base sm:text-lg text-gray-100 leading-snug">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        {/* Steps Section */}
        <div className="grid md:grid-cols-3 gap-8">
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
              className="flex flex-col md:-ml-5 md:flex-row items-center md:items-center justify-center relative"
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={stepVariants}
            >
              {/* Circle background with number */}
              <div
                className={`
                  w-25 h-25 md:w-28 md:h-28
                  rounded-full flex items-center justify-center
                  font-semibold text-2xl md:text-4xl
                  -z-10 md:z-0 bg-gray-600 text-yellow-500/60
                  -mb-15 md:mb-0
                  md:absolute md:left-0 md:ml-3 md:top-1/2 md:-translate-y-1/2
                `}
              >
                <span className="-mt-12 md:mt-0">{step.number}</span>
              </div>
              {/* Card */}
              <div
                className={`
                  flex items-center justify-center bg-gray-800 backdrop-blur-sm relative
                  rounded-2xl p-4 md:pt-4 border-2 border-gray-600
                  flex-col md:min-h-[140px] w-full
                  md:ml-24
                `}
              >
                <div className="font-semibold text-md mb-2 text-gray-300 text-center md:text-left">
                  {step.text}
                </div>
                {step.list && (
                  <ul className="text-sm text-gray-300 text-left">
                    {step.list.map((li, i) => (
                      <li key={i}>• {li}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
  );
}