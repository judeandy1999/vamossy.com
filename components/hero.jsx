'use client';
import { Typewriter } from "react-simple-typewriter";
import { motion } from 'framer-motion';
import Button from './ui/button';

export default function Hero() {
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

  const h4Variants = {
    hidden: { opacity: 0, x: 500 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: -400 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'linear',
        delay: 0.2,
      },
    },
  };

  return (
    <section className="relative h-[100vh] w-full overflow-hidden">
      <div className="absolute bg-[#333] inset-0 z-0">
        <div className="absolute inset-0 bg-[#333]"></div>
      </div>
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white"
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-[68px] font-light max-w-[70%] leading-tight"
          variants={h1Variants}
        >
          AI-Powered Growth Systems
        </motion.h1>
        <motion.h1
          className="text-[68px] font-bold max-w-[50%] leading-tight"
          variants={h1Variants}
        >
          for eCommerce Brands
        </motion.h1>
        <motion.h4 
          className="text-[30px] font-light max-w-[60%] leading-tight"
          variants={h4Variants}
        >
          <Typewriter
            words={[
              "We help you scale smarter with data-infused strategies. Narrative clarity and automated execution. Delivered at the speed of intelligence.",
            ]}
            cursor
            cursorStyle="|"
            typeSpeed={50}
            deleteSpeed={30}
            delaySpeed={2000}
          />
        </motion.h4>
        <motion.div
          variants={buttonVariants}
        >
          <Button title="Book a free strategy call" href="/"/>
        </motion.div>
      </motion.div>
    </section>
  );
}
