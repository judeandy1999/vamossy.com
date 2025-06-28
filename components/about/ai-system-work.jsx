"use client";
import React, { useRef } from "react";
import { aiSystemsWorkCards } from "../../data/data";
import AiSystemsWorkCards from "./ai-systems-work-cards";
import { motion, useInView } from "framer-motion";
import Container from "@/components/ui/container";
import Title from "@/components/ui/title";

export default function AiSystemWork() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <Container>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="mb-12"
      >
        <Title
          title="Some of our many AI Systems at Work"
          variant="h2"
          className="text-4xl md:text-5xl font-extrabold text-gray-300 text-center drop-shadow-lg"
        />
      </motion.div>
      <AiSystemsWorkCards cards={aiSystemsWorkCards} />
    </Container>
  );
}