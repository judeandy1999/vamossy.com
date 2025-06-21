'use client';

import { motion } from "framer-motion";
import { uniqueSolutions } from '@/data/data';
import { Settings, Target, Bot, ClipboardCheck, Package } from 'lucide-react';
import Title from "@/components/ui/title";

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
    <section className="relative min-h-screen py-16 lg:py-24 px-4 bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-800 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
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
                      <h3 className="lg:mb-4 text-white text-lg md:text-lg lg:text-xl font-semibold">
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
                <pre className="text-gray-800 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                  {uniqueSolutions.beforeAfter.after.code}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}