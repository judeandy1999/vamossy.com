'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import Button from "@/components/ui/button";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

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

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <section className="relative py-8 md:py-16 px-4 bg-gradient-to-br from-[#262626] via-gray-800 to-gray-900">
      <div className="relative max-w-3xl mx-auto">
        
        {/* Header Section */}
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={titleVariants}
        >
          <h2 className="text-xl md:text-5xl lg:text-6xl font-semibold mb-4 text-gray-100 tracking-wide">
            Contact Us
          </h2>
          <p className="font-light text-md md:text-xl lg:text-2xl text-gray-200 max-w-5xl mx-auto leading-relaxed">
            Book a free digital strategy call - open up new horizons for your business!
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={formVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-2 md:space-y-6">
            
            {/* Name Input */}
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your Name"
                className="text-sm md:text-md w-full px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl border-2 border-transparent focus:border-yellow-500 focus:outline-none text-gray-800 placeholder-gray-500 transition-all duration-300"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter a valid email address"
                className="text-sm md:text-md w-full px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl border-2 border-transparent focus:border-yellow-500 focus:outline-none text-gray-800 placeholder-gray-500 transition-all duration-300"
                required
              />
            </div>

            {/* Message Textarea */}
            <div className="mb-0">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter your Message"
                rows={6}
                className="text-sm md:text-md w-full px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl border-2 border-transparent focus:border-yellow-500 focus:outline-none text-gray-800 placeholder-gray-500 transition-all duration-300 resize-none mb-0"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button title="Submit" href="/" size="sm" />
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}