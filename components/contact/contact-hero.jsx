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
      <div className="flex flex-col md:flex-row items-center">
        <motion.div
          className="pt-16 md:pt-0 relative z-1 h-full flex flex-col items-center md:items-start justify-start lg:max-w-[60%] md:pr-8"
          initial="hidden"
          animate="visible"
        >
          <Title
          title="Let’s Map Your Growth System"
          animationVariant="topToBottom"
          className="md:mb-6 text-white item-center md:items-start justify-start text-center md:text-left"
          />
          <Title
          variant="h5"
          title="This is your first step toward a more intelligent, scalable, AI-augmented growth strategy."
          animationVariant="leftToRight"
          className="md:mb-4 text-white item-center md:items-start justify-start text-center md:text-left"
          />
          <Title
          variant="h5"
          title="Whether you’re dealing with plateaued revenue, fragmented funnels, or too much manual work, you’re here because you know your eCommerce business can perform better — smarter. We’re here to engineer that next level with you."
          animationVariant="rightToLeft"
          className="md:mt-8 text-white item-center md:items-start justify-start text-center md:text-left"
          />
        </motion.div>
        <ContactUs size="sm" variant="gray-card" animateOnce={true} />
      </div>
    </Container>
    </>
  );
}