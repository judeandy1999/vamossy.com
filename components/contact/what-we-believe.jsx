"use client";
import React from "react";
import { motion } from "framer-motion";
import Title from "@/components/ui/title";
import Container from "@/components/ui/container";
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
    <Container variant="gray" className="py-20 relative">
      
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <Title
          variant="h2"
          title="What We Believe"
          underlineEffect={true}
          className="mb-10 text-white text-center"
        />
        <motion.div
          className="relative h-full mb-10 p-8 bg-gray-800/50 backdrop-blur-sm border-2 border-yellow-500 rounded-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <ul className="space-y-6">
            {items.map((item, idx) => (
              <motion.li
                key={idx}
                className="flex items-start gap-4"
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={listVariants}
              >
                <img
                  src={bulletIcon}
                  alt=""
                  className="mt-1 w-5 h-5"
                  style={{ minWidth: 20 }}
                  loading="lazy"
                />
                <span className="text-base md:text-lg text-gray-100">
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
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 flex flex-col items-center border border-yellow-400"
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={stepVariants}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-yellow-400 text-xl font-bold rounded-full mb-4 text-black shadow">
                {step.number}
              </div>
              <div className="text-center font-semibold mb-2 text-white">
                {step.text}
              </div>
              {step.list && (
                <ul className="text-left mt-2 space-y-1 text-sm text-gray-100">
                  {step.list.map((li, i) => (
                    <li key={i}>• {li}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
  );
}