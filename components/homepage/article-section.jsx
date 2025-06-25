'use client';

import { motion } from "framer-motion";
import { liveCaseStudies } from "@/data/data";
import Container from "@/components/ui/container";
import Title from "@/components/ui/title";

export default function LiveCaseStudies() {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Split case studies into left and right columns
  const leftStudies = liveCaseStudies.caseStudies.slice(0, 3);
  const rightStudies = liveCaseStudies.caseStudies.slice(3, 6);

  return (
    <Container variant="gray-gradient" className="relative">
        {/* Background tech overlay */}
        <div
          className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/homepage/tech-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      ></div>
      
      
      <div className="relative mx-auto">
        {/* Header Section */}

        <Title variant="h2" title={liveCaseStudies.title} className="text-shadow-sm text-xl md:text-5xl lg:text-6xl font-semibold text-gray-100"/>
        <Title variant="h5" title={liveCaseStudies.subtitle} className="text-shadow-sm mx-auto text-md md:text-xl lg:text-2xl mt-4 font-light text-gray-200 !mb-8 max-w-5xl"/>
        
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Left Column - Case Studies */}
          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={containerVariants}
          >
            {leftStudies.map((study, index) => (
              <motion.div
                key={study.id}
                className="group"
                variants={cardVariants}
              >
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {study.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {study.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Middle Column - Tech Image */}
          <motion.div
            className="relative hidden md:flex justify-center items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={imageVariants}
          >
            <div className="relative w-full max-w-md">
                
                {/* Person silhouette */}
                <motion.div
                  className="relative flex justify-center items-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                  variants={imageVariants}
                >
                  <div className="relative w-full max-w-md">
                    <img
                      src="/homepage/case-study.webp"
                      alt="Case Study Visualization"
                      className="w-full h-auto rounded-2xl shadow-2xl"
                    />
                  </div>
                </motion.div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl -z-10"></div>
          </motion.div>

          {/* Right Column - Case Studies */}
          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={containerVariants}
          >
            {rightStudies.map((study, index) => (
              <motion.div
                key={study.id}
                className="group"
                variants={cardVariants}
              >
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 ">
                  <h3 className="text-xl font-bold text-white mb-3 ">
                    {study.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {study.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Container>
  );
}