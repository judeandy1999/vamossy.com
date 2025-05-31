'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/button';

export default function TeamSection() {
  const zoomInVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="flex justify-center flex-col md:flex-row items-center gap-8 px-24 py-16 bg-white">

      <motion.div
        className="max-w-[40%] md:w-1/2 space-y-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        variants={zoomInVariants}
      >
        <h2 className="text-[68px] font-bold text-gray-800 leading-tight">
          The team you need to succeed
        </h2>
        <p className="text-gray-600 text-[30px] leading-relaxed">
          Fueled by passion and a commitment to our clients, our team of over 100 digital experts drives performance for small businesses and Fortune 500 companies alike.
        </p>
        <Button title="Discover SmartSites" href="/" size="sm" />
      </motion.div>


      <motion.div
        className="max-w-[60%] md:w-1/2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        variants={zoomInVariants}
      >
        <img
          src="/smartsites-digital-experts.jpg"
          alt="Our Team"
          className="w-full h-auto"
        />
      </motion.div>
    </section>
  );
}