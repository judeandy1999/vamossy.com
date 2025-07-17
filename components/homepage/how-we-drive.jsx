
'use client';

import { motion } from "framer-motion";
import { Play } from 'lucide-react';
import { clientTypes, growthSteps } from '@/data/data';
import Title from "@/components/ui/title";
import Container from "@/components/ui/container";

export default function HowWeDrive() {

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -70 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const arrowVariants = {
    hidden: { opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      style={{
        background: '#1c1c1c',
background: 'linear-gradient(95deg, #0c111c 0%, #0d0d1b 50%, #0c111c 100%)',
      }}
      className="flex flex-col w-full h-full flex items-center justify-center overflow-hidden"
    >
      <div className="mt-8 mb-8 text-center md:text-right">
        <Title title="How We Drive Growth" variant="h2" />
      </div>

      <motion.div
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
      >
        {growthSteps.map((step, index) => (
          <motion.div
            key={index}
            className="group"
            variants={cardVariants}
          >
            <div className="relative h-full p-8 bg-gray-800/50 backdrop-blur-sm border-2 border-yellow-500 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-yellow-600/5 rounded-2xl opacity-0"></div>
              
              <div className="relative w-7 h-7 lg:w-12 lg:h-12 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center mb-2 lg:mb-6 shadow-lg shadow-yellow-500/25">
                <span className="text-lg md:text-xl font-semibold text-gray-900">{step.number}</span>
              </div>
              
              <h3 className="lg:mb-4 text-gray-300 text-lg md:text-lg lg:text-xl font-semibold">
                {step.title}
              </h3>
              
              <p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">
                {step.description}
              </p>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent scale-x-0"></div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}