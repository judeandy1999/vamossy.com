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
    <section className="min-h-[60vh] flex items-center bg-[#333] text-gray-100 py-16 px-8">
      <div className="max-w-6xl mx-auto text-center mt-8">
        <motion.h2
          className="text-xl md:text-5xl lg:text-6xl font-semibold mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={titleVariants}
        >
          AI-Driven Full Stack E-commerce Digital Marketing Solution
        </motion.h2>
        <motion.p 
          className="text-md md:text-xl lg:text-2xl mt-4 font-light text-gray-200 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={titleVariants}
        > 
          We deliver solutions and find improvements in any realm of Ecommerce Digital Marketing. Our goal is to make our clients market leaders in the shortest time frame possible. We can help with unique issues and goals, or we can fully transform your digital marketing to a growth machine, while equipping your marketing team with cutting edge knowledge.
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
              className="border-2 lg:border-4 rounded-xl border-[#a87b00] py-6 px-2 lg:py-8 lg:px-4 flex flex-col items-center text-center lg:space-y-4"
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
          These solutions are made possible by our own competitive intelligence system, providing us deep insight in any area of your marketing. Sceptical? Request any custom audit!
          <br />
          <br />
          Through precision, intelligence, and automated innovation, we replace guesswork with systems thinking -unifying Al-powered automation and strategic insight to unlock breakthrough growth.       
        </motion.p>
      </div>
    </section>
  );
}