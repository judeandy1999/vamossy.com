'use client';
import { motion } from 'framer-motion';
import Title from '@/components/ui/title';  
import Container from "@/components/ui/container";

export default function ConsultingHero() {

  return (
    <Container variant="transparent" className="h-[100vh]">
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        initial="hidden"
        animate="visible"
      >
        <Title variant="h2" title="Strategic Intelligence &amp; Growth Enablement for AI-Driven Brands" className="text-white text-3xl md:text-6xl lg:text-7xl font-bold" />
        <Title variant="h3" title="We specialize in diagnosing complex business challenges and delivering high-performance solutions at the intersection of AI, ecommerce, and digital strategy. Complexity into Clarity" />
        <Title variant="h5" title="Our consulting division is designed for brands seeking to evolve intelligently — not just scale blindly." />
        <Title variant="h5" title="We don't offer generic playbooks. We engineer outcomes." />

      </motion.div>
    </Container>
  );
}