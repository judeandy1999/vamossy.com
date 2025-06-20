'use client';
import { motion } from 'framer-motion';

export default function ConsultingHero() {
  const h1Variants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  const subheadingVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.2,
        ease: 'easeOut',
      },
    },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="relative text-gray-100 h-[100vh] w-full overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm"></div>
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-xl md:text-5xl lg:text-6xl font-semibold md:max-w-[80%] leading-tight"
          variants={h1Variants}
        >
          Strategic Intelligence &amp; Growth Enablement for AI-Driven Brands
        </motion.h1>
        
        <motion.h4
          className="lg:mt-8 text-gray-200 text-md md:text-xl lg:text-2xl mt-4 font-light md:max-w-[60%] leading-tight"
          variants={subheadingVariants}
        >
          We specialize in diagnosing complex business challenges and delivering high-performance solutions at the intersection of AI, ecommerce, and digital strategy.
        </motion.h4>
        <motion.p
          className="lg:mt-4 text-gray-200 text-md md:text-xl lg:text-2xl mt-4 font-light md:max-w-[60%] leading-tight"
          variants={paragraphVariants}
        >
          Our consulting division is designed for brands seeking to evolve intelligently — not just scale blindly.<br />
          <span className="font-semibold text-yellow-400">We don't offer generic playbooks. We engineer outcomes.</span>
        </motion.p>
      </motion.div>
      <div className="absolute bottom-0 left-0 w-full h-52 bg-gradient-to-b from-transparent to-[#262626] z-10"></div>
    </section>
  );
}