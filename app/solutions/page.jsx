'use client';
import { motion } from 'framer-motion';
import { Clock, Bell, ArrowRight, Award, Target, Zap, Shield } from 'lucide-react';
import { useState } from 'react';

export default function SolutionsPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add your email subscription logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const upcomingFeatures = [
    {
      icon: Target,
      title: "AI-Powered Market Analysis",
      description: "Deep dive into your competition and market opportunities using advanced AI algorithms.",
      color: "#025965"
    },
    {
      icon: Zap,
      title: "Automated Growth Funnels",
      description: "Set up conversion-optimized funnels that work 24/7 to grow your supplement business.",
      color: "#85bd41"
    },
    {
      icon: Shield,
      title: "Compliance Management",
      description: "Stay compliant with FDA regulations and advertising guidelines automatically.",
      color: "#025965"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gray-50 pt-16 overflow-hidden">
        {/* Dotted Background Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, #63676cff 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            {/* Clock Icon */}
            <motion.div
              variants={itemVariants}
              className="w-24 h-24 bg-[#85bd41] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
            >
              <Clock size={48} className="text-white" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#222222] mb-6 leading-[1.1] tracking-tight"
            >
              Revolutionary{' '}
              <span className="relative text-[#025965]">
                DTC Solutions
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="absolute bottom-2 left-0 right-0 h-4 bg-[#B5C9B8] -z-10 rounded-full"
                />
              </span>
              <br />
              <span className="text-[#3A3A3A]">Are Almost Here</span>
            </motion.h1>

            {/* Value Proposition */}
            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-[#3A3A3A] mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            >
              We're building game-changing AI-powered solutions specifically for DTC supplement brands. 
              <span className="font-semibold text-[#222222]"> Be the first to know</span> when we launch 
              our revolutionary growth platform.
            </motion.p>

            {/* Notification Signup */}
            <motion.div
              variants={itemVariants}
              className="max-w-lg mx-auto"
            >
              {!isSubscribed ? (
                <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for early access"
                    required
                    className="flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#025965] focus:border-transparent text-lg"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#85bd41] hover:bg-[#548816] text-white px-8 py-4 rounded-xl font-bold text-lg cursor-pointer shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 whitespace-nowrap"
                  >
                    {isSubmitting ? 'Subscribing...' : (
                      <>
                        <Bell size={20} />
                        Notify Me
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">You're In!</h3>
                  <p className="text-green-700">We'll notify you as soon as our solutions platform launches.</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}