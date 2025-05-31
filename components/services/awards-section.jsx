'use client';
import Image from "next/image";
import { motion } from 'framer-motion';

export default function AwardsSection() {
  const zoomInVariants = {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  const rightSectionVariants = {
    hidden: { opacity: 0, x: -200 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="py-16 px-8 bg-white">
      <div className="mx-auto justify-center flex flex-col md:flex-row items-center gap-0">
        {/* Left Section: Awards */}
        <motion.div 
          className="w-1/2 flex flex-wrap justify-center justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={zoomInVariants}
        >
          <Image
            src="/smartsites-service-rated-badges.webp"
            alt="Top 3 Website Design 2024"
            width={600}
            height={600}
          />
        </motion.div>

        {/* Right Section: Text Content */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={rightSectionVariants}
          className="w-1/2 space-y-6 text-center md:text-left"
        >
          <p className="text-[#02355A] font-semibold text-[20px]">
            America’s #1 Rated Digital Marketing Agency
          </p>
          <h2 className="text-[58px] font-semibold leading-tight">
            With SmartSites, you get the best services, processes, and people to grow your business.
          </h2>
        </motion.div>
      </div>
    </section>
  );
}