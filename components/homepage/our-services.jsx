'use client';

import { motion } from "framer-motion";
import { ourServices } from "@/data/data";
import Button from "@/components/ui/button";

export default function OurServices() {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
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

  return (
    <section className="relative min-h-screen py-20 px-4 bg-transparent">

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={titleVariants}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8">
            OUR SERVICES
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto">
            Our service range covers the entire field of eCommerce Digital Marketing. Feel free to ask for custom requests!
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
        >
          {ourServices.map((service, index) => (
            <motion.div
              key={index}
              className="group relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-700/80 transition-all duration-300"
              variants={cardVariants}
            >
              {/* Service Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center group-hover:bg-yellow-400 transition-colors duration-300">
                  <img 
                    src={service.icon} 
                    alt={service.title}
                    className="w-12 h-12 object-contain filter brightness-0"
                  />
                </div>
              </div>

              {/* Service Content */}
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                  {service.description}
                </p>
                
                {/* CTA Button */}
                <Button 
                  title="Learn More" 
                  href="/services" 
                  size="sm"
                />
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-yellow-500/50 transition-all duration-300"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={titleVariants}
        >
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Ready to take your business to the next level?
          </p>
          <Button 
            title="Get Started Today" 
            href="/contact" 
            size="lg"
          />
        </motion.div>
      </div>
    </section>
  );
}