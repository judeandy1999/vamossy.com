'use client';

import { motion } from "framer-motion";
import { uniqueSolutions } from '@/data/data';
import { atomicaAfterData } from '@/data/data'; // Add this import
import { Settings, Target, Bot, ClipboardCheck, Package } from 'lucide-react';
import Title from "@/components/ui/title";
import Container from "@/components/ui/container";

export default function UniqueSolutions() {
  const iconMap = {
    "🔧": Settings,
    "🎯": Target, 
    "🤖": Bot,
    "📋": ClipboardCheck,
    "📦": Package
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const codeVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <Container variant="transparent-gradient">
      {/* Title */}
      <Title title={uniqueSolutions.title} variant="h2"/>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Features */}
        <motion.div
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
        >
          {uniqueSolutions.features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <motion.div
                key={index}
                className="group"
                variants={featureVariants}
              >
                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center flex-shrink-0">
                    {IconComponent ? (
                      <IconComponent className="text-gray-900" size={24} />
                    ) : (
                      <span className="text-2xl">{feature.icon}</span>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="lg:mb-4 text-gray-300 text-lg md:text-lg lg:text-xl font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-md md:text-lg lg:text-xl font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Right Side - Before/After Code */}
        <motion.div
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
        >
          {/* Before Section */}
          <motion.div
            className="bg-yellow-500 rounded-2xl p-4"
            variants={codeVariants}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {uniqueSolutions.beforeAfter.before.title}
            </h3>
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">prompt</span>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600 text-sm">Copy</button>
                  <button className="text-gray-400 hover:text-gray-600 text-sm">Edit</button>
                </div>
              </div>
              <pre className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {uniqueSolutions.beforeAfter.before.code}
              </pre>
            </div>
          </motion.div>

          {/* After Section */}
          <motion.div
            className="bg-yellow-500 rounded-2xl p-4"
            variants={codeVariants}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {uniqueSolutions.beforeAfter.after.title}
            </h3>
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-xs">prompt</span>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600 text-xs">Copy</button>
                  <button className="text-gray-400 hover:text-gray-600 text-xs">Edit</button>
                </div>
              </div>
              <pre
                className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-mono overflow-y-auto"
                style={{ maxHeight: 340 }}
              >
                {atomicaAfterData}
              </pre>
            </div>
          </motion.div>
        </motion.div>
      </div>
  </Container>
  );
}