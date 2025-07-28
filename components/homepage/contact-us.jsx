'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import Container from "@/components/ui/container";
import { useContactForm } from "@/hooks/useContactForm";

export default function ContactUs({ variant, size = 'lg', cardVariant }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [localError, setLocalError] = useState("");

  const { submitContactForm, loading, error, success, resetForm } = useContactForm();

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

  const getTitleSize = (size) => {
    switch (size) {
      case 'sm':
        return 'text-2xl md:text-3xl lg:text-3xl';
      case 'md':
        return 'text-lg md:text-3xl lg:text-5xl';
      case 'lg':
        return 'text-xl md:text-5xl lg:text-6xl';
    }
  };

  const getSubTitleSize = (size) => {
    switch (size) {
      case 'sm':
        return 'text-sm md:text-lg lg:text-xl';
      case 'md':
        return 'text-sm md:text-lg lg:text-xl';
      case 'lg':
        return 'text-md md:text-xl lg:text-2xl';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setLocalError(""); // Clear local error on input change
  };

  // Email validation helper
  const isValidEmail = (email) => {
    // Require at least two characters for TLD (e.g., .com, .net)
    return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side email validation
    if (!isValidEmail(formData.email)) {
      setLocalError('Invalid email!');
      return;
    }

    try {
      const result = await submitContactForm(formData);
      if (result.success) {
        setTimeout(() => {
          setFormData({ name: '', email: '', message: '' });
          resetForm();
        }, 3000);
      }
    } catch (err) {
      
    }
  };
  
  variant = variant || 'transparent-gradient';
  cardVariant = cardVariant || 'normal';
  return (
    <Container variant={variant}>
      <div className="relative mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-4 md:mb-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={titleVariants}
        >
          <h2 className={`${getTitleSize(size)} font-semibold mb-2 text-gray-100 tracking-wide`}>
            Contact Us
          </h2>
          <p className={`${getSubTitleSize(size)} font-light text-gray-200 max-w-5xl mx-auto leading-relaxed`}>
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

            {/* Status Messages */}
            {success && (
              <div className="text-center p-3 bg-green-100/90 backdrop-blur-sm rounded-xl border border-green-200">
                <p className="text-green-700 text-sm font-medium">Thank you! Your message has been sent successfully.</p>
              </div>
            )}
            
            {error && (
              <div className="text-center p-3 bg-red-100/90 backdrop-blur-sm rounded-xl border border-red-200">
                <p className="text-red-700 text-sm font-medium">Error: {error}</p>
              </div>
            )}

            {localError && (
              <div className="text-center p-3 bg-red-100/90 backdrop-blur-sm rounded-xl border border-red-200">
                <p className="text-red-700 text-sm font-medium">{localError}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Container>
  );
}