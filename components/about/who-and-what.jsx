"use client";
import React, { useRef } from "react";
import { whoWeAre, whatWeBelieve } from "@/data/data";
import { motion, useInView } from "framer-motion";
import Container from "@/components/ui/container";
import Title from "@/components/ui/title";

const ListIcon = () => (
  <img
    src="/list-icon.webp"
    alt=""
    className="w-5 h-5 mt-1 flex-shrink-0"
    draggable={false}
  />
);

const listItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12 }
  })
};

export default function AboutBeliefSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <Container variant="gray-gradient" className="py-20 md:py-28">
      <div className="relative z-20 mx-auto w-full" ref={ref}>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 md:gap-y-20 relative">
          {/* Center vertical line */}
          <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-yellow-400/70 via-yellow-400/30 to-yellow-400/70 opacity-80" />
          {/* Who We Are */}
          <div className="max-w-2xl w-full mx-auto">
            <Title
              title={whoWeAre.title}
              variant="h2"
              underlineEffect={true}
              className="mb-2"
            />
            <div className="flex flex-col gap-6">
              {whoWeAre.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start"
                  custom={idx}
                  variants={listItemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <span className="mr-3 flex items-center">
                    <ListIcon />
                  </span>
                  <span className="text-white text-base md:text-lg font-medium leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
          {/* What We Believe */}
          <div className="max-w-2xl w-full mx-auto">
            <Title
              title={whatWeBelieve.title}
              variant="h2"
              underlineEffect={true}
              className="mb-2"
            />
            <div className="flex flex-col gap-6">
              {whatWeBelieve.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start"
                  custom={idx}
                  variants={listItemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <span className="mr-3 flex items-center">
                    <ListIcon />
                  </span>
                  <span className="text-white text-base md:text-lg font-medium leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}