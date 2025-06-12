'use client';
import { motion } from "framer-motion";
import { features } from "@/data/data";
import Button from "@/components/ui/button";

export default function MarketingFeatures() {

  const titleVariants = {
    hidden: { opacity: 0, y: -80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.4,
      },
    },
  };

  const featuresVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="min-h-[60vh] flex items-center bg-gradient-to-br from-[#333] via-gray-800 to-gray-900 text-gray-100 py-16 px-8">
      <div className="max-w-6xl mx-auto text-center mt-8">
        <motion.h2
          className="text-xl md:text-5xl lg:text-6xl font-semibold mb-4 md:mg-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={titleVariants}
        >
          Capabilities: Full Stack eCommerce Digital Marketing 
        </motion.h2>
        <motion.p 
          className="font-light text-md md:text-xl lg:text-2xl text-gray-200 max-w-6xl mx-auto text-gray-200 mb-4 md:mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={titleVariants}
        > 
          Through precision, intelligence, and automated innovation, we replace guesswork with systems thinking—unifying AI-powered automation and strategic insight to unlock breakthrough growth.
        </motion.p>
        <motion.div
          className="grid grid-cols-1 grid-cols-1 md:grid-cols-4 gap-8 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={featuresVariants}
              className="flex justify-around border-2 lg:border-4 rounded-xl border-yellow-500/80 py-6 px-2 lg:py-8 lg:px-4 flex flex-col items-center text-center lg:space-y-4"
            >
              <div className="relative">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-40 h-40 object-cover rounded-xl shadow-md mb-4"
                />
                <div className="absolute inset-0 bg-black/25 rounded-xl mb-8"></div>
              </div>
              {/* <h3 className="text-[30px] font-semibold">{feature.title}</h3> */}
              <p className="text-md md:text-xl px-4 lg:px-2 text-gray-300">{feature.description}</p>
              <Button title="Learn More" href="/" size="sm" />
            </motion.div>
          ))}
        </motion.div>
        <motion.p 
          className="text-md md:text-xl lg:text-2xl mt-4 font-light text-gray-200 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={featuresVariants}
        > 
          We create customized strategies, tactics, playbooks, audits, unique deliverables, and more. As an example, we can deliver tailored, complex prompt chain packages, personally customized one-by-one for each of your employees, to boost their productivity.
          <br />
          <br />
          We take care from one-task projects to complete marketing overhauls. Once the improvements are specified, we support implementation, or in some cases even do them for you. 
        </motion.p>
      </div>
    </section>
  );
}