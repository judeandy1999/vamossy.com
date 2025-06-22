"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Title from "@/components/ui/title";
import Container from "@/components/ui/container";

export default function ContactHero() {

  return (
    <Container variant="transparent" className="h-[100vh] min-h-screen flex items-center justify-center relative overflow-hidden">
      
      {/* Content */}
      <motion.div
          className="relative z-1 h-full flex flex-col items-center justify-center"
          initial="hidden"
          animate="visible"
        >
        <Title
          title="Let’s Map Your Growth System"
          animationVariant="topToBottom"
          className="mb-6 text-white"
        />
        <Title
          variant="h4"
          title="This is your first step toward a more intelligent, scalable, AI-augmented growth strategy."
          animationVariant="leftToRight"
          className="mb-4 text-white"
        />
        <Title
          variant="h4"
          title="Whether you’re dealing with plateaued revenue, fragmented funnels, or too much manual work, you’re here because you know your eCommerce business can perform better — smarter. We’re here to engineer that next level with you."
          animationVariant="rightToLeft"
          className="mt-8 text-white"
        />
      </motion.div>
    </Container>
  );
}