'use client';
import { motion } from 'framer-motion';
import Title from '@/components/ui/title';  
import Container from "@/components/ui/container";

export default function ConsultingHero() {

  return (
    <Container variant="transparent" className="min-h-[100vh] md:h-[100vh]">
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-6 py-16 md:py-0"
        initial="hidden"
        animate="visible"
      >
        <Title 
            variant="h2" 
            title="Strategic Intelligence &amp; Growth Enablement for AI-Driven Brands" 
            className="text-gray-300 text-2xl sm:text-3xl md:text-5xl font-semibold mb-4 md:mb-6" 
        />
        <Title 
            className='text-gray-300 text-lg sm:text-xl md:text-3xl lg:text-4xl font-normal mb-4 md:mb-6'
            variant="h3" 
            title="We specialize in diagnosing complex business challenges and delivering high-performance solutions at the intersection of AI, ecommerce, and digital strategy. Complexity into Clarity" 
        />
        <Title 
            className='text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-3 md:mb-4 max-w-4xl'
            variant="h4" 
            title="Our consulting division is designed for brands seeking to evolve intelligently — not just scale blindly." 
        />
        <Title 
            className='text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-4 md:mb-6 max-w-4xl'
            variant="h4" 
            title="We don't offer generic playbooks. We engineer outcomes." 
        />

      </motion.div>
    </Container>
  );
}