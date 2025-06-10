'use client';
import Image from "next/image";
import { motion } from 'framer-motion';

export default function ServicesHero() {

  const leftSectionVariants = {
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

  const rightSectionVariants = {
    hidden: { opacity: 0, },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: 'easeOut',
        delay: 0.5,
      },
    },
  };

  return (
    <section className="relative bg-[#02355A] text-white p-16">
      <div className="mx-auto justify-center flex flex-col md:flex-row items-center gap-12 py-24 relative">
        {/* Left Section: Text Content */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={leftSectionVariants}
          className="w-[60%] space-y-2 z-10"
        >
          <p className="text-yellow-400 text-[20px] font-semibold">
            Grow Your Business With Scalable Digital Marketing
          </p>
          <h1 className="text-[68px] font-semibold leading-tight">
            Outsmart the competition with best-in-class digital marketing services
          </h1>
          <p className="text-[20px] text-gray-200">
            Get more traffic. Acquire more customers. Sell more stuff. SmartSites
            offers proven strategies & reliable execution to exceed your marketing
            goals.
          </p>
        </motion.div>

        {/* Right Section: Image */}
        <motion.div 
          className="w-[40%]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={rightSectionVariants}
        >
          <div className="absolute w-[750px] h-[750px] left-[50%] top-[4.5rem]">
            <Image
              width={1200}
              height={1200}
              src="/digital-marketing-services-banner-hero.webp"
              alt="Digital Marketing Analytics"
              className="w-full h-auto"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}