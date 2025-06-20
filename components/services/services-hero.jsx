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
    /* 
      <section className="relative bg-[#02355A] text-white p-16">
      <div className="mx-auto justify-center flex flex-col md:flex-row items-center gap-12 py-24 relative">
        {/* Left Section: Text Content */

        /*
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={leftSectionVariants}
          className="w-[60%] space-y-2"
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

        {/* Right Section: Image */

        /*
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
    */

    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4">
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Service Package Suite: <span className="text-yellow-400">AI Growth Engine</span>
        </motion.h1>
        <motion.p
          className="text-base md:text-xl font-semibold text-white mb-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          A 3-tier consulting offer from our AI-driven <span className="text-yellow-400">eCommerce Growth Agency.</span>
        </motion.p>
        <motion.p
          className="text-base md:text-xl font-semibold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        >
          Each package is fully modular, strategically differentiated, and embedded<br />
          with proprietary AI systems.
        </motion.p>
        {/* 
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={leftSectionVariants}
            className="bg-white text-black rounded-lg p-6 shadow-md w-full md:w-[30%]"
          >
            <h3 className="text-xl font-bold mb-2">Starter Package</h3>
            <p className="text-sm mb-4">
              Ideal for small businesses or startups looking to establish an online presence.
            </p>
            <a href="#" className="text-blue-500 font-semibold text-sm">
              Learn More
            </a>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={rightSectionVariants}
            className="bg-white text-black rounded-lg p-6 shadow-md w-full md:w-[30%]"
          >
            <h3 className="text-xl font-bold mb-2">Growth Package</h3>
            <p className="text-sm mb-4">
              Perfect for growing businesses aiming to enhance their digital marketing efforts.
            </p>
            <a href="#" className="text-blue-500 font-semibold text-sm">
              Learn More
            </a>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={leftSectionVariants}
            className="bg-white text-black rounded-lg p-6 shadow-md w-full md:w-[30%]"
          >
            <h3 className="text-xl font-bold mb-2">Pro Package</h3>
            <p className="text-sm mb-4">
              Comprehensive package for established businesses seeking maximum growth and ROI.
            </p>
            <a href="#" className="text-blue-500 font-semibold text-sm">
              Learn More
            </a>
          </motion.div>
        </div>
        */}
      </div>
    </section>

  );
}