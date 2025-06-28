"use client";
import React from "react";
import { motion } from "framer-motion";
import Title from "@/components/ui/title";
import Container from "@/components/ui/container";
import ContactUs from "@/components/homepage/contact-us";

export default function ContactHero() {

  return (
    <>
    <Container variant="transparent-gradient" className="min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
        <motion.div
          className="pt-16 md:pt-8 lg:pt-0 relative z-1 h-full flex flex-col items-center md:items-center lg:items-start justify-start lg:max-w-[60%] lg:pr-8 px-4 md:px-6 lg:px-0"
          initial="hidden"
          animate="visible"
        >
          <Title
          title="Let's Map Your Growth System"
          animationVariant="topToBottom"
          className="mb-4 md:mb-6 text-gray-300 text-center lg:text-left"
          />
          <Title
          variant="h5"
          title="This is your first step toward a more intelligent, scalable, AI-augmented growth strategy."
          animationVariant="leftToRight"
          className="mb-4 md:mb-6 text-gray-300 text-center lg:text-left"
          />
          <Title
          variant="h5"
          title="Whether you're dealing with plateaued revenue, fragmented funnels, or too much manual work, you're here because you know your eCommerce business can perform better — smarter. We're here to engineer that next level with you."
          animationVariant="rightToLeft"
          className="mb-6 md:mb-8 lg:mt-8 text-gray-300 text-center lg:text-left"
          />
        </motion.div>
        <div className="w-full lg:w-auto lg:flex-shrink-0 px-4 md:px-6 lg:px-0">
          <ContactUs size="sm" variant="gray-card" />
        </div>
      </div>
    </Container>
    </>
  );
}